"use client";

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Eye, EyeOff, Loader2, Globe, ShieldCheck, Check, Ship, ArrowRightLeft } from 'lucide-react';
import { loginAction, getGoogleAuthUrl } from '@/actions/auth';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const [showPassword, setShowPassword] = useState(false);
    const [isGooglePending, setIsGooglePending] = useState(false);

    const handleGoogleLogin = async () => {
        setIsGooglePending(true);
        try {
            const redirectUrl = await getGoogleAuthUrl();
            window.location.href = redirectUrl;
        } catch (error) {
            console.error("Google Auth handshaking error:", error);
            setIsGooglePending(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex font-sans overflow-hidden">
            {/* LEFT COLUMN: MINIMALIST INTERACTIVE FORM */}
            <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative z-10 bg-white dark:bg-slate-950">
                
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-slate-900 dark:bg-amber-500 rounded flex items-center justify-center shadow-md transition-transform duration-300 group-hover:rotate-6">
                        <Globe className="w-5.5 h-5.5 text-white dark:text-slate-950" />
                    </div>
                    <div>
                        <span className="block text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">TENEXIM</span>
                        <span className="block text-[9px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mt-0.5">Trade Intelligence</span>
                    </div>
                </Link>

                {/* Main Auth Form */}
                <div className="w-full max-w-sm mx-auto my-auto py-10">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Sign in to Tenexim
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Access your comprehensive trade compliance dashboard.
                        </p>
                    </div>

                    {/* Google Auth Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGooglePending}
                        className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99] disabled:opacity-50"
                    >
                        {isGooglePending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        ) : (
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.247-3.123C18.435 1.144 15.54 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.814 11.57-11.79 0-.795-.085-1.4-.19-1.925H12.24z" />
                            </svg>
                        )}
                        Sign in with Google
                    </button>

                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">or sign in with email</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>

                    {/* Server Action Form */}
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Work Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="you@company.com"
                                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Password</label>
                                <Link href="/forgot-password" className="text-[10px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="Enter your password"
                                    className="w-full h-10 pl-3.5 pr-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-655 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Notification */}
                        {state && !state.success && (
                            <div className="p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl flex items-start gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-xs font-bold text-red-600 dark:text-red-400 leading-normal">{state.error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-10 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] mt-2"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Navigation */}
                <div className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                    New operator?{" "}
                    <Link href="/register" className="text-slate-900 dark:text-white hover:underline font-bold">
                        Create an Account
                    </Link>
                </div>
            </div>

            {/* RIGHT COLUMN: HIGH-POLISHED PRODUCT MINI-LEDGER VISUAL */}
            <div className="hidden lg:flex lg:w-[55%] bg-slate-50 dark:bg-slate-950 relative flex-col justify-center p-16 overflow-hidden border-l border-slate-100 dark:border-slate-850">
                <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-20 pointer-events-none"></div>

                <div className="relative max-w-xl mx-auto space-y-10 z-10">
                    {/* Floating Fine Trade Mockup */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVE INGESTION MATRIX</span>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">Global Ledger Streaming</h3>
                            </div>
                            <div className="h-6 px-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Sync
                            </div>
                        </div>

                        {/* Trade Ledger Items */}
                        <div className="space-y-3 font-mono text-[11px]">
                            <LedgerItem 
                                exporter="Sichuan Lithium Energy [CHN]" 
                                importer="Tata Energy Corporation [IND]" 
                                value="$142,500" 
                                route="Shanghai ➔ Nhava Sheva" 
                            />
                            <LedgerItem 
                                exporter="Siemens Wafers GMBH [DEU]" 
                                importer="Semicon India Ltd [IND]" 
                                value="$842,900" 
                                route="Hamburg ➔ Chennai Port" 
                            />
                            <LedgerItem 
                                exporter="Da Nang Metals Inc [VNM]" 
                                importer="Vistara Tech OS [IND]" 
                                value="$221,000" 
                                route="Da Nang ➔ Mumbai Port" 
                            />
                        </div>
                    </div>

                    {/* Benefit Points */}
                    <div className="space-y-4 text-center lg:text-left">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            The Unified Trade Engine
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <FeaturePoint title="Bilateral Routing" desc="Cross-analyze trade flows across mirror destinations automatically." />
                            <FeaturePoint title="Entity Verification" desc="Verify verified trade stakeholders with integrated C-level direct contacts." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LedgerItem({ exporter, importer, value, route }: { exporter: string; importer: string; value: string; route: string }) {
    return (
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Ship className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{exporter}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <ArrowRightLeft className="w-3 h-3 shrink-0" />
                    <span>{importer}</span>
                </div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{route}</span>
            </div>
            <div className="text-right">
                <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">{value}</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-bold border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 mt-1">
                    <Check className="w-2.5 h-2.5 mr-0.5" /> COMPLIANT
                </span>
            </div>
        </div>
    );
}

function FeaturePoint({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}