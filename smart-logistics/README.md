# 🚚 SMART LOGISTICS

A premium, AI-powered multi-vehicle fleet management system.

## 🌟 Overview
Smart Logistics is an enterprise-grade hackathon prototype designed to showcase real-time Vehicle Routing Problem (VRP) solving. It orchestrates multiple delivery vehicles (Fleet) dynamically across New York City, reacting instantly to live package drops, cancellations, and hazardous traffic incidents.

## 🏗️ Architecture
This system is composed of three decoupled, scalable layers:
1. **Frontend**: React (Vite) + Tailwind CSS + Leaflet Maps
2. **Backend Gateway**: Node.js Proxy & State Manager
3. **AI Microservice**: Node.js Math Engine (VRP Heuristics)

## 🚀 Quick Start
To run the full stack locally:
1. `cd ai-service && npm start` (Port 3001)
2. `cd backend && node server.js` (Port 3000)
3. `cd frontend && npm run dev` (Port 8000)
