"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Globe,
    ChevronRight,
    Database,
    Zap,
    ShieldCheck,
    Building2,
    BarChart3,
    Menu,
    X,
    Play,
    ArrowRight,
    Moon,
    Sun,
    Search,
    ChevronDown
} from 'lucide-react';
import { Button } from '@tenexim/ui';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Check initial dark mode
        if (localStorage.getItem('color-theme') === 'dark' ||
            (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-amber-500 selection:text-white transition-colors duration-300">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-grid-light dark:bg-grid-dark opacity-100 dark:opacity-20 pointer-events-none"></div>

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/50'
                    : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-slate-900 dark:bg-amber-500 rounded flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-6">
                                <Globe className="w-6 h-6 text-white dark:text-slate-950" />
                            </div>
                            <div>
                                <span className="block text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">TENEXIM</span>
                                <span className="block text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mt-0.5">Trade Intelligence</span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition">Market Data</a>
                            <a href="#" className="text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition">Solutions</a>
                            <a href="#" className="text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition">Enterprise</a>
                            <a href="#" className="text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition">Pricing</a>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="hidden md:flex items-center gap-3">
                                <Link href="/login" className="text-sm font-semibold text-slate-900 dark:text-white hover:opacity-80">Log in</Link>
                                <Link href="/signup">
                                    <Button className="rounded-md font-semibold shadow-lg">
                                        Request Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-16 lg:pt-48 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Hero Header */}
                    <div className="text-center max-w-4xl mx-auto mb-16 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="text-xs font-bold tracking-wide uppercase text-slate-600 dark:text-slate-300">New: 2025 Q1 Global Trade Report</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                            Decisions driven by <br />
                            <span className="text-gold-gradient font-serif italic pr-2">verified reality.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            TENEXIM is the operating system for global trade. We aggregate billions of shipment records to reveal the hidden supply chains of market leaders.
                        </p>
                    </div>

                    {/* Search Interface */}
                    <div className="max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-2 rounded-xl shadow-2xl dark:shadow-amber-500/5 border border-slate-200/80 dark:border-slate-700/50">
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-1 flex flex-col md:flex-row items-center border border-slate-200 dark:border-slate-800">

                                {/* Dropdown */}
                                <div className="relative w-full md:w-48 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                                    <select className="w-full bg-transparent p-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer">
                                        <option>HS Code</option>
                                        <option>Product Name</option>
                                        <option>Company Name</option>
                                        <option>Consignment ID</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Input */}
                                <div className="flex-1 w-full relative">
                                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. 'Lithium Ion Batteries' or 'HS 8507.60'"
                                        className="w-full bg-transparent p-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
                                    />
                                </div>

                                {/* Button */}
                                <Button className="w-full md:w-auto m-1 rounded-md font-bold">
                                    <span>Search</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Trusted By */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted Data Partner For:</p>
                            <div className="flex gap-8 items-center">
                                <span className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">MAERSK</span>
                                <span className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">DHL Global</span>
                                <span className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">KUEHNE+NAGEL</span>
                                <span className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">JP MORGAN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Market Intelligence, Demystified.</h2>
                            <p className="text-slate-500 dark:text-slate-400">Don't settle for raw Excel dumps. Our platform structures chaos into actionable corporate strategy.</p>
                        </div>
                        <a href="#" className="hidden md:inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold hover:underline mt-4 md:mt-0">
                            View full capabilities <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">

                        {/* Large Card: Global Map */}
                        <div className="md:col-span-2 md:row-span-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden group">
                            <div className="absolute top-6 left-6 z-10">
                                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Top Export Corridor</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">CN (Shanghai)</span>
                                        <ArrowRight className="w-3 h-3 text-slate-400" />
                                        <span className="font-bold text-slate-900 dark:text-white">US (Long Beach)</span>
                                    </div>
                                    <div className="mt-2 text-xs font-mono text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded inline-block">
                                        ▲ 14.2% Vol Increase
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                            <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
                            <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-amber-500 rounded-full"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Live feed visualization</p>
                            </div>
                        </div>

                        {/* Small Card: Buyer Discovery */}
                        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buyer Discovery</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Identify companies with high liquidity and recurring import patterns.</p>
                        </div>

                        {/* Small Card: Risk Analysis */}
                        <div className="rounded-2xl bg-slate-900 dark:bg-black border border-slate-800 p-6 text-white flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 mb-4">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 border border-slate-700 px-2 py-1 rounded">AI-GUARD</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">Risk Analysis</h3>
                                <p className="text-sm text-slate-400 mt-2">Filter out shell companies and bad actors automatically.</p>
                            </div>
                            <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                                <div className="bg-amber-500 w-3/4 h-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">

                        <div className="max-w-xs">
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TENEXIM</span>
                            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                The definitive source for global import-export intelligence. Empowering supply chains with precision data since 2018.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                    <li><a href="#" className="hover:text-amber-600 transition">Data Search</a></li>
                                    <li><a href="#" className="hover:text-amber-600 transition">API Documentation</a></li>
                                    <li><a href="#" className="hover:text-amber-600 transition">Pricing Models</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                    <li><a href="#" className="hover:text-amber-600 transition">About Us</a></li>
                                    <li><a href="#" className="hover:text-amber-600 transition">Methodology</a></li>
                                    <li><a href="#" className="hover:text-amber-600 transition">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-400">© 2025 TENEXIM Inc. All rights reserved.</p>
                        <div className="flex gap-4 text-slate-400">
                            <a href="#" className="hover:text-slate-600 dark:hover:text-white">LinkedIn</a>
                            <a href="#" className="hover:text-slate-600 dark:hover:text-white">Twitter</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
