"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SourcingTrendChartProps {
  data?: { name: string; value: number }[];
}

const defaultData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export default function SourcingTrendChart({ data = defaultData }: SourcingTrendChartProps) {
  return (
    <div className="h-[240px] w-full p-2 bg-slate-950 rounded-lg border border-slate-900">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #141433', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
          <Area type="monotone" dataKey="value" stroke="#d97706" strokeWidth={1.5} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
