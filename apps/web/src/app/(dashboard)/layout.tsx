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
    User
} from 'lucide-react';

const sidebarItems = [
    { icon: BarChart3, label: 'Overview', href: '/dashboard/overview' },
    { icon: Search, label: 'Global Search', href: '/dashboard/search' },
    { icon: Package, label: 'Shipments', href: '/dashboard/shipments' },
    { icon: Building2, label: 'Companies', href: '/dashboard/companies' },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out md:static
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-slate-800">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 dark:bg-amber-500 rounded flex items-center justify-center">
                                <Globe className="text-white dark:text-slate-950 w-5 h-5" />
                            </div>
                            {sidebarOpen && (
                                <div>
                                    <span className="block text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">TENEXIM</span>
                                    <span className="block text-[9px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">Trade Intel</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                    ${active
                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${active ? 'text-amber-500' : ''}`} />
                                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="flex items-center space-x-3 w-full px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
                            <Settings className="w-5 h-5" />
                            {sidebarOpen && <span>Settings</span>}
                        </button>
                        <button className="flex items-center space-x-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium mt-1">
                            <LogOut className="w-5 h-5" />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {sidebarItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* AI Copilot Button - Prominent in Header */}
                        <Link
                            href="/dashboard/copilot"
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                                ${pathname === '/dashboard/copilot'
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/20'}
                            `}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="hidden md:inline">AI Copilot</span>
                        </Link>

                        <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                            PRO PLAN
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-500 transition-colors">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
