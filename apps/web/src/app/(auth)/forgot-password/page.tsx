"use client";

import React, { useActionState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Loader2, Globe } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/auth';

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-8 sm:p-12 lg:p-16 font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-10 pointer-events-none"></div>

            {/* Top Logo */}
            <Link href="/" className="flex items-center gap-3 z-10 self-start">
                <div className="w-9 h-9 bg-slate-900 dark:bg-amber-500 rounded flex items-center justify-center shadow-md">
                    <Globe className="w-5.5 h-5.5 text-white dark:text-slate-950" />
                </div>
                <div>
                    <span className="block text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">TENEXIM</span>
                    <span className="block text-[8px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mt-0.5">Sovereign OS</span>
                </div>
            </Link>

            {/* Focused Card Form */}
            <div className="w-full max-w-sm mx-auto my-auto py-12 z-10">
                <div className="space-y-2 mb-8 text-center sm:text-left">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Reset your password
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Request a secure authentication link to update your corporate node credentials.
                    </p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Work Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="you@company.com"
                            className="w-full h-10 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-sm"
                        />
                    </div>

                    {/* Messages */}
                    {state && !state.success && (
                        <div className="p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 leading-normal">{state.error}</span>
                        </div>
                    )}

                    {state && state.success && (
                        <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-normal">{state.message}</span>
                                {state.debugLink && (
                                    <a href={state.debugLink} className="text-[10px] text-amber-600 font-mono mt-2 block hover:underline break-all">
                                        DEBUG NODE UPLINK: {state.debugLink}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-10 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                Send Recovery Link
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 uppercase tracking-wider transition-colors">
                        Back to sign in
                    </Link>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                TENEXIM OS • PRIVATE DEPLOYMENT STANDARDS APPLY
            </div>
        </div>
    );
}