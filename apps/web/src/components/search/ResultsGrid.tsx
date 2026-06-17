
import React from 'react';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultsGridProps {
    activeColumns: string[];
    query: string;
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    isLoading: boolean;
}

export default function ResultsGrid({ activeColumns, data, pagination, onPageChange, isLoading }: ResultsGridProps) {
    const handleCompanyClick = (name: string) => {
        const url = `https://www.google.com/search?q=${encodeURIComponent(name)}`;
        window.open(url, '_blank');
    };

    const getPageNumbers = () => {
        const pages = [];
        const { page, totalPages } = pagination;
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-12 bg-inherit">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                            </th>
                            {activeColumns.includes('country') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">COUNTRY</th>}
                            {activeColumns.includes('date') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">DATE</th>}
                            {activeColumns.includes('exporter') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">EXPORTER</th>}
                            {activeColumns.includes('importer') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">IMPORTER</th>}
                            {activeColumns.includes('hs_code') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">HS CODE</th>}
                            {activeColumns.includes('product') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap text-center">PRODUCT</th>}
                            {activeColumns.includes('value') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">VALUE (USD)</th>}
                            {activeColumns.includes('unit_value') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">UNIT VALUE</th>}
                            {activeColumns.includes('total_value_inr') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">VALUE (INR)</th>}
                            {activeColumns.includes('qty') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap text-right">QTY</th>}
                            {activeColumns.includes('unit') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">UNIT</th>}
                            {activeColumns.includes('port') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">INDIAN PORT</th>}
                            {activeColumns.includes('foreign_port') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">FOREIGN PORT</th>}
                            {activeColumns.includes('duty') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap text-right">DUTY</th>}
                            {activeColumns.includes('currency') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">CURRENCY</th>}
                            {activeColumns.includes('be_type') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap uppercase">Type</th>}
                            {activeColumns.includes('boe_number') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">BOE NO.</th>}
                            {activeColumns.includes('importer_city') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap">CITY</th>}
                            {activeColumns.includes('importer_address') && <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-inherit whitespace-nowrap text-center">ADDRESS</th>}
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-slate-100 dark:divide-slate-800 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'} transition-opacity`}>
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-all group">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                                </td>
                                {activeColumns.includes('country') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">{row.originCountry}</td>
                                )}
                                {activeColumns.includes('date') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                                        {new Date(row.boeDate).toLocaleDateString()}
                                    </td>
                                )}
                                {activeColumns.includes('exporter') && (
                                    <td className="px-6 py-4 max-w-[200px]">
                                        <div className="flex items-center justify-between gap-4 group/cell">
                                            <span
                                                onClick={() => handleCompanyClick(row.supplierName)}
                                                className="text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer uppercase truncate"
                                                title={row.supplierName}
                                            >
                                                {row.supplierName}
                                            </span>
                                        </div>
                                    </td>
                                )}
                                {activeColumns.includes('importer') && (
                                    <td className="px-6 py-4 max-w-[200px]">
                                        <div className="flex items-center justify-between gap-4 group/cell">
                                            <span
                                                onClick={() => handleCompanyClick(row.importerName)}
                                                className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer uppercase truncate"
                                                title={row.importerName}
                                            >
                                                {row.importerName}
                                            </span>
                                        </div>
                                    </td>
                                )}
                                {activeColumns.includes('hs_code') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 whitespace-nowrap">{row.hsCode}</td>
                                )}
                                {activeColumns.includes('product') && (
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase line-clamp-2 max-w-[300px]" title={row.productDesc}>
                                        {row.productDesc}
                                    </td>
                                )}
                                {activeColumns.includes('value') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-emerald-600 whitespace-nowrap">
                                        ${(row.totalValueUsd || 0).toLocaleString()}
                                    </td>
                                )}
                                {activeColumns.includes('unit_value') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        ${(row.unitValueUsd || 0).toLocaleString()}
                                    </td>
                                )}
                                {activeColumns.includes('total_value_inr') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        ₹{(row.totalValueInr || 0).toLocaleString()}
                                    </td>
                                )}
                                {activeColumns.includes('qty') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                                        {row.quantity?.toLocaleString()}
                                    </td>
                                )}
                                {activeColumns.includes('unit') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 whitespace-nowrap">{row.unit}</td>
                                )}
                                {activeColumns.includes('port') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">{row.indianPort}</td>
                                )}
                                {activeColumns.includes('foreign_port') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">{row.foreignPort}</td>
                                )}
                                {activeColumns.includes('duty') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">
                                        {row.duty ? `$${row.duty.toLocaleString()}` : '-'}
                                    </td>
                                )}
                                {activeColumns.includes('currency') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 whitespace-nowrap">{row.currency}</td>
                                )}
                                {activeColumns.includes('be_type') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase whitespace-nowrap">{row.beType}</td>
                                )}
                                {activeColumns.includes('boe_number') && (
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 whitespace-nowrap">{row.boeNumber}</td>
                                )}
                                {activeColumns.includes('importer_city') && (
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">{row.importerCity}</td>
                                )}
                                {activeColumns.includes('importer_address') && (
                                    <td className="px-6 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-400 max-w-[250px] truncate" title={row.importerAddress}>
                                        {row.importerAddress}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={activeColumns.length + 1} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                                            <Maximize2 className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No Manifests Found</h3>
                                        <p className="text-xs text-slate-400">Try adjusting your filters or search query</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all duration-300">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crunching Global Manifests...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination Control */}
            <div className="h-16 px-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    Showing Page <span className="text-slate-900 dark:text-white underline decoration-amber-500">{pagination.page}</span> of {pagination.totalPages} ({pagination.total.toLocaleString()} Records)
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1 || isLoading}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 inline" /> Previous
                    </button>
                    <div className="flex gap-1 mx-2">
                        {getPageNumbers().map((p, i) => (
                            <button
                                key={i}
                                onClick={() => typeof p === 'number' && onPageChange(p)}
                                disabled={typeof p !== 'number' || isLoading}
                                className={`h-8 w-8 rounded-md text-[10px] font-black transition-all ${p === pagination.page ? 'bg-amber-500 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'} ${typeof p !== 'number' ? 'cursor-default' : ''}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page === pagination.totalPages || isLoading}
                        className="px-4 py-2 bg-amber-500 text-white border border-amber-600 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1 inline" />
                    </button>
                </div>
            </div>
        </div>
    );
}
