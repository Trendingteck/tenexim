"use client";

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Ship,
    Building2,
    Globe2,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Download,
    Filter
} from 'lucide-react';
import { Button } from '@tenexim/ui';

const data = [
    { name: 'Jan', value: 4000, secondary: 2400 },
    { name: 'Feb', value: 3000, secondary: 1398 },
    { name: 'Mar', value: 2000, secondary: 9800 },
    { name: 'Apr', value: 2780, secondary: 3908 },
    { name: 'May', value: 1890, secondary: 4800 },
    { name: 'Jun', value: 2390, secondary: 3800 },
    { name: 'Jul', value: 3490, secondary: 4300 },
];

export default function DashboardOverviewPage() {
    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Welcome Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Good Afternoon, User</h2>
                    <p className="text-slate-500 dark:text-slate-400">Here's what's happening with global trade intelligence today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                    <Button className="gap-2 rounded-xl">
                        <Filter className="w-4 h-4" /> Filter Views
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Ship className="w-6 h-6 text-blue-500" />}
                    label="Tracked Shipments"
                    value="1,248"
                    change="+12.5%"
                    isUp={true}
                />
                <StatCard
                    icon={<Building2 className="w-6 h-6 text-amber-500" />}
                    label="Active Suppliers"
                    value="482"
                    change="+3.2%"
                    isUp={true}
                />
                <StatCard
                    icon={<Globe2 className="w-6 h-6 text-purple-500" />}
                    label="Trade Routes"
                    value="24"
                    change="-2"
                    isUp={false}
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
                    label="Market Value"
                    value="$12.4M"
                    change="+18.4%"
                    isUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Trade Volume Analysis</h3>
                            <p className="text-sm text-slate-500">Monthly shipment volume across all routes.</p>
                        </div>
                        <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-amber-500">
                            <option>Last 7 Months</option>
                            <option>Year to Date</option>
                        </select>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#14b8a6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Countries */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-display">Top Origin Ports</h3>
                    <div className="space-y-6">
                        <CountryProgress label="Shanghai, China" value={85} color="bg-amber-500" />
                        <CountryProgress label="Nhava Sheva, India" value={62} color="bg-blue-500" />
                        <CountryProgress label="Haiphong, Vietnam" value={45} color="bg-purple-500" />
                        <CountryProgress label="Busan, South Korea" value={28} color="bg-orange-500" />
                        <CountryProgress label="Long Beach, USA" value={15} color="bg-emerald-500" />
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quick insight</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Shipments from <strong>India</strong> have increased by 24% this month due to new textile regulations.
                        </p>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Live Market Activity</h3>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Route</th>
                                    <th className="px-6 py-4 text-right">Value</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                COMPLETED
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-slate-900 dark:text-white">Reliance Industries</span>
                                            <div className="text-[10px] text-slate-500">IND - Mumbai</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">Polypropylene Polymers</td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">JNPT → Rotterdam</td>
                                        <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white">$142,500</td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, change, isUp }: { icon: React.ReactNode, label: string, value: string, change: string, isUp: boolean }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm group hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                    {icon}
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{change}</span>
                </div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <h4 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 font-display">{value}</h4>
        </div>
    );
}

function CountryProgress({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-xs font-bold text-slate-500">{value}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={`${color} h-full rounded-full`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}
