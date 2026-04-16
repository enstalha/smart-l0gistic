import React from 'react';

export default function Timeline({ fleets, activeFilter, deletePackage, loading }) {
  return (
    <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur bg-blend-overlay rounded-[2rem] shadow-2xl border border-slate-800 p-8 flex flex-col relative overflow-hidden">
       <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full"></div>

       <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
             <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
               Multi-Vehicle AI Distribution
             </h2>
             <p className="text-sm text-slate-400 font-medium mt-1">Smart Match Capability</p>
          </div>
          <button onClick={() => alert("Downloading Manifest CSV...")} 
               className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-full shadow-sm tracking-widest transition-colors flex items-center gap-1.5">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
               EXPORT CSV
          </button>
       </div>

       <div className="relative flex-1 min-h-[400px] max-h-[600px] overflow-y-auto pr-4 pb-4 z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
          {fleets.length === 0 ? (
            <div className="text-sm text-slate-500 animate-pulse text-center mt-10">Synchronizing AI Multi-Fleet network...</div>
          ) : null}

          {fleets.filter(f => activeFilter === 'All' || f.id === activeFilter).map(fleet => (
             <div key={fleet.id} className="mb-10 last:mb-0">
               <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md py-3 px-4 rounded-xl border border-slate-800 mb-4 flex items-center justify-between shadow-lg z-20">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fleet.color, boxShadow: `0 0 10px ${fleet.color}` }}></div>
                     <h3 className="font-bold text-slate-200 tracking-tight">{fleet.id} Routing Log</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 border border-slate-800">
                     LOAD: {fleet.load} / {fleet.capacity}KG
                  </span>
               </div>

               <div className="border-l-2 border-slate-800 ml-5 space-y-6">
                  {fleet.route.map((route) => (
                     <div key={route.id} className="relative pl-8 group transition-all duration-700 animate-in slide-in-from-right-4">
                        <span className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full flex items-center justify-center z-10 bg-slate-950 border-[3px]" style={{ borderColor: fleet.color }}></span>

                        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <h4 className="font-bold text-sm tracking-tight text-slate-300">{route.name}</h4>
                                 {route.timeWindow && <div className="text-[10px] font-bold mt-1 opacity-80" style={{ color: fleet.color }}>🕒 {route.timeWindow}</div>}
                              </div>
                              <div className="flex items-center gap-3">
                                 {route.type !== 'origin' && (
                                   <button onClick={() => deletePackage(route.id)} disabled={loading} className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 p-1 rounded-md transition-colors shadow-sm active:scale-95" title="Cancel Order">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                   </button>
                                 )}
                                 <span className="text-[11px] font-bold text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                    {route.time}
                                 </span>
                              </div>
                           </div>
                           {(route.delayRisk > 0) && (
                              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border mt-2 inline-block bg-amber-500/10 text-amber-500 border-amber-500/20">
                                 Risk: {route.delayRisk}%
                              </span>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
             </div>
          ))}
       </div>
    </div>
  );
}
