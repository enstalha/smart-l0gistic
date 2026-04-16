import React from 'react';

export default function KPIWidgets({ totalPackages, aiCalcs }) {
  const widgets = [
    { title: "Active Drop Nodes", value: totalPackages.toString(), sub: "Network Active", icon: "📍", color: "blue", trend: "Tracking", border: "border-blue-500/20", glow: "shadow-blue-500/5", bg: "bg-blue-500/10", text: "text-blue-400" },
    { title: "System Efficiency", value: "99.1%", sub: "SLA Limit", icon: "⚡", color: "emerald", trend: "Optimal", border: "border-emerald-500/20", glow: "shadow-emerald-500/5", bg: "bg-emerald-500/10", text: "text-emerald-400" },
    { title: "AI Matrix Re-calcs", value: aiCalcs.toLocaleString(), sub: "24h Session", icon: "🧠", color: "purple", trend: "Learning", border: "border-purple-500/20", glow: "shadow-purple-500/5", bg: "bg-purple-500/10", text: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {widgets.map((kpi, idx) => (
         <div key={idx} className={`bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border ${kpi.border} flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group`}>
            {/* Ambient Glow */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${kpi.bg} blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${kpi.bg} ${kpi.text} ring-1 ring-white/5`}>
                 {kpi.icon}
              </div>
              <div className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${kpi.border} ${kpi.text} bg-slate-950/50`}>
                 {kpi.trend}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-sm font-semibold text-slate-400 tracking-tight">{kpi.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-3xl font-black text-white tracking-tighter drop-shadow-sm">{kpi.value}</h4>
                <span className="text-xs font-semibold text-slate-500">{kpi.sub}</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                 <div className={`h-full rounded-full ${kpi.bg.replace('/10', '/80')} w-[85%] shadow-[0_0_10px_currentColor] ${kpi.text}`}></div>
              </div>
            </div>
         </div>
      ))}
    </div>
  );
}
