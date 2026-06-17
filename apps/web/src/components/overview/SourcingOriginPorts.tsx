import React from 'react';

function CountryProgress({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1 text-[10px] font-semibold">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-400">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

export default function SourcingOriginPorts() {
  return (
    <div className="space-y-3">
      <CountryProgress label="Shanghai, China" value={85} color="bg-amber-500" />
      <CountryProgress label="Nhava Sheva, India" value={62} color="bg-amber-600" />
      <CountryProgress label="Haiphong, Vietnam" value={45} color="bg-slate-700" />
      <CountryProgress label="Busan, South Korea" value={28} color="bg-slate-400" />
    </div>
  );
}
