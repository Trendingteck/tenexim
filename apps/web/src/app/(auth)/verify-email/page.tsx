"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmailAction } from '@/actions/auth';
import { Globe, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Verification token sequence is missing or corrupted.');
            return;
        }

        startTransition(async () => {
            try {
                const res = await verifyEmailAction(token);
                if (res.success) {
                    setStatus('success');
                    setMessage(res.message || 'Account verified and assigned to session proxy.');
                    setTimeout(() => {
                        router.push('/dashboard/overview');
                    }, 2500);
                } else {
                    setStatus('error');
                    setMessage(res.error || 'The encryption handshake collapsed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Handshake failed.');
            }
        });
    }, [token, router]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-8 sm:p-12 lg:p-16 font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-10 pointer-events-none"></div>

            {/* Top Logo */}
            <div className="flex items-center gap-3 z-10 self-start">
                <div className="w-9 h-9 bg-slate-900 dark:bg-amber-500 rounded flex items-center justify-center shadow-md">
                    <Globe className="w-5.5 h-5.5 text-white dark:text-slate-950" />
                </div>
                <div>
                    <span className="block text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">TENEXIM</span>
                    <span className="block text-[8px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mt-0.5">Sovereign OS</span>
                </div>
            </div>

            {/* Verification State */}
            <div className="w-full max-w-sm mx-auto my-auto py-12 text-center space-y-6 z-10">
                {isPending && (
                    <div className="space-y-4">
                        <div className="w-14 h-14 mx-auto bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                            <Loader2 className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-spin" />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Verifying Account...
                        </h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                            Securing credentials against the trade database.
                        </p>
                    </div>
                )}

                {!isPending && status === 'success' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="w-14 h-14 mx-auto bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Successfully Verified
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                            {message}
                        </p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-wider animate-pulse">
                            Routing to system overview...
                        </p>
                    </div>
                )}

                {!isPending && status === 'error' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="w-14 h-14 mx-auto bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-800/30 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h1 className="text-xl font-black text-red-600 dark:text-red-400 uppercase tracking-tight">
                            Verification Failed
                        </h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                            {message}
                        </p>
                        <button
                            onClick={() => router.push('/register')}
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-600 hover:underline pt-2"
                        >
                            Request new credential set
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Footer */}
            <div className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                TENEXIM OS • DECRYPT ACCESS STABILITY GUARANTEE
            </div>
        </div>
    );
}