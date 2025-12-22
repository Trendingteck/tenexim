"use client";

import * as React from 'react';
import { useState } from 'react';
import {
    Upload,
    FileText,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Database,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Badge
} from '@tenexim/ui';

export default function AdminUploadPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: 'File Validation', description: 'Checking CSV/Excel schema and types', icon: FileText },
        { title: 'Preprocessing', description: 'Cleaning data and normalizing HS codes', icon: Database },
        { title: 'Data Governance', description: 'Applying security and compliance checks', icon: ShieldCheck },
        { title: 'Final Indexing', description: 'Pushing validated data to Global Search', icon: BarChart3 },
    ];

    const startUpload = () => {
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            if (progress % 25 === 0) {
                setCurrentStep(Math.floor(progress / 25));
            }
            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
            }
        }, 200);
    };

    return (
        <div className="space-y-8 animate-fade-in-up p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">Data Ingestion Engine</h2>
                    <p className="text-slate-500 dark:text-slate-400">Upload and process large-scale B2B shipment datasets.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <Button variant="ghost" className="rounded-lg text-xs font-bold px-4">Customer Support</Button>
                    <Button variant="ghost" className="rounded-lg text-xs font-bold px-4">Governance</Button>
                    <Button variant="ghost" className="rounded-lg text-xs font-bold px-4">Revenue</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 h-[400px] flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-brand-500 transition-all">
                        <div className="flex flex-col items-center text-center space-y-4 px-6">
                            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/20 text-brand-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Drag & Drop Dataset</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Support for .xlsx, .csv, and .json formats up to 2GB per upload.</p>
                            </div>
                            <Button variant="brand" size="xl" onClick={startUpload} disabled={isUploading}>
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing... {uploadProgress}%
                                    </>
                                ) : 'Browse Files'}
                            </Button>
                        </div>
                    </Card>

                    {/* Preprocessing Pipeline Visualisation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-brand-500" />
                                Preprocessing Pipeline
                            </CardTitle>
                            <CardDescription>Automatic pipeline for data cleanup and enrichment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative flex justify-between">
                                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-1" />
                                <div
                                    className="absolute top-5 left-0 h-0.5 bg-brand-500 transition-all duration-500 -z-1"
                                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                />
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center space-y-3 z-10 bg-white dark:bg-slate-950 px-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${idx < currentStep ? 'bg-brand-500 border-brand-500 text-white' :
                                            idx === currentStep ? 'bg-white dark:bg-slate-900 border-brand-500 text-brand-500 scale-110' :
                                                'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                                            }`}>
                                            {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${idx === currentStep ? 'text-brand-500' : 'text-slate-500'}`}>{step.title}</div>
                                            <div className="text-[9px] text-slate-400 font-medium max-w-[100px]">{step.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Stats & History */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Database Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-xl">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Entries</span>
                                <span className="text-xl font-black">1.2B+</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-xl">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Growth (24h)</span>
                                <span className="text-xl font-black text-emerald-400">+12.4M</span>
                            </div>
                            <Button variant="ghost" className="w-full text-slate-400 hover:text-white justify-between">
                                View Database Governance
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Ingestions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">china_q3_shipments.csv</div>
                                                <div className="text-[10px] text-slate-400 font-medium">842k rows • 4h ago</div>
                                            </div>
                                        </div>
                                        <Badge variant="success" className="rounded-full">Success</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

