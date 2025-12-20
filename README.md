# xelarena 
  
A real-time multiplayer game platform built with: 
  
- **Frontend:** Next.js (TypeScript, Tailwind) 
- **Backend:** Go (WebSockets, REST) 
- **Database:** PostgreSQL (via Docker) 
  
The first game implemented simulates **Connect Four** (or tictacdrop in older windows), with a real-time web UI and a WebSocket backend. 
  
## Architecture 
  
- `frontend/`: Next.js app 
- `backend/`: Go server exposing `/health` and `/ws` WebSocket endpoint 
- `infra/`: Docker Compose for PostgreSQL 
  
## Getting started 
  
### Prerequisites 
  
- Docker 
- Node.js 20+ 
- Go 1.22+ 
  
### Run Postgres
  
```bash 
cd infra 
docker compose up -d 
