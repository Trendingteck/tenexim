
import React, { useState } from 'react';
import { Filter, RefreshCw, Columns, Download, Maximize2, ChevronLeft, ChevronRight, Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ResultsToolbarProps {
    onToggleFilters: () => void;
    isFiltersOpen: boolean;
    activeColumns: string[];
    onToggleColumn: (col: string) => void;
    totalRecords: number;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
}

const AVAILABLE_COLUMNS = [
    { id: 'country', label: 'Country' }, // originCountry
    { id: 'date', label: 'Date' }, // boeDate
    { id: 'exporter', label: 'Exporter' }, // supplierName
    { id: 'importer', label: 'Importer' }, // importerName
    { id: 'hs_code', label: 'HS Code' }, // hsCode
    { id: 'product', label: 'Product' }, // productDesc
    { id: 'value', label: 'Total Value (USD)' }, // totalValueUsd
    { id: 'unit_value', label: 'Unit Value (USD)' }, // unitValueUsd
    { id: 'total_value_inr', label: 'Total Value (INR)' },
    { id: 'qty', label: 'Quantity' },
    { id: 'unit', label: 'Unit' },
    { id: 'duty', label: 'Duty' },
    { id: 'currency', label: 'Currency' },
    { id: 'port', label: 'Indian Port' },
    { id: 'foreign_port', label: 'Foreign Port' },
    { id: 'be_type', label: 'BE Type' },
    { id: 'boe_number', label: 'BOE Number' },
    { id: 'importer_city', label: 'Importer City' },
    { id: 'importer_address', label: 'Importer Address' },
];

export default function ResultsToolbar({ onToggleFilters, isFiltersOpen, activeColumns, onToggleColumn, totalRecords, pageSize, onPageSizeChange }: ResultsToolbarProps) {
    const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
    const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

    return (
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 z-30">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={onToggleFilters}
                    className={`gap-2 ${isFiltersOpen ? 'bg-amber-50 border-amber-500 text-amber-700' : ''}`}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {isFiltersOpen && <Badge className="ml-1 bg-amber-500 hover:bg-amber-600">ON</Badge>}
                </Button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

                <div className="relative">
                    <Button
                        variant="ghost"
                        onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                        className="gap-2 text-slate-500"
                    >
                        <Columns className="w-4 h-4" />
                        <span>Columns</span>
                    </Button>

                    {isColumnDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsColumnDropdownOpen(false)}></div>
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 max-h-[400px] overflow-y-auto custom-scrollbar">
                                <div className="text-[10px] uppercase font-black text-slate-400 px-2 py-1 mb-1">Visible Columns</div>
                                {AVAILABLE_COLUMNS.map(col => (
                                    <button
                                        key={col.id}
                                        onClick={() => onToggleColumn(col.id)}
                                        className="w-full flex items-center justify-between px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300"
                                    >
                                        <span>{col.label}</span>
                                        {activeColumns.includes(col.id) && <Check className="w-3.5 h-3.5 text-amber-500" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Page Size Selector */}
                <div className="relative">
                    <Button variant="outline" className="gap-2 h-9 text-xs" onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}>
                        <span className="text-slate-500">Show:</span>
                        <span className="font-bold">{pageSize}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </Button>

                    {isPageSizeOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsPageSizeOpen(false)}></div>
                            <div className="absolute top-full right-0 mt-2 w-24 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50">
                                {[20, 50, 100].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => { onPageSizeChange(size); setIsPageSizeOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded hover:bg-slate-50 dark:hover:bg-slate-800 ${pageSize === size ? 'text-amber-600' : 'text-slate-600'}`}
                                    >
                                        {size} Rows
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <span className="text-xs font-medium text-slate-400 mx-2">
                    {totalRecords.toLocaleString()} Results
                </span>

                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900">
                    <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-emerald-600">
                    <Download className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
