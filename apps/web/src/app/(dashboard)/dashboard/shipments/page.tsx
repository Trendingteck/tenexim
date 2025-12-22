"use client";

import * as React from 'react';
import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    ArrowRightLeft,
    Calendar,
    Building2,
    Package,
    ChevronDown,
    Globe,
    Clock,
    CheckCircle2,
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
        <div className="space-y-6 animate-fade-in-up pb-20 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                        Global Shipments <span className="text-amber-500">Intelligence</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Analyze, track and manage B2B shipment records globally.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-xl font-bold px-6 h-12 border-slate-200 dark:border-slate-800">
                        <Download className="w-5 h-5 mr-2" />
                        Export Data
                    </Button>
                    <Button variant="brand" size="xl" className="rounded-xl shadow-xl">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Record
                    </Button>
                </div>
            </div>

            {/* Global Search Intelligence Section */}
            <Card className="border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/10 blur-[100px] pointer-events-none" />
                <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-amber-400" />
                            Advanced Search Filter
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <ListFilter className="w-4 h-4 mr-2" />
                            {showFilters ? 'Hide Advanced' : 'Show Advanced'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-[2] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <Input
                                placeholder="Search by Product Name, HS Code, or Bill of Lading..."
                                className="h-14 pl-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl focus:ring-amber-500 transition-all text-lg"
                            />
                        </div>
                        <Button variant="brand" size="xl" className="h-14 px-10 text-lg">
                            Analyze Market
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operation Type</label>
                                <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                                    <button
                                        onClick={() => setFilterType('import')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'import' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        Import
                                    </button>
                                    <button
                                        onClick={() => setFilterType('export')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'export' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        Export
                                    </button>
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'all' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        Both
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Origin / Destination</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <select className="w-full h-11 pl-10 pr-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl text-xs font-bold appearance-none focus:ring-amber-500 outline-none">
                                        <option>India (Import from India)</option>
                                        <option>China</option>
                                        <option>United States</option>
                                        <option>Germany</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date Range (From)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <Input type="date" className="h-11 pl-10 bg-slate-800/50 border-slate-700 text-white rounded-xl text-xs font-bold" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date Range (To)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <Input type="date" className="h-11 pl-10 bg-slate-800/50 border-slate-700 text-white rounded-xl text-xs font-bold" />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Shipments Data Table */}
            <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="py-1 px-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            128,492 Records Found
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Updated 2 mins ago
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold dark:border-slate-800">
                            <Settings2 className="w-4 h-4" />
                            Customize Columns
                        </Button>
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead className="w-[150px] font-black text-[10px] uppercase tracking-wider pl-6">Shipment ID</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-wider">Product Description</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-wider">Shipper / Consignee</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-wider">Route</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-wider">Total Value</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-right pr-6 font-black text-[10px] uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <TableRow key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <TableCell className="font-bold text-slate-900 dark:text-white pl-6">
                                    #TNX-{828394 + i}
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <div className="font-bold text-slate-900 dark:text-white truncate">5G Core Infrastructure Equipment</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">HS CODE: 851762</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            Tata Communications Ltd
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <ArrowRightLeft className="w-3 h-3" />
                                            Verizon Network Systems
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-900 dark:text-white">INMAA</span>
                                            <span className="text-[8px] text-slate-400 uppercase">Chennai</span>
                                        </div>
                                        <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-900 dark:text-white">USLAX</span>
                                            <span className="text-[8px] text-slate-400 uppercase">Los Angeles</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-black text-slate-900 dark:text-white text-base">$452,000.00</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">USD</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={i % 3 === 0 ? "success" : "warning"} className="rounded-full px-4 border-none shadow-sm">
                                        {i % 3 === 0 ? "Confirmed" : "In Transit"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                                            <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Custom Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-slate-500 font-medium">
                    Showing <span className="text-slate-900 dark:text-white font-bold">1 to 20</span> of 128,492 entries
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Button variant="ghost" className="h-10 px-4 rounded-xl font-bold" disabled>Previous</Button>
                    <div className="flex space-x-1">
                        <Button variant="brand" className="h-10 w-10 rounded-xl font-bold text-sm">1</Button>
                        <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">2</Button>
                        <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">3</Button>
                        <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">4</Button>
                    </div>
                    <Button variant="ghost" className="h-10 px-4 rounded-xl font-bold">Next</Button>
                </div>
            </div>
        </div>
    );
}
