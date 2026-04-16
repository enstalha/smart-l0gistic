const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint 1: Initial static routes
app.get('/api/routes', (req, res) => {
    res.json([
        { id: 1, name: 'Warehouse', status: 'In Transit', type: 'origin', time: '08:00 AM' },
        { id: 2, name: 'Stop A', status: 'Waiting', type: 'delivery', time: '09:15 AM' },
        { id: 3, name: 'Stop B', status: 'Waiting', type: 'delivery', time: '10:30 AM' },
        { id: 4, name: 'Stop C', status: 'Waiting', type: 'delivery', time: '11:45 AM' }
    ]);
});

// Endpoint 2: Simulate AI Alert and updated routes
app.get('/api/trigger-alert', (req, res) => {
    setTimeout(() => {
        res.json({
            message: "⚠️ AI ALERT: Traffic accident detected. Route dynamically optimized.",
            newRoute: [
                { id: 1, name: 'Warehouse', status: 'Completed', type: 'origin', time: '08:00 AM' },
                { id: 2, name: 'Stop A', status: 'In Transit', type: 'delivery', time: '09:20 AM' },
                { id: 4, name: 'Stop C', status: 'Waiting', type: 'delivery', time: '10:15 AM' }, // Swapped B & C
                { id: 3, name: 'Stop B', status: 'Waiting', type: 'delivery', time: '11:30 AM' }
            ]
        });
    }, 1000); // 1 second timeout
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
