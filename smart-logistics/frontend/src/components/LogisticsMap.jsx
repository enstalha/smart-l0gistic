import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, useMap, Popup, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

const getTruckIcon = (color) => L.divIcon({
  html: `<div class="relative flex items-center justify-center">
            <div class="absolute rounded-full h-12 w-12 animate-ping opacity-30 shadow-xl" style="background-color: ${color}; box-shadow: 0 0 20px ${color}"></div>
            <div class="rounded-full h-10 w-10 flex items-center justify-center border-2 border-slate-900 shadow-xl relative z-10 text-lg" style="background-color: ${color}">
               🚚
            </div>
         </div>`,
  className: 'custom-truck-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

function MapFocus() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 100);
  }, [map]);
  return null;
}

function MapClickListener({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function LogisticsMap({ fleets, fleetGeometries, activeFilter, handleMapClick, alertData }) {
  return (
    <div className="xl:col-span-3 bg-slate-900/40 backdrop-blur-md rounded-[2rem] shadow-2xl relative min-h-[600px] border border-slate-800 isolate overflow-hidden group">
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full transition-colors duration-1000`}></div>

       {alertData?.env && (
         <div className="absolute top-20 right-6 z-[400] bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 w-48 origin-top-right animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Live Event</span>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Active</span>
            </div>
            <div>
               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Type</div>
               <div className="text-sm font-bold text-red-400">{alertData.env.condition}</div>
            </div>
            <div>
               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Severity</div>
               <div className="text-sm font-bold text-slate-200">{alertData.env.severity}</div>
            </div>
         </div>
       )}

       <div className="absolute top-6 left-6 z-[400] bg-slate-950/80 backdrop-blur-md border border-indigo-500/50 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-105 transition-transform cursor-crosshair">
          <span className="text-lg animate-pulse">🎯</span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-200">
            Interactive Mode: Click map to drop package
          </span>
       </div>

       <MapContainer center={[40.7300, -73.9800]} zoom={13} zoomControl={false} scrollWheelZoom={true} className="absolute inset-0 w-full h-full z-10 cursor-crosshair" style={{ background: 'transparent' }}>
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />
          <MapFocus />
          <MapClickListener onMapClick={handleMapClick} />

          {fleets.filter(f => activeFilter === 'All' || f.id === activeFilter).map(fleet => (
             <React.Fragment key={fleet.id}>
               
               {fleetGeometries[fleet.id] && fleetGeometries[fleet.id].length > 0 && (
                  <Polyline positions={fleetGeometries[fleet.id]} pathOptions={{ color: fleet.color, weight: 4, className: 'animated-polyline' }} />
               )}

               {fleet.route.map(r => r.pos && (
                  <Circle key={r.id} center={r.pos} pathOptions={{ color: fleet.color, weight: 2, fillColor: '#0f172a', fillOpacity: 1 }} radius={60} />
               ))}

               {fleet.pos && (
                 <Marker position={fleet.pos} icon={getTruckIcon(fleet.color)}>
                    <Popup className="dark-popup font-bold">{fleet.id} Active</Popup>
                 </Marker>
               )}
             </React.Fragment>
          ))}

          {alertData?.coord && (
             <Circle center={alertData.coord} pathOptions={{ color: '#ef4444', weight: 2, fillColor: '#ef4444', fillOpacity: 0.15 }} radius={700}>
                <Popup className="dark-popup font-bold text-red-400 uppercase tracking-widest">{alertData.env.condition}</Popup>
             </Circle>
          )}
       </MapContainer>

       <div className="absolute bottom-6 left-6 z-[400] bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/30 shadow-2xl flex items-center gap-4 transition-all hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 flex items-center justify-center text-2xl shadow-[inset_0_0_15px_rgba(99,102,241,0.2)] border border-indigo-500/30">
            🛰️
          </div>
          <div>
             <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Network Active
             </span>
             <span className="text-base font-black text-indigo-100 font-mono tracking-tight bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-inner">
                {fleets.length} Fleet Units Online
             </span>
          </div>
       </div>
    </div>
  );
}
