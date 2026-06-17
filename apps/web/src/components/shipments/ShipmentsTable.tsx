import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Button } from '@tenexim/ui';
import { Building2, ArrowRightLeft, MoreHorizontal } from 'lucide-react';

export default function ShipmentsTable() {
  return (
    <Table className="font-mono text-[10px]">
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="w-[120px] font-black text-[8px] uppercase tracking-wider pl-4">Manifest ID</TableHead>
          <TableHead className="font-black text-[8px] uppercase tracking-wider">Product Class</TableHead>
          <TableHead className="font-black text-[8px] uppercase tracking-wider">Shipper / Consignee</TableHead>
          <TableHead className="font-black text-[8px] uppercase tracking-wider text-center">Route Vectors</TableHead>
          <TableHead className="font-black text-[8px] uppercase tracking-wider">Declared Value</TableHead>
          <TableHead className="font-black text-[8px] uppercase tracking-wider">Audit Exclusion</TableHead>
          <TableHead className="text-right pr-4 font-black text-[8px] uppercase tracking-wider">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((i) => (
          <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
            <TableCell className="font-bold text-slate-900 pl-4">
              #TNX-{828394 + i}
            </TableCell>
            <TableCell className="max-w-[250px]">
              <div className="font-bold text-slate-900 truncate">5G Core Infrastructure Components</div>
              <div className="text-[8px] font-black text-slate-400 mt-0.5 uppercase">HS CODE: 851762</div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 font-bold text-slate-700">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  Tata Communications Ltd
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <ArrowRightLeft className="w-3 h-3 shrink-0" />
                  Verizon Network Systems
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-900">INMAA</span>
                  <span className="text-[8px] text-slate-400 uppercase">Chennai</span>
                </div>
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-900">USLAX</span>
                  <span className="text-[8px] text-slate-400 uppercase">Los Angeles</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-black text-slate-900 text-xs">$452,000</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase">USD</div>
            </TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-black border ${i % 3 === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                {i % 3 === 0 ? "CONFIRMED" : "IN TRANSIT"}
              </span>
            </TableCell>
            <TableCell className="text-right pr-4">
              <Button variant="ghost" size="icon" className="rounded h-8 w-8">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
