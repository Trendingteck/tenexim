"use client";

import React from 'react';
import { Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@tenexim/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard/overview');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 transition-colors duration-300">

      {/* Form Section */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-slate-950 relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 flex items-center text-sm font-medium text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-slate-900 dark:bg-amber-500 rounded flex items-center justify-center shadow-lg">
                <Globe className="text-white dark:text-slate-950 w-7 h-7" />
              </div>
              <div>
                <span className="block text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">TENEXIM</span>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mt-0.5">Trade Intelligence</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Sign in to access your trade intelligence dashboard.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  className="block w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-4 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-900 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-4 text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-900 text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800" />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-slate-600 dark:text-slate-400">Remember me</label>
              </div>
              <a href="#" className="text-sm font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-lg">
              Sign in
            </Button>
          </form>

          <p className="mt-12 text-center text-sm font-medium text-slate-500">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-amber-600 hover:text-amber-500 dark:text-amber-400">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Visual Section */}
      <div className="hidden lg:block relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554252116-445ae026f7a6?q=80&w=2608&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>

        <div className="absolute bottom-24 left-16 right-16">
          <blockquote className="text-2xl font-serif font-medium text-white leading-relaxed italic border-l-4 border-amber-500 pl-8">
            "The platform transformed how we approach supplier discovery. We've reduced procurement costs by 34%."
          </blockquote>
          <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            — Head of Procurement, Fortune 500 Manufacturing
          </p>
        </div>

        <div className="absolute top-12 right-12 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Users</div>
          <div className="text-xl font-bold text-white">12,847</div>
          <div className="text-xs font-bold text-emerald-500 uppercase">↑ 23% this month</div>
        </div>
      </div>
    </div>
  );
}
