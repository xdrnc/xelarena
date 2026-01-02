"use client";

import { useEffect, useRef, useState } from "react";

type Cell = "R" | "Y" | null;
type Board = Cell[][];

const ROWS = 6;
const COLS = 7;

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function checkWinner(board: Board): "R" | "Y" | null {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = board[row][col];
      if (!cell) continue;

      for (const [dr, dc] of directions) {
        let count = 1;

        for (let step = 1; step < 4; step++) {
          const r = row + dr * step;
          const c = col + dc * step;

          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
          if (board[r][c] !== cell) break;

          count++;
        }

        if (count === 4) return cell;
      }
    }
  }

  return null;
}


export default function Home() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"R" | "Y">("R");
  const [status, setStatus] = useState<string>("Connecting to server...");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL!;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setStatus("Alextest Simulate Connected to BackGo, records will be saved.");
    ws.onclose = () => setStatus("Alextest Simulate Disconnected from BackGo, records will not be saved.");
    ws.onerror = () => setStatus("WebSocket error.");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "echo") {
        console.log("Echo from server:", msg.data);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  function handleColumnClick(col: number) {
    if(status.includes("wins")) return; // Game over

    const newBoard = board.map((row) => [...row]);
    let placed = false;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        placed = true;
        break;
      }
    }

    if (!placed) return; // Column full

    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setStatus(`Player ${winner} wins!`);
      return;
    }

    setCurrentPlayer(currentPlayer === "R" ? "Y" : "R");

    /* alextocheckmore ws send move to server */
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "move",
          column: col,
          player: currentPlayer,
        })
      );
    }
  }
  

  return (
    <main className="flex flex-col items-center justify-center bg-slate-800 text-white py-60">
      <h1 className="text-3xl font-bold mb-4">XEL TicTacDrop</h1>
      <p className="mb-2">{status}</p>
      <p className="mb-4">Current player: {currentPlayer}</p>
      <div className="bg-blue-700 p-4 rounded-lg shadow-lg">
        {board.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((cell, cIdx) => (
              <button
                key={cIdx}
                onClick={() => handleColumnClick(cIdx)}
                className="w-12 h-12 m-1 rounded-full bg-blue-900 flex items-center justify-center"
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    cell === "R"
                      ? "bg-red-500"
                      : cell === "Y"
                      ? "bg-yellow-400"
                      : "bg-slate-800"
                  }`}
                />
              </button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
