
import React, { useState } from 'react';
import { X, Calendar, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface FilterSidebarProps {
    onClose: () => void;
    activeFilters: any;
    onApplyFilters: (newFilters: any) => void;
    facets?: {
        countries: string[];
        ports: string[];
        hsnCodes: string[];
        exporters: string[];
        importers: string[];
        uqc: string[];
    };
}

export default function FilterSidebar({ onClose, activeFilters, onApplyFilters, facets }: FilterSidebarProps) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [filterSearch, setFilterSearch] = useState("");

    const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
        const currentList = activeFilters[category] || [];
        let newList;
        if (checked) {
            newList = [...currentList, value];
        } else {
            newList = currentList.filter((item: string) => item !== value);
        }

        onApplyFilters({
            ...activeFilters,
            [category]: newList
        });
    };

    const getOptionsForCategory = (catId: string) => {
        if (!facets) return [];
        switch (catId) {
            case 'countries': return facets.countries;
            case 'ports': return facets.ports;
            case 'hsnCodes': return facets.hsnCodes;
            case 'exporters': return facets.exporters;
            case 'importers': return facets.importers;
            case 'uqc': return facets.uqc;
            default: return [];
        }
    };

    const categories = [
        { id: 'countries', label: 'Countries' },
        { id: 'ports', label: 'Domestic Ports' },
        { id: 'hsnCodes', label: 'HSN Codes' },
        { id: 'exporters', label: 'Exporter Names' },
        { id: 'importers', label: 'Importer Names' },
        { id: 'uqc', label: 'Unit Quantity Codes' },
    ];

    return (
        <aside className="w-[320px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar animate-in slide-in-from-left duration-300 z-40 relative h-full">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-black text-slate-800 dark:text-white font-serif uppercase tracking-tight">Refine Results</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                {/* Date Range - Essential */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Date Range</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                        <input type="text" readOnly value={activeFilters.dateRange || "Last 3 Months"} className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:border-amber-500 transition-colors" />
                    </div>
                </div>

                <div className="space-y-1 pt-2">
                    {categories.map((cat) => {
                        const options = getOptionsForCategory(cat.id);
                        const filteredOptions = options.filter(opt => opt && opt.toLowerCase().includes(filterSearch.toLowerCase()));

                        return (
                            <div key={cat.id} className="border-b border-slate-50 dark:border-slate-800/50">
                                <button
                                    onClick={() => {
                                        setOpenFilter(openFilter === cat.id ? null : cat.id);
                                        setFilterSearch("");
                                    }}
                                    className="w-full flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        {openFilter === cat.id ? <ChevronDown className="w-4 h-4 text-amber-500" /> : <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />}
                                        <span className={`text-xs font-bold uppercase tracking-wide ${openFilter === cat.id ? 'text-amber-600 dark:text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {cat.label}
                                        </span>
                                    </div>
                                    {options.length > 0 && <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{options.length}</span>}
                                </button>

                                {openFilter === cat.id && (
                                    <div className="px-2 pb-4 space-y-3 animate-in fade-in slide-in-from-top-1">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder={`Search ${cat.label}...`}
                                                value={filterSearch}
                                                onChange={(e) => setFilterSearch(e.target.value)}
                                                className="w-full h-9 pl-9 pr-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-medium outline-none focus:border-amber-500 transition-colors"
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                                            {filteredOptions.length > 0 ? filteredOptions.map((opt, i) => (
                                                <label key={i} className="flex items-center gap-2 p-2 rounded hover:bg-amber-50 dark:hover:bg-amber-900/10 cursor-pointer group transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-3.5 h-3.5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                                        checked={(activeFilters[cat.id] || []).includes(opt)}
                                                        onChange={(e) => handleCheckboxChange(cat.id, opt, e.target.checked)}
                                                    />
                                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white uppercase truncate" title={opt}>{opt}</span>
                                                </label>
                                            )) : (
                                                <div className="p-4 text-center text-slate-400 text-[10px]">No options found</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
