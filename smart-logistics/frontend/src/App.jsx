import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KPIWidgets from './components/KPIWidgets';
import FleetFilter from './components/FleetFilter';
import LogisticsMap from './components/LogisticsMap';
import Timeline from './components/Timeline';

function App() {
  const [fleets, setFleets] = useState([]);
  const [fleetGeometries, setFleetGeometries] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiCalcs, setAiCalcs] = useState(1842); 
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchFleets = () => {
    fetch('http://localhost:3000/api/routes')
      .then(res => res.json())
      .then(data => setFleets(data))
      .catch(err => console.error("Error fetching fleets:", err));
  };

  useEffect(() => {
    fetchFleets();
  }, []);

  useEffect(() => {
    if(fleets.length === 0) return;
    
    Promise.all(fleets.map(f => {
       const routePositions = f.route.filter(r => r.pos).map(r => r.pos);
       if(routePositions.length < 2) return Promise.resolve({ id: f.id, coords: routePositions, color: f.color });
       
       const coordsStr = routePositions.map(p => `${p[1]},${p[0]}`).join(';');
       return fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`)
         .then(res => res.json())
         .then(data => {
            if(data.code === 'Ok' && data.routes?.[0]) {
               return { id: f.id, coords: data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), color: f.color };
            }
            return { id: f.id, coords: routePositions, color: f.color };
         })
         .catch(() => ({ id: f.id, coords: routePositions, color: f.color }));
    }))
    .then(results => {
       const map = {};
       results.forEach(r => map[r.id] = r.coords);
       setFleetGeometries(map);
    });
  }, [fleets]);

  const addPackage = (lat, lng) => {
    setLoading(true);
    setAiCalcs(prev => prev + 1); 
    const injectLat = lat || 40.7300 + (Math.random() * 0.05 - 0.025);
    const injectLng = lng || -74.0000 + (Math.random() * 0.04 - 0.02);
    
    fetch('http://localhost:3000/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: `Live Drop #${Math.floor(Math.random()*1000)}`, 
        timeWindow: '14:00 - 15:00 PM', 
        pos: [injectLat, injectLng],
        weight: 15, urgency: 'Normal'
      })
    })
    .then(() => fetchFleets())
    .finally(() => setLoading(false));
  };

  const deletePackage = (id) => {
    setLoading(true);
    setAiCalcs(prev => prev + 1); 
    fetch(`http://localhost:3000/api/packages/${id}`, { method: 'DELETE' })
      .then(() => fetchFleets())
      .finally(() => setLoading(false));
  };

  const handleMapClick = (latlng) => addPackage(latlng.lat, latlng.lng);
  const totalPackages = fleets.reduce((acc, f) => acc + f.route.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20 selection:bg-indigo-500/30">
      <Navbar addPackage={addPackage} loading={loading} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <KPIWidgets totalPackages={totalPackages} aiCalcs={aiCalcs} />
        <FleetFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} fleets={fleets} />
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <LogisticsMap fleets={fleets} fleetGeometries={fleetGeometries} activeFilter={activeFilter} handleMapClick={handleMapClick} />
          <Timeline fleets={fleets} activeFilter={activeFilter} deletePackage={deletePackage} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;
