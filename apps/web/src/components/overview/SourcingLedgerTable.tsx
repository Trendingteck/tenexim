import React from 'react';

interface LedgerRow {
  status: string;
  company: string;
  product: string;
  route: string;
  value: string;
}

const mockRows: LedgerRow[] = [
  { status: 'COMPLIANT', company: 'SICHUAN ENERGY LITHIUM [CHN]', product: 'Semi-Grade Lithium Cells', route: 'Shanghai → Long Beach', value: '$142,500' },
  { status: 'COMPLIANT', company: 'SIEMENS WAFERS GMBH [DEU]', product: 'Power Transform Wafers', route: 'Hamburg → New York', value: '$84,200' },
  { status: 'UFLPA EXCLUSION', company: 'DA NANG METALS FACTORY [VNM]', product: 'Forced-Heat Elements', route: 'Da Nang → Long Beach', value: '$221,000' },
];

export default function SourcingLedgerTable() {
  return (
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
        {mockRows.map((row, idx) => (
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
  );
}
