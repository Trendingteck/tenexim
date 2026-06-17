"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchHero from './SearchHero';
import FilterSidebar from './FilterSidebar';
import ResultsGrid from './ResultsGrid';
import ResultsToolbar from './ResultsToolbar';
import SearchAnalytics from './SearchAnalytics';
import { getShipments } from '@/actions/search';
import { ChevronUp } from 'lucide-react';

export type SearchView = 'initial' | 'results';

export default function SearchClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resultsRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const query = searchParams.get('query') || "";
    const shipmentType = searchParams.get('type') || 'import';
    const country = searchParams.get('country') || 'India';
    const dateRange = searchParams.get('date') || 'last_3_months';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [activeFilters, setActiveFilters] = useState<any>({});
    const [facets, setFacets] = useState<any>(null);

    const view: SearchView = query ? 'results' : 'initial';

    const [data, setData] = useState<any[]>([]);
    const [meta, setMeta] = useState({ total: 0, totalPages: 0, page: 1, limit: 20 });
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeColumns, setActiveColumns] = useState<string[]>([
        'country', 'date', 'exporter', 'importer', 'hs_code', 'product', 'value'
    ]);

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
            className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 overflow-y-auto custom-scrollbar font-sans relative"
        >
            <section className={`shrink-0 transition-all duration-500 bg-slate-50 border-b border-slate-200/60 ${view === 'results' ? 'py-2' : 'min-h-full py-16 flex items-center justify-center'}`}>
                <div className="w-full">
                    <SearchHero
                        defaultQuery={query}
                        initialFilters={{ shipmentType, country, dateRange }}
                        onSearch={handleSearch}
                        compact={view === 'results'}
                    />
                </div>
            </section>

            <div
                ref={resultsRef}
                id="results-section"
                className={`flex flex-col flex-1 bg-white min-h-screen ${view === 'results' ? 'flex' : 'hidden'}`}
            >
                <div className="flex flex-1 relative h-full">
                    {isSidebarOpen && (
                        <div className="sticky top-0 h-[calc(100vh-80px)] shrink-0 z-45 border-r border-slate-200/60 bg-white">
                            <FilterSidebar
                                activeFilters={activeFilters}
                                facets={facets}
                                onApplyFilters={setActiveFilters}
                                onClose={() => setIsSidebarOpen(false)}
                            />
                        </div>
                    )}

                    <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden relative">
                        <div className="flex-1 flex flex-col p-4 gap-4">
                            <SearchAnalytics />

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col flex-1 min-h-[500px]">
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
                    className="fixed bottom-6 right-6 p-3 bg-slate-900 text-white rounded-lg shadow-xl hover:scale-110 active:scale-95 transition-all z-50 group border border-slate-800"
                >
                    <ChevronUp className="w-5 h-5 group-hover:animate-bounce" />
                </button>
            )}
        </div>
    );
}