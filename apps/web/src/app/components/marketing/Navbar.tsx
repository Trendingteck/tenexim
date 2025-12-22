"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, ChevronRight, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@tenexim/ui';

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled
                ? 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/50 py-3 shadow-sm'
                : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">

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
                    <div className="hidden lg:flex items-center gap-8">
                        {['Market Data', 'Solutions', 'Enterprise', 'Pricing'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white hover:opacity-80 cursor-pointer">Log in</span>
                            </Link>
                            <Link href="/login">
                                <Button className="rounded-md font-semibold group">
                                    Request Demo
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <button
                            className="lg:hidden p-2 text-slate-500"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 animate-slide-up shadow-lg">
                    <div className="flex flex-col space-y-6">
                        {['Market Data', 'Solutions', 'Enterprise', 'Pricing'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full rounded-xl">Log In</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
