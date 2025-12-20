package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gorilla/websocket"
    "github.com/joho/godotenv"
    "github.com/jackc/pgx/v5/pgxpool"
)

var (
    db      *pgxpool.Pool
    upgrader = websocket.Upgrader{
        CheckOrigin: func(r *http.Request) bool { return true },
    }
)

func main() {
    _ = godotenv.Load()

    databaseURL := getenv("DATABASE_URL", "postgres://mgp:mgp@localhost:5432/mgp_dev")
    port := getenv("PORT", "4000")

    var err error
    db, err = pgxpool.New(context.Background(), databaseURL)
    if err != nil {
        log.Fatalf("Unable to connect to DB: %v", err)
    }
    defer db.Close()

    http.HandleFunc("/health", handleHealth)
    http.HandleFunc("/ws", handleWebSocket)

    fmt.Printf("Backend listening on :%s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    _, _ = w.Write([]byte("OK"))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Upgrade error:", err)
        return
    }
    defer conn.Close()

    for {
        var msg map[string]interface{}
        if err := conn.ReadJSON(&msg); err != nil {
            log.Println("Read error:", err)
            break
        }

        // For now, just echo back
        if err := conn.WriteJSON(map[string]interface{}{
            "type": "echo",
            "data": msg,
        }); err != nil {
            log.Println("Write error:", err)
            break
        }
    }
}

func getenv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}
