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
  const [alertData, setAlertData] = useState(null);

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

  const simulateHazard = () => {
    setLoading(true);
    setAiCalcs(prev => prev + 58); 
    fetch('http://localhost:3000/api/trigger-alert')
      .then(res => res.json())
      .then(data => {
        setAlertData(data);
        fetchFleets();
      })
      .finally(() => setLoading(false));
  };

  const handleMapClick = (latlng) => addPackage(latlng.lat, latlng.lng);
  const totalPackages = fleets.reduce((acc, f) => acc + f.route.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20 selection:bg-indigo-500/30">
      <Navbar addPackage={addPackage} simulateHazard={simulateHazard} loading={loading} />

      <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 ${alertData ? 'max-h-32 opacity-100 transform translate-y-0 relative z-[999]' : 'max-h-0 opacity-0 transform -translate-y-4 pointer-events-none'}`}>
        <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-2xl shadow-2xl shadow-red-500/10 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
          <div className="text-red-500 text-3xl animate-bounce drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">⚠️</div>
          <div>
            <h3 className="text-red-400 font-bold tracking-widest text-sm uppercase">AI Predictive Incident Alert</h3>
            <p className="text-slate-300 font-medium mt-0.5">{alertData?.message}</p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-500/10 to-transparent"></div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <KPIWidgets totalPackages={totalPackages} aiCalcs={aiCalcs} />
        <FleetFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} fleets={fleets} />
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <LogisticsMap fleets={fleets} fleetGeometries={fleetGeometries} activeFilter={activeFilter} handleMapClick={handleMapClick} alertData={alertData} />
          <Timeline fleets={fleets} activeFilter={activeFilter} deletePackage={deletePackage} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;
