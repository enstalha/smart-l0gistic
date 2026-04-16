# 🧠 AI Optimization Microservice

The underlying mathematical engine that executes the Vehicle Routing Problem (VRP) matching logic. Completely isolated to simulate Enterprise distributed computing.

## 🛠 Algorithmic Features
- **Haversine Distance Mapping**: Calculates true spherical distance between Earth coordinates (Lat/Lng) inside `utils/heuristic.js`.
- **Smart Matrix Scoring**: Assigns loads dynamically based on a score derived from Distance Penalties + Vehicle Capacity logic.
- **Dynamic Array Shifting**: Calculates virtual ETAs based on the simulated speed matrix across traffic zones.
