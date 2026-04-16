const express = require('express');
const cors = require('cors');
const { getDistance, calculateMatchScore } = require('./utils/heuristic');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/ai/optimize', (req, res) => {
    const { packages } = req.body;
    
    // Seed 3 baseline vehicles deployed across distinct NYC coordinates
    let fleet = [
       { id: 'Unit 402', color: '#6366f1', pos: [40.7128, -74.0060], route: [], currentTimeMinutes: 8*60, capacity: 100, load: 0 },
       { id: 'Unit 405', color: '#10b981', pos: [40.7350, -73.9600], route: [], currentTimeMinutes: 8*60, capacity: 100, load: 0 },
       { id: 'Unit 408', color: '#f43f5e', pos: [40.7500, -74.0000], route: [], currentTimeMinutes: 8*60, capacity: 100, load: 0 }
    ];

    let unassigned = [...packages];

    // Priority clustering (VRP smart matching)
    while (unassigned.length > 0) {
        let pack = unassigned.shift();
        
        // Evaluate Match Score against all fleet vehicles
        let bestVehicle = fleet.reduce((prev, current) => {
            return (calculateMatchScore(pack, current) > calculateMatchScore(pack, prev)) ? current : prev;
        });

        // Add package to optimal vehicle
        let dist = getDistance(bestVehicle.pos, pack.pos);
        let travelTime = (dist * 3) + 10 + Math.floor(Math.random() * 15);
        bestVehicle.currentTimeMinutes += travelTime;
        
        let hrs = Math.floor(bestVehicle.currentTimeMinutes / 60);
        let mins = Math.floor(bestVehicle.currentTimeMinutes % 60);
        let ampm = hrs >= 12 ? 'PM' : 'AM';
        let displayHrs = hrs > 12 ? hrs - 12 : hrs;
        if (displayHrs === 0) displayHrs = 12;
        
        pack.time = `${displayHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
        pack.delayRisk = Math.floor(Math.random() * 30);
        pack.status = 'Waiting';
        pack.type = 'delivery';
        
        bestVehicle.route.push({...pack});
        bestVehicle.pos = pack.pos; // Vehicle advances dynamically
        bestVehicle.load += (pack.weight || 10);
    }

    // Force base node insertions before transit
    fleet.forEach(v => {
       v.route.unshift({
           id: v.id + '_base',
           name: `${v.id} Dispatch Hub`,
           status: 'Completed',
           type: 'origin',
           time: '08:00 AM',
           timeWindow: '08:00 - 08:30 AM',
           delayRisk: 0,
           pos: [v.pos[0] + (Math.random()*0.02 - 0.01), v.pos[1] + (Math.random()*0.02 - 0.01)] // Staggered base logic
       });
    });

    res.json({ fleets: fleet });
});

app.listen(port, () => {
    console.log(`AI Microservice (Optimization & ETA Algorithms) running on http://localhost:${port}`);
});
