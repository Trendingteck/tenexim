"use client";
import React, { useState } from 'react';
import { Search, ListFilter, Globe, Calendar, ChevronDown } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@tenexim/ui';

export default function FilterConsole() {
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(true);

  return (
    <Card className="border border-slate-200/60 shadow-sm bg-white overflow-hidden">
      <CardHeader className="py-3.5 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Search className="w-4 h-4 text-slate-500" />
            Filter Parameters
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 h-7"
            onClick={() => setShowFilters(!showFilters)}
          >
            <ListFilter className="w-3.5 h-3.5 mr-1.5" />
            {showFilters ? 'Hide Parameters' : 'Show Parameters'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by Product Name, HS Code, or Bill of Lading..."
              className="h-10 pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg text-xs font-medium focus:ring-amber-500 transition-all"
            />
          </div>
          <Button variant="brand" className="h-10 px-6 text-xs bg-slate-900 text-white hover:bg-slate-800 font-bold tracking-wider uppercase">
            Analyze Sourcing Nodes
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Operation Type</label>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFilterType('import')}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${filterType === 'import' ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Import
                </button>
                <button
                  onClick={() => setFilterType('export')}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${filterType === 'export' ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Export
                </button>
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${filterType === 'all' ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Both
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Origin / Destination</label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <select className="w-full h-8 pl-8 pr-6 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold appearance-none outline-none">
                  <option>India (Import from India)</option>
                  <option>China</option>
                  <option>United States</option>
                  <option>Germany</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Date Range (From)</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <Input type="date" className="h-8 pl-8 bg-slate-50 border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Date Range (To)</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <Input type="date" className="h-8 pl-8 bg-slate-50 border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
