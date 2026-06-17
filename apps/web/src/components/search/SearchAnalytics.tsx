
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@tenexim/ui';

const trendData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const pieData = [
    { name: 'USA', value: 400 },
    { name: 'China', value: 300 },
    { name: 'UAE', value: 300 },
    { name: 'Vietnam', value: 200 },
];

const COLORS = ['#f59e0b', '#0f172a', '#64748b', '#cbd5e1'];

export default function SearchAnalytics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
            {/* Trend Chart */}
            <Card className="col-span-1 md:col-span-2 p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Shipment Volume Trend</h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Market Share Pie */}
            <Card className="col-span-1 p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Top Markets</h3>
                <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-800 dark:text-white">4</span>
                        <span className="text-xs font-medium text-slate-400 ml-1">Mkts</span>
                    </div>
                </div>
            </Card>

            {/* Stat Card */}
            <Card className="col-span-1 p-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 border-none flex flex-col justify-between">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">Total Value</h3>
                    <p className="text-3xl font-black">$42.8M</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/10 dark:bg-black/10 px-2 py-1 rounded mt-2">
                        +12.5% vs Last Year
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-xs opacity-70">Top Commodity:</p>
                    <p className="font-bold">Electronics</p>
                </div>
            </Card>
        </div>
    );
}
