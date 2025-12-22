
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchHero from '@/app/components/search/SearchHero';
import FilterSidebar from '@/app/components/search/FilterSidebar';
import ResultsGrid from '@/app/components/search/ResultsGrid';
import ResultsToolbar from '@/app/components/search/ResultsToolbar';
import SearchAnalytics from '@/app/components/search/SearchAnalytics';
import { getShipments } from '@/app/actions/search';
import { ChevronUp } from 'lucide-react';

export type SearchView = 'initial' | 'results';

export default function SearchClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resultsRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // -- State from URL Params --
    const query = searchParams.get('query') || "";
    const shipmentType = searchParams.get('type') || 'import';
    const country = searchParams.get('country') || 'India';
    const dateRange = searchParams.get('date') || 'last_3_months';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Complex Filters state
    const [activeFilters, setActiveFilters] = useState<any>({});
    const [facets, setFacets] = useState<any>(null);

    const view: SearchView = query ? 'results' : 'initial';

    // -- App State --
    const [data, setData] = useState<any[]>([]);
    const [meta, setMeta] = useState({ total: 0, totalPages: 0, page: 1, limit: 20 });
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeColumns, setActiveColumns] = useState<string[]>([
        'country', 'date', 'exporter', 'importer', 'hs_code', 'product', 'value'
    ]);

    // -- Fetch Data Effect --
    useEffect(() => {
        if (!query) {
            setData([]);
            setFacets(null);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const filters = {
                shipmentType: shipmentType as 'import' | 'export',
                country,
                ...activeFilters
            };

            const result = await getShipments({
                query,
                filters,
                page,
                limit
            });

            if (result.success && result.data) {
                setData(result.data);
                if (result.meta) setMeta(result.meta);
                if (result.facets) setFacets(result.facets);
            }
            setIsLoading(false);
        };

        const timer = setTimeout(() => {
            fetchData();
        }, 100);
        return () => clearTimeout(timer);

    }, [query, shipmentType, country, dateRange, page, limit, activeFilters]);

    // -- Handlers --
    const handleSearch = (newQuery: string, filters: any) => {
        const params = new URLSearchParams(searchParams);
        if (newQuery) params.set('query', newQuery);
        if (filters.shipmentType) params.set('type', filters.shipmentType);
        if (filters.country) params.set('country', filters.country);
        if (filters.dateRange) params.set('date', filters.dateRange);

        params.set('page', '1');
        router.push(`?${params.toString()}`, { scroll: false });

        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePageSizeChange = (newSize: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('limit', newSize.toString());
        params.set('page', '1');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const toggleColumn = (colId: string) => {
        setActiveColumns(prev =>
            prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
        );
    };

    return (
        <div
            ref={scrollContainerRef}
            className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar font-sans relative"
        >

            {/* 1. Persistent Search Hero at the Top */}
            <section className={`shrink-0 transition-all duration-700 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 ${view === 'results' ? 'py-4' : 'min-h-full py-20 flex items-center justify-center'}`}>
                <div className="w-full">
                    <SearchHero
                        defaultQuery={query}
                        initialFilters={{ shipmentType, country, dateRange }}
                        onSearch={handleSearch}
                        compact={view === 'results'}
                    />
                </div>
            </section>

            {/* 2. Results Section */}
            <div
                ref={resultsRef}
                id="results-section"
                className={`flex flex-col flex-1 bg-white dark:bg-slate-950 min-h-screen ${view === 'results' ? 'flex' : 'hidden'}`}
            >
                <div className="flex flex-1 relative">
                    {isSidebarOpen && (
                        <div className="sticky top-0 h-[calc(100vh-80px)] shrink-0 z-40">
                            <FilterSidebar
                                activeFilters={activeFilters}
                                facets={facets}
                                onApplyFilters={setActiveFilters}
                                onClose={() => setIsSidebarOpen(false)}
                            />
                        </div>
                    )}

                    <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
                        <div className="flex-1 flex flex-col p-6 gap-6">
                            <SearchAnalytics />

                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col flex-1 min-h-[700px]">
                                <ResultsToolbar
                                    onToggleFilters={() => setIsSidebarOpen(!isSidebarOpen)}
                                    isFiltersOpen={isSidebarOpen}
                                    activeColumns={activeColumns}
                                    onToggleColumn={toggleColumn}
                                    totalRecords={meta.total}
                                    pageSize={limit}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                                <ResultsGrid
                                    activeColumns={activeColumns}
                                    query={query}
                                    data={data}
                                    pagination={{ ...meta }}
                                    onPageChange={handlePageChange}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {view === 'results' && (
                <button
                    onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 p-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group border border-amber-400/20"
                >
                    <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
    );
}
