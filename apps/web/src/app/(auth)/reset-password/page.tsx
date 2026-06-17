"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordAction } from '@/actions/auth';
import { Globe, ArrowLeft, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@tenexim/ui';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!token) {
            setFeedback({ type: 'error', text: "Associated credentials authorization token is missing." });
        }
    }, [token]);

    const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('token', token);

        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        if (password !== confirmPassword) {
            setFeedback({ type: 'error', text: "Passwords do not match." });
            setIsLoading(false);
            return;
        }

        try {
            const res = await resetPasswordAction(null, formData);
            if (res.success) {
                setFeedback({ type: 'success', text: res.message || "Password updated successfully." });
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setFeedback({ type: 'error', text: res.error || "Password update was rejected." });
            }
        } catch (err) {
            setFeedback({ type: 'error', text: "Connection error occurred." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={() => router.push('/login')}
                className="absolute top-8 left-8 flex items-center text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-wider"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Authentication
            </button>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 lg:hidden">
                    <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center">
                        <Globe className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-xl font-bold tracking-tight text-slate-900">TENEXIM</span>
                        <span className="block text-[8px] font-bold tracking-widest uppercase text-amber-600">Sovereign OS</span>
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                    Define Security Key
                </h2>
                <p className="mt-2 text-sm text-slate-500 font-medium">
                    Reset your passphrase profile to recover full access.
                </p>
            </div>

            {feedback && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-in slide-in-from-top-2 ${
                    feedback.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800' 
                        : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800'
                }`}>
                    {feedback.type === 'success' ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs font-bold uppercase tracking-wide leading-relaxed">
                        {feedback.text}
                    </div>
                </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        New Security Key
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        disabled={isLoading || !token}
                        placeholder="••••••••"
                        className="block w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 py-2 px-4 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-900 text-sm font-medium transition-all outline-none disabled:opacity-50"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Verify Security Key
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        disabled={isLoading || !token}
                        placeholder="••••••••"
                        className="block w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 py-2 px-4 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-900 text-sm font-medium transition-all outline-none disabled:opacity-50"
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading || !token}
                    className="w-full h-11 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 hover:bg-amber-600 dark:hover:bg-amber-400 uppercase tracking-widest text-[10px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Overwriting...
                        </>
                    ) : (
                        "Save New Code Phrase"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}