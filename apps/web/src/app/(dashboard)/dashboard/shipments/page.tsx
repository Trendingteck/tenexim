"use client";

import * as React from 'react';
import { useState } from 'react';
import {
    Plus,
    Search,
    Download,
    MoreHorizontal,
    ArrowRightLeft,
    Calendar,
    Building2,
    ChevronDown,
    Globe,
    Clock,
    Settings2,
    ListFilter
} from 'lucide-react';
import {
    Button,
    Input,
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from '@tenexim/ui';

export default function ShipmentsPage() {
    const [filterType, setFilterType] = useState('all');
    const [showFilters, setShowFilters] = useState(true);

    return (
        <div className="space-y-5 animate-fade-in-up pb-10 max-w-[1600px] mx-auto">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                        Global Shipments Ledger
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Filter, audit, and analyze active Bills of Lading in real time.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="rounded-lg font-bold text-[10px] uppercase tracking-wider px-4 h-9">
                        <Download className="w-4 h-4 mr-1.5" />
                        Export Ledger
                    </Button>
                    <Button variant="brand" size="sm" className="rounded-lg font-bold text-[10px] uppercase tracking-wider h-9 bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-glow">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Record
                    </Button>
                </div>
            </div>

            {/* Filter Console */}
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
                        <div className="flex-[2] relative">
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

            {/* Shipment Grid Plate */}
            <Card className="border border-slate-200/60 overflow-hidden shadow-sm bg-white">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="py-0.5 px-2 bg-white border-slate-200 text-slate-600 text-[9px] font-black uppercase">
                            128,492 Records Found
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            Sync active
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg gap-1.5 font-bold text-[10px] h-8 border-slate-200">
                        <Settings2 className="w-3.5 h-3.5" />
                        Modify Grid Schema
                    </Button>
                </div>
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
            </Card>

            {/* Pagination Controls */}
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
        </div>
    );
}