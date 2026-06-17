"use client";

import React from 'react';
import {
    TrendingUp,
    Ship,
    Building2,
    Globe2,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    ShieldAlert,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@tenexim/ui';
import dynamic from 'next/dynamic';

// Dynamic Load for Recharts component to avoid initial hydration overhead
const SourcingTrendChart = dynamic(() => import('@/components/overview/SourcingTrendChart'), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full bg-slate-950 rounded-lg border border-slate-900 animate-pulse flex items-center justify-center text-[10px] font-mono text-slate-500 tracking-widest uppercase">Loading Analytics...</div>
});

export default function DashboardOverviewPage() {
    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">Operational Overview Deck</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time macro trade volumes, maritime tracking metrics, and custom watchlists.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="gap-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider h-9">
                        <Download className="w-3.5 h-3.5" /> Export Manifest Data
                    </Button>
                    <Button className="gap-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider h-9 bg-slate-900 text-white hover:bg-slate-800 border-none">
                        <Filter className="w-3.5 h-3.5" /> Exclusions Filters
                    </Button>
                </div>
            </div>

            {/* Tactical KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Ship className="w-4 h-4 text-amber-500" />}
                    label="Tracked Shipments"
                    value="1,248"
                    change="+12.5%"
                    isUp={true}
                />
                <StatCard
                    icon={<Building2 className="w-4 h-4 text-emerald-500" />}
                    label="Active Suppliers"
                    value="482"
                    change="+3.2%"
                    isUp={true}
                />
                <StatCard
                    icon={<Globe2 className="w-4 h-4 text-sky-500" />}
                    label="Trade Route Watchlists"
                    value="24 Nodes"
                    change="-2 Nodes"
                    isUp={false}
                />
                <StatCard
                    icon={<TrendingUp className="w-4 h-4 text-amber-500" />}
                    label="Total Sourced Value"
                    value="$12.4M"
                    change="+18.4%"
                    isUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Visual Chart Element */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Volume Metrics</span>
                            <h3 className="text-xs font-bold text-slate-900 mt-0.5">Sovereign Supply Volume Trend</h3>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:border-amber-500">
                            <option>Last 7 Months</option>
                            <option>Year to Date</option>
                        </select>
                    </div>

                    <SourcingTrendChart />
                </div>

                {/* Country progress */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Geographic scope</span>
                        <h3 className="text-xs font-bold text-slate-900 mt-0.5 mb-4">Top Sourcing Origin Ports</h3>
                        
                        <div className="space-y-3">
                            <CountryProgress label="Shanghai, China" value={85} color="bg-amber-500" />
                            <CountryProgress label="Nhava Sheva, India" value={62} color="bg-amber-600" />
                            <CountryProgress label="Haiphong, Vietnam" value={45} color="bg-slate-700" />
                            <CountryProgress label="Busan, South Korea" value={28} color="bg-slate-400" />
                        </div>
                    </div>

                    <div className="mt-4 p-3.5 bg-amber-50/50 border border-amber-100 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">REGULATORY INSIGHT</span>
                        </div>
                        <p className="text-[10px] text-amber-900 leading-relaxed font-semibold">
                            Sourcing manifests originating from <strong>Vietnam</strong> have increased by 24% this month, suggesting tariff-avoidance detours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Activities ledger */}
            <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Sourcing Activity Ledger</span>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black text-amber-600 uppercase">View All Ledger Logs</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono">
                        <thead>
                            <tr className="bg-slate-50 text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200">
                                <th className="px-6 py-3">Audit Status</th>
                                <th className="px-6 py-3">Exporter Account</th>
                                <th className="px-6 py-3">Product Classification</th>
                                <th className="px-6 py-3">Route Coordinates</th>
                                <th className="px-6 py-3 text-right">Declared Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[10px] font-medium text-slate-700">
                            {[
                                { status: 'COMPLIANT', company: 'SICHUAN ENERGY LITHIUM [CHN]', product: 'Semi-Grade Lithium Cells', route: 'Shanghai → Long Beach', value: '$142,500' },
                                { status: 'COMPLIANT', company: 'SIEMENS WAFERS GMBH [DEU]', product: 'Power Transform Wafers', route: 'Hamburg → New York', value: '$84,200' },
                                { status: 'UFLPA EXCLUSION', company: 'DA NANG METALS FACTORY [VNM]', product: 'Forced-Heat Elements', route: 'Da Nang → Long Beach', value: '$221,000' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-black border ${row.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 font-bold text-slate-900">{row.company}</td>
                                    <td className="px-6 py-3.5 text-slate-500">{row.product}</td>
                                    <td className="px-6 py-3.5 text-slate-500">{row.route}</td>
                                    <td className="px-6 py-3.5 text-right font-bold text-slate-900">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, change, isUp }: { icon: React.ReactNode, label: string, value: string, change: string, isUp: boolean }) {
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
            <h4 className="text-lg font-black text-slate-900 mt-0.5 font-display">{value}</h4>
        </div>
    );
}

function CountryProgress({ label, value, color }: { label: string, value: number, color: string }) {
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