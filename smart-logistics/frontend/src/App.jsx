import React, { useState, useEffect } from 'react';

// Icons placeholder (just SVG paths to look premium)
const MapPinIcon = () => (
  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);

function App() {
  const [routes, setRoutes] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/routes')
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error("Error fetching routes:", err));
  }, []);

  const simulateAccident = () => {
    setLoading(true);
    setAlertMessage(null); // reset alert state for re-trigger capability
    fetch('http://localhost:3000/api/trigger-alert')
      .then(res => res.json())
      .then(data => {
        setAlertMessage(data.message);
        setRoutes(data.newRoute);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error triggering alert:", err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-black text-sm tracking-tighter">
              SL
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              SMART <span className="text-slate-400 font-medium">LOGISTICS</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={simulateAccident}
              disabled={loading}
              className={`relative overflow-hidden group px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-md outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                loading ? 'bg-amber-100 text-amber-600 cursor-wait' : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white hover:shadow-lg hover:shadow-red-500/40'
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <><span className="animate-spin text-lg">⏳</span> Executing AI Reroute...</>
                ) : (
                  <><span className="text-lg animate-pulse">🚨</span> Simulate Traffic Accident</>
                )}
              </div>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
               <img src="https://ui-avatars.com/api/?name=Dispatcher&background=0284c7&color=fff&bold=true" alt="User" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Toast Notification Banner (Appears smoothly) */}
        <div className={`transition-all duration-500 ease-in-out origin-top overflow-hidden ${alertMessage ? 'max-h-32 opacity-100 transform translate-y-0 relative z-10' : 'max-h-0 opacity-0 transform -translate-y-4 pointer-events-none'}`}>
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl shadow-lg shadow-red-500/10 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-500"></div>
            <div className="text-red-500 text-3xl animate-bounce">⚠️</div>
            <div>
              <h3 className="text-red-800 font-bold tracking-tight">AI PREDICTIVE ALERT</h3>
              <p className="text-red-600 font-medium">{alertMessage}</p>
            </div>
            {/* Background design elements */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* KPI Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Active Vehicles", value: "24", sub: "/ 28 Fleet", icon: "🚚", color: "blue", trend: "+2", bgColor: "bg-blue-50", textColor: "text-blue-600" },
            { title: "On-Time Delivery Rate", value: "98.4%", sub: "Live Avg", icon: "⭐", color: "emerald", trend: "+1.2%", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
            { title: "AI Routes Optimized", value: "12", sub: "Today", icon: "🧠", color: "purple", trend: "Active", bgColor: "bg-purple-50", textColor: "text-purple-600" },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${kpi.bgColor} ${kpi.textColor} shadow-inner`}>
                  {kpi.icon}
               </div>
               <div className="flex-1">
                 <p className="text-sm font-semibold text-slate-500 tracking-tight">{kpi.title}</p>
                 <div className="flex items-baseline gap-2 mt-1">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h4>
                   <span className="text-xs font-semibold text-slate-400">{kpi.sub}</span>
                 </div>
               </div>
               <div className={`self-start text-xs font-bold px-2.5 py-1 rounded-full ${kpi.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {kpi.trend}
               </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid: Map (60%) + Timeline (40%) */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* Left: Live Map Placeholder (span-3) */}
          <div className="xl:col-span-3 bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden relative min-h-[500px] flex items-center justify-center border-4 border-white isolate">
            {/* Abstract map grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
            
            {/* Glowing orb behind map pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full"></div>

            {/* Flashing "Live tracking active" badge */}
             <div className="absolute top-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-200 tracking-wider uppercase">Live Tracking Active</span>
             </div>

             <div className="text-center z-10 p-8">
                <div className="w-20 h-20 bg-slate-800/80 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-700/50 shadow-2xl shadow-black/50 rotate-3 hover:rotate-0 transition-transform duration-500">
                   <MapPinIcon />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Geospatial Routing Active</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">Integrated vector mapping is processing unit locations and real-time path optimizations.</p>
             </div>
             
             {/* Map overlays / scale */}
             <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 shadow-xl flex flex-col gap-1 items-center justify-center w-24">
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Traffic</span>
                <span className="text-sm font-black text-emerald-400 tracking-tight block w-full text-center py-1 bg-emerald-400/10 rounded">OPTIMAL</span>
             </div>
          </div>

          {/* Right: Route Timeline (span-2) */}
          <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 flex flex-col">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                     Active Itinerary <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                   </h2>
                   <p className="text-sm text-slate-500 font-medium mt-1">Route #88390-X</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm">Unit #402</span>
             </div>

             <div className="relative border-l-2 border-slate-100/80 ml-[1.125rem] space-y-6 flex-1 min-h-[400px]">
                {routes.length === 0 ? (
                  <div className="pl-8 text-sm text-slate-400">Loading route data...</div>
                ) : null}

                {routes.map((route, index) => {
                  const isOptimized = alertMessage && route.type === 'delivery' && (route.id === 4 || route.id === 3) && route.status === 'Waiting';
                  
                  return (
                  <div key={route.id} className={`relative pl-10 group transition-all duration-500 ${isOptimized ? 'animate-in slide-in-from-right-4' : ''}`}>
                    {/* Timeline Node */}
                    <span className={`absolute -left-[11px] top-1.5 h-6 w-6 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                       route.status === 'Completed' ? 'bg-slate-200 outline outline-4 outline-white outline-offset-0' :
                       route.status === 'In Transit' ? 'bg-blue-500 ring-4 ring-blue-50 shadow-md shadow-blue-500/20' :
                       'bg-white border-[3px] border-slate-200 group-hover:border-slate-300 outline outline-4 outline-white outline-offset-0'
                    }`}>
                      {route.status === 'Completed' && <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      {route.status === 'In Transit' && <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>}
                    </span>

                    {/* Content Card */}
                    <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      route.status === 'In Transit' ? 'bg-white border-blue-200 shadow-lg shadow-blue-900/5 ring-1 ring-blue-50 transform -translate-y-1' :
                      route.status === 'Completed' ? 'bg-slate-50/80 border-dashed border-slate-200 opacity-70' :
                      'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'
                    }`}>
                        {/* Progress bar background for 'In Transit' */}
                        {route.status === 'In Transit' && (
                          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400 w-1/3 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                           <h3 className={`font-bold text-base tracking-tight ${route.status === 'Completed' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                             {route.name}
                           </h3>
                           <span className="text-[13px] font-bold text-slate-400 font-mono tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md">{route.time}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${
                             route.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                             route.status === 'Completed' ? 'bg-slate-200 text-slate-600' :
                             'bg-amber-50 text-amber-700'
                           }`}>
                             {route.status}
                           </span>

                           {route.status === 'In Transit' && (
                             <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-1.5 rounded-lg">
                               On Time Estimate
                             </span>
                           )}
                           
                           {/* Highlight if it's dynamically swapped */}
                           {isOptimized && (
                               <span className="animate-pulse text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-700 rounded-lg flex items-center gap-1 shadow-sm border border-purple-200/50">
                                  <span className="text-xs">✨</span> AI Reordered
                               </span>
                           )}
                        </div>
                    </div>
                  </div>
                )})}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
