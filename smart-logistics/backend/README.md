# ⚙️ Backend Gateway (Node.js)

The central orchestrator and REST API proxy for Smart Logistics.

## 🛠 Features
- **In-Memory Volatile DB**: Manages the core array of package origins, handling insertions and deletions.
- **Proxy Relay**: Receives frontend requests and bridges them strictly to the `ai-service` on port 3001 to resolve heavy computations without blocking UI state.
- **Event Injection**: Houses the endpoints `/api/trigger-alert` to generate global NYC traffic incident reports randomly.
