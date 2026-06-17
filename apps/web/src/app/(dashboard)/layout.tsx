"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Search,
    Package,
    Building2,
    FileText,
    Sparkles,
    Settings,
    LogOut,
    Menu,
    X,
    Globe,
    Bell,
    User,
    ChevronLeft,
    ShieldAlert,
    Fingerprint
} from 'lucide-react';

const systemControlItems = [
    { icon: BarChart3, label: 'Operational Deck', href: '/dashboard/overview' },
    { icon: Search, label: 'Bilateral Customs Engine', href: '/dashboard/search' },
    { icon: Package, label: 'Global Shipments', href: '/dashboard/shipments' },
];

const auditProtocolItems = [
    { icon: FileText, label: 'Reports & MSI', href: '/dashboard/reports' },
    { icon: Fingerprint, label: 'Risk Compliance Ledger', href: '/dashboard/companies' }, // Fallback to companies route
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-slate-950 text-slate-900 overflow-hidden font-sans select-none">
            {/* Sidebar */}
            <aside className={`
                ${sidebarOpen ? 'w-64' : 'w-20'} 
                fixed inset-y-0 left-0 z-50 bg-slate-950 border-r border-slate-900 transition-all duration-300 ease-in-out md:static flex flex-col shrink-0 h-full
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo & OS Stamp */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-slate-900">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(217,119,6,0.15)]">
                                <Globe className="text-slate-950 w-4 h-4" />
                            </div>
                            {sidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="text-white font-extrabold text-xs tracking-wider leading-none">TENEXIM</span>
                                    <span className="text-[8px] text-amber-500 font-black uppercase tracking-[0.2em] mt-0.5">Sovereign OS</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation Stream */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-6">
                        {/* Group: SYSTEM CONTROLS */}
                        <div className="space-y-2">
                            {sidebarOpen && (
                                <h3 className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    System Controls
                                </h3>
                            )}
                            <nav className="space-y-0.5">
                                {systemControlItems.map((item) => {
                                    const active = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                flex items-center space-x-3 px-3 py-2 rounded-r text-[11px] font-bold transition-all
                                                ${active
                                                    ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-400 border-left-[3px] border-amber-500 border-l-4'
                                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border-l-4 border-transparent'}
                                            `}
                                        >
                                            <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
                                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Group: AUDIT PROTOCOLS */}
                        <div className="space-y-2">
                            {sidebarOpen && (
                                <h3 className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    Audit Protocols
                                </h3>
                            )}
                            <nav className="space-y-0.5">
                                {auditProtocolItems.map((item) => {
                                    const active = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                flex items-center space-x-3 px-3 py-2 rounded-r text-[11px] font-bold transition-all
                                                ${active
                                                    ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-400 border-l-4 border-amber-500'
                                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border-l-4 border-transparent'}
                                            `}
                                        >
                                            <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
                                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Operator Block base */}
                    <div className="p-3 shrink-0 border-t border-slate-900">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2.5 p-1.5 rounded bg-slate-900/40 border border-slate-900 overflow-hidden">
                                <div className="w-7 h-7 rounded bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-[10px] shrink-0">
                                    OP
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-black text-white truncate">OPERATOR #1024</span>
                                    <span className="text-[8px] text-amber-500 font-black tracking-widest uppercase mt-0.5">Clearance level v9</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-7 h-7 mx-auto rounded bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                                OP
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Application Base */}
            <div className="flex-1 h-full py-2.5 pr-2.5 bg-slate-950 transition-all duration-300">
                <div className="w-full h-full bg-slate-50 rounded-[18px] shadow-2xl flex flex-col overflow-hidden relative border border-slate-200/40">
                    
                    {/* Header and Control Strips */}
                    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40 sticky top-0">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                            >
                                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </button>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Intelligence</span>
                                    <span className="text-amber-500">•</span>
                                    <span className="text-slate-500">Live Stream active</span>
                                </div>
                                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none mt-0.5">
                                    {pathname === '/dashboard/overview' && 'Operational Deck'}
                                    {pathname === '/dashboard/search' && 'Bilateral Customs Engine'}
                                    {pathname === '/dashboard/shipments' && 'Global Shipments Grid'}
                                    {pathname === '/dashboard/reports' && 'Macro Reports & MSI'}
                                    {pathname === '/dashboard/companies' && 'Risk Compliance Ledger'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href="/dashboard/copilot"
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider transition-all duration-200
                                    ${pathname === '/dashboard/copilot'
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'}
                                `}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>COPILOT LABS</span>
                            </Link>

                            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 text-[8px] font-black uppercase tracking-wider">
                                <span className="relative flex h-1 w-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
                                </span>
                                CORE STABLE
                            </div>

                            <button className="p-2 text-slate-400 hover:text-slate-900 rounded-full relative">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            </button>
                        </div>
                    </header>

                    {/* Page Content Canvas Container */}
                    <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#f8fafc]">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}