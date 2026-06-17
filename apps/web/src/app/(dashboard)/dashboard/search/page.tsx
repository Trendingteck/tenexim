"use client";
import React, { Suspense } from 'react';
import SearchClient from '@/components/search/SearchClient';

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Loading Search Engine...</span>
                </div>
            </div>
        }>
            <SearchClient />
        </Suspense>
    );
}