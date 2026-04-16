const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let packages = [
    { id: 2, name: 'Sector 7 (Tech Center)', timeWindow: '09:00 - 10:00 AM', pos: [40.7300, -73.9950], weight: 20, urgency: 'Normal' },
    { id: 3, name: 'North Node', timeWindow: '10:00 - 11:30 AM', pos: [40.7400, -73.9800], weight: 10, urgency: 'Normal' },
    { id: 4, name: 'East Side Hub', timeWindow: '11:30 - 12:30 PM', pos: [40.7500, -73.9700], weight: 15, urgency: 'Normal' },
    { id: 5, name: 'Wall St Financial', timeWindow: '13:00 - 14:00 PM', pos: [40.7050, -74.0090], weight: 5, urgency: 'High' },
    { id: 6, name: 'Brooklyn Heights', timeWindow: '14:00 - 15:30 PM', pos: [40.6950, -73.9900], weight: 25, urgency: 'Normal' }
];

let currentFleets = [];

// 1. Core integration: Contact AI service to optimize layout
async function triggerAIOptimization() {
    try {
        const response = await fetch('http://localhost:3001/api/ai/optimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packages })
        });
        const data = await response.json();
        currentFleets = data.fleets;
    } catch (e) {
        console.error("AI service error:", e);
    }
}

// 2. Main route endpoint
app.get('/api/routes', async (req, res) => {
    if (currentFleets.length === 0) await triggerAIOptimization();
    res.json(currentFleets);
});

// 3. Hackathon Demo - Product Flow (Package Creation)
app.post('/api/packages', async (req, res) => {
    const newPkg = req.body;
    // Add unique timestamp ID so we don't accidentally get duplicate deletions
    newPkg.id = Date.now() + Math.floor(Math.random() * 100); 
    newPkg.weight = 10;
    packages.push(newPkg);
    
    // Automatically trigger AI recalculation
    await triggerAIOptimization();
    res.json({ status: 'success' }); // Just returning success. Frontend will re-fetch /api/routes
});

// 3.5 Hackathon Demo - Delete / Cancel Node 
app.delete('/api/packages/:id', async (req, res) => {
    const targetId = parseInt(req.params.id);
    packages = packages.filter(p => p.id !== targetId);
    
    // Trigger AI to recompute the entire remaining routing Matrix
    await triggerAIOptimization();
    res.json({ status: 'deleted' });
});

// --- NEW APP ROUTES FOR HACKATHON REQUIREMENTS ---

// 4. User Management Mock (Basic System)
app.get('/api/users', (req, res) => {
    res.json([{ id: 101, role: 'Dispatcher', name: 'Admin Team' }, { id: 102, role: 'Courier', name: 'Unit 402' }]);
});

// 5. ML ETA Prediction Endpoint
app.post('/api/ai/predict-eta', (req, res) => {
    res.json({ 
        eta: "14:22:00", 
        confidence_score: 0.94, 
        factors: ["heavy_traffic", "rain_delay"] 
    });
});

app.listen(port, () => {
    console.log(`Smart Logistics Backend Gateway running on http://localhost:${port}`);
    triggerAIOptimization();
});
