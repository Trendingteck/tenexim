"use client";

import * as React from 'react';
import { useState, useRef } from 'react';
import {
    Upload,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Database,
    ShieldCheck,
    TrendingUp,
    Users as UsersIcon,
    Search,
    ArrowRight
} from 'lucide-react';
import { Button } from '@tenexim/ui';

export default function AdminDashboard() {
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        setUploading(true);
        // Simulate pipeline
        setTimeout(() => {
            setUploading(false);
            setStatus('success');
        }, 3000);
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white font-display">System Administration</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Control center for Tenexim platform data and operations.</p>
                </div>
            </div>

            {/* Admin Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatBox label="Total Records" value="2.14B" color="text-brand-500" />
                <AdminStatBox label="User Base" value="12.4k" color="text-blue-500" />
                <AdminStatBox label="Queue Status" value="Healthy" color="text-emerald-500" />
                <AdminStatBox label="Revenue (MTD)" value="$1.2M" color="text-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Data Upload & Pipeline */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 p-10 shadow-xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-brand-500 rounded-2xl">
                            <Upload className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Data Ingestion Pipeline</h3>
                            <p className="text-sm text-slate-500 font-medium">Upload Excel/CSV manifest data for processing.</p>
                        </div>
                    </div>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500/50 hover:bg-brand-50/10 transition-all group"
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" />
                        <FileSpreadsheet className="w-16 h-16 text-slate-300 group-hover:text-brand-500 mb-6 transition-colors" />
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Drag and drop manifest files</p>
                        <p className="text-sm text-slate-500 mt-2">Supports .CSV, .XLSX up to 500MB</p>
                        <Button className="mt-8 px-8 rounded-xl font-bold">Select Files</Button>
                    </div>

                    <div className="mt-10 flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${uploading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                {uploading ? 'Processing manifest pipeline...' : 'System ready for ingestion'}
                            </span>
                        </div>
                        {status === 'success' && <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm"><CheckCircle2 className="w-4 h-4" /> <span>Success</span></div>}
                        <Button onClick={handleUpload} disabled={uploading} className="rounded-xl font-bold">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Start Pipeline
                        </Button>
                    </div>
                </div>

                {/* Admin Controls */}
                <div className="grid grid-cols-1 gap-6">
                    <AdminControlCard
                        icon={<UsersIcon />}
                        title="Customer Support"
                        desc="Manage support tickets and user inquiries."
                        action="View Tickets"
                    />
                    <AdminControlCard
                        icon={<ShieldCheck />}
                        title="Data Governance"
                        desc="Monitor data quality and compliance standards."
                        action="Audit Logs"
                    />
                    <AdminControlCard
                        icon={<TrendingUp />}
                        title="Revenue Management"
                        desc="Subscription metrics and billing cycles."
                        action="Financials"
                    />
                    <AdminControlCard
                        icon={<Database />}
                        title="Infrastructure"
                        desc="System health and database optimization."
                        action="DevOps"
                    />
                </div>
            </div>
        </div>
    );
}

function AdminStatBox({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <h4 className={`text-3xl font-bold mt-1 font-display ${color}`}>{value}</h4>
        </div>
    );
}

function AdminControlCard({ icon, title, desc, action }: { icon: React.ReactNode, title: string, desc: string, action: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-between group hover:border-brand-500 transition-all cursor-pointer">
            <div className="flex items-center space-x-6">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                    {icon}
                </div>
                <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white font-display">{title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{desc}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 text-brand-500 font-bold text-sm">
                <span>{action}</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </div>
    )
}
