
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, ChevronDown, Sparkles, Calendar, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { getAutocompleteSuggestions } from '@/app/actions/search';

interface SearchHeroProps {
    defaultQuery: string;
    onSearch: (query: string, filters: any) => void;
    initialFilters?: any;
    compact?: boolean;
}

export default function SearchHero({ defaultQuery, onSearch, initialFilters, compact }: SearchHeroProps) {
    const [query, setQuery] = useState(defaultQuery);
    const [shipmentType, setShipmentType] = useState(initialFilters?.shipmentType || 'import');
    const [country, setCountry] = useState(initialFilters?.country || 'India');
    const [dateRange, setDateRange] = useState(initialFilters?.dateRange || 'last_3_months');
    const [isSmartLogicActive, setIsSmartLogicActive] = useState(country !== 'India');

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<{ label: string, type: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLFormElement>(null);

    // Manual Debounce for Autocomplete
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                const newSuggestions = await getAutocompleteSuggestions(query);
                setSuggestions(newSuggestions);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [query]);

    // Click Outside Handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCountry(val);
        setIsSmartLogicActive(val !== 'India');
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        onSearch(query, { shipmentType, country, dateRange });
        setShowSuggestions(false);
    };

    const selectSuggestion = (val: string) => {
        setQuery(val);
        onSearch(val, { shipmentType, country, dateRange });
        setShowSuggestions(false);
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-all duration-700 ${compact ? 'min-h-[300px]' : 'min-h-[600px]'}`}>
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-10"></div>
            </div>

            <div className={`w-full max-w-4xl relative animate-in fade-in slide-in-from-bottom-4 duration-700 z-10 ${compact ? 'scale-90 origin-center' : ''}`}>
                <div className={`text-center ${compact ? 'mb-6' : 'mb-10'}`}>
                    {!compact && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/10 rounded-full mb-6 border border-amber-100 dark:border-amber-800/30">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest">Global Trade Intelligence</span>
                        </div>
                    )}
                    <h1 className={`${compact ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-black text-slate-900 dark:text-white mb-4 font-serif tracking-tight leading-tight`}>
                        {compact ? 'Refine your ' : 'Decisions driven by '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 italic">
                            {compact ? 'analysis' : 'verified reality.'}
                        </span>
                    </h1>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 relative z-20">
                    <div className="flex flex-col md:flex-row gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 p-2">
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0">
                            <button
                                onClick={() => setShipmentType('import')}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${shipmentType === 'import' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                Import
                            </button>
                            <button
                                onClick={() => setShipmentType('export')}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${shipmentType === 'export' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                Export
                            </button>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block self-center"></div>

                        <div className="relative flex-1 group">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-warning" />
                            <select
                                value={country}
                                onChange={handleCountryChange}
                                className="w-full h-full pl-10 pr-8 py-2 bg-transparent text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent focus:border-amber-500"
                            >
                                <option value="India">India (Direct)</option>
                                <option value="USA">USA (Mirrored)</option>
                                <option value="China">China (Mirrored)</option>
                                <option value="Vietnam">Vietnam (Mirrored)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block self-center"></div>

                        <div className="relative flex-1 group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full h-full pl-10 pr-8 py-2 bg-transparent text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent focus:border-amber-500"
                            >
                                <option value="last_month">Last Month</option>
                                <option value="last_3_months">Last 3 Months</option>
                                <option value="last_year">Last Year</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="relative flex items-center p-2" ref={suggestionRef}>
                        <Search className="absolute left-6 w-6 h-6 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                            placeholder="Exporter, Importer, HS Code or Product..."
                            className={`flex-1 bg-transparent pl-14 pr-4 outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 ${compact ? 'py-2 text-lg' : 'py-4 text-xl'}`}
                        />
                        <Button className={`${compact ? 'h-12 px-6' : 'h-14 px-8'} rounded-xl font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 shadow-lg`} onClick={() => handleSubmit()}>
                            Update Results
                        </Button>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 z-50">
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    Suggestions
                                </div>
                                {suggestions.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectSuggestion(item.label)}
                                        className="w-full text-left px-6 py-3 hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                                    >
                                        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-500 text-xs">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded uppercase">
                                            {item.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>
                </div>

                {isSmartLogicActive && (
                    <div className="mt-4 flex justify-center animate-in slide-in-from-top-2 fade-in">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-slate-900/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-300 rounded-full text-[9px] font-bold tracking-widest border border-slate-800/50 dark:border-slate-700/50 shadow-xl">
                            <span className="flex items-center gap-1.5 text-amber-500">
                                <ArrowRightLeft className="w-3 h-3" />
                                <span>SMART MIRROR</span>
                            </span>
                            <span className="w-px h-3 bg-slate-700"></span>
                            <span>
                                INDIA {shipmentType === 'export' ? 'IMPORT' : 'EXPORT'} records approximating {country} {shipmentType}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
