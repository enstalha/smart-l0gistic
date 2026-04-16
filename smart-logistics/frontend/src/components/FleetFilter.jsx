import React from 'react';

export default function FleetFilter({ activeFilter, setActiveFilter, fleets }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 custom-scrollbar lg:justify-start">
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1">Focus Mode:</span>
       <button onClick={() => setActiveFilter('All')} className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-widest font-black transition-all ${activeFilter === 'All' ? 'bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-transparent' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
          Global Network
       </button>
       {fleets.map(f => (
         <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-widest font-black transition-all ${activeFilter === f.id ? 'text-white border-transparent' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'}`} style={activeFilter === f.id ? { backgroundColor: f.color, boxShadow: `0 0 15px ${f.color}80` } : {}}>
            {f.id} Active
         </button>
       ))}
    </div>
  );
}
