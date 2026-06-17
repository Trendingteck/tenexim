import React from 'react';
import { Button } from '@tenexim/ui';

export default function TablePagination() {
  return (
    <div className="flex items-center justify-between px-2 text-[10px]">
      <div className="text-slate-500 font-bold uppercase tracking-wider">
        Showing <span className="text-slate-900 font-black">1 to 5</span> of 128,492 entries
      </div>
      <div className="flex items-center space-x-1.5 bg-white p-1 rounded-lg border border-slate-200/60 shadow-sm">
        <Button variant="ghost" className="h-8 px-3 rounded font-bold uppercase text-[9px] tracking-wider" disabled>Previous</Button>
        <Button variant="brand" className="h-7 w-7 rounded bg-amber-500 text-slate-950 font-black text-[10px]">1</Button>
        <Button variant="ghost" className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100 font-bold text-[10px]">2</Button>
        <Button variant="ghost" className="h-8 px-3 rounded font-bold uppercase text-[9px] tracking-wider">Next</Button>
      </div>
    </div>
  );
}
