import React from 'react';

export default function Navbar({ addPackage, simulateHazard, loading }) {
  return (
    <nav className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-[1000] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-black text-sm tracking-tighter ring-1 ring-white/10 group-hover:shadow-indigo-500/40 transition-shadow">
            SL
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-50 transition-colors">
            SMART <span className="text-slate-400 font-medium tracking-tighter">LOGISTICS</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => simulateHazard()}
            disabled={loading}
            className={`relative overflow-hidden group px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md ${loading ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-800 border border-slate-700 hover:border-red-500/50 hover:bg-red-500/20 text-white'}`}
          >
             <span className="text-lg animate-pulse mr-2">🚨</span> Simulate Incident
          </button>
          <button
             onClick={() => addPackage()}
             disabled={loading}
             className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
          >
             {loading ? <span className="animate-spin text-lg">⏳</span> : <span>📦</span>} Add Package
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:border-transparent transition-all">
             <img src="https://ui-avatars.com/api/?name=Admin&background=1e1b4b&color=818cf8&bold=true" alt="User" />
          </div>
        </div>
      </div>
    </nav>
  );
}
