import React from 'react';
import { Ship, Building2, Globe2, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  isUp: boolean;
}

function StatCard({ icon, label, value, change, isUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm group hover:border-amber-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-amber-50 transition-colors shrink-0">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${isUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <h4 className="text-lg font-black text-slate-900 mt-0.5">{value}</h4>
    </div>
  );
}

export default function StatGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<Ship className="w-4 h-4 text-amber-500" />} label="Tracked Shipments" value="1,248" change="+12.5%" isUp={true} />
      <StatCard icon={<Building2 className="w-4 h-4 text-emerald-500" />} label="Active Suppliers" value="482" change="+3.2%" isUp={true} />
      <StatCard icon={<Globe2 className="w-4 h-4 text-sky-500" />} label="Trade Route Watchlists" value="24 Nodes" change="-2 Nodes" isUp={false} />
      <StatCard icon={<TrendingUp className="w-4 h-4 text-amber-500" />} label="Total Sourced Value" value="$12.4M" change="+18.4%" isUp={true} />
    </div>
  );
}
