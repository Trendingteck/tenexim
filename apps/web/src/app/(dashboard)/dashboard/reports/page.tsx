"use client";

import React, { useState } from 'react';
import {
    FileText,
    Download,
    History,
    Database,
    Zap,
    TrendingUp,
    FileSpreadsheet,
    FileSearch,
    UserCheck,
    ArrowRight,
    Search,
    Filter,
    Clock,
    DollarSign,
    Presentation,
    ChevronRight,
    MessageSquareQuote,
    Sparkles
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, CardDescription, Badge, Input } from '@tenexim/ui';

type ActiveTab = 'assets' | 'downloads' | 'msi';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('assets');

    return (
        <div className="min-h-full bg-slate-50/50 dark:bg-slate-950 p-8 space-y-10 animate-fade-in-up">

            {/* TOP BAR: WALLET & OVERVIEW */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">Intelligence Hub</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your data assets, consumption, and professional services.</p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="px-6 py-3 border-r border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Available Points</span>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span className="text-2xl font-black text-slate-900 dark:text-white">2,840</span>
                        </div>
                    </div>
                    <div className="px-6 py-3">
                        <Button variant="brand" className="rounded-xl shadow-lg">Buy Credits</Button>
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
                <TabButton
                    active={activeTab === 'assets'}
                    onClick={() => setActiveTab('assets')}
                    icon={<Presentation className="w-4 h-4" />}
                    label="AI Assets"
                />
                <TabButton
                    active={activeTab === 'downloads'}
                    onClick={() => setActiveTab('downloads')}
                    icon={<History className="w-4 h-4" />}
                    label="Download History"
                />
                <TabButton
                    active={activeTab === 'msi'}
                    onClick={() => setActiveTab('msi')}
                    icon={<UserCheck className="w-4 h-4" />}
                    label="Human MSI Reports"
                />
            </div>

            {/* CONTENT AREA */}
            <div className="space-y-8">
                {activeTab === 'assets' && <AIAssetsSection />}
                {activeTab === 'downloads' && <DownloadHistorySection />}
                {activeTab === 'msi' && <MSIRequestSection />}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                ${active
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
            `}
        >
            {icon}
            {label}
        </button>
    );
}

/* --- SECTION: AI GENERATED ASSETS --- */
function AIAssetsSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { title: 'Global Coffee Trends 2025', type: 'Executive Presentation', format: 'SLIDES', date: '2h ago' },
                { title: 'HS 8542.31 Component Analysis', type: 'Market Analysis', format: 'PDF', date: 'Yesterday' },
                { title: 'Brazil Export Volatility Report', type: 'Data Summary', format: 'DOCX', date: '3 days ago' },
            ].map((asset, i) => (
                <Card key={i} className="group hover:border-amber-500 transition-all cursor-pointer">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-500">
                                {asset.format === 'SLIDES' ? <Presentation className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                            </div>
                            <Badge variant="secondary" className="text-[10px] font-black">{asset.format}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-amber-600 transition-colors">{asset.title}</CardTitle>
                        <CardDescription>{asset.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {asset.date}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ArrowRight className="w-4 h-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all group bg-white/30 dark:bg-slate-900/10">
                <Sparkles className="w-10 h-10 mb-4 group-hover:animate-spin" />
                <span className="font-bold">Generate New with AI</span>
                <span className="text-xs opacity-60">Uses Intelligence Lab</span>
            </button>
        </div>
    );
}

/* --- SECTION: DOWNLOAD HISTORY --- */
function DownloadHistorySection() {
    return (
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center gap-4">
                    <History className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Data Transaction Ledger</h3>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800">Showing last 30 days</Badge>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100 dark:border-slate-800">
                            <th className="px-8 py-4">Transaction Date</th>
                            <th className="px-6 py-4">Dataset Name</th>
                            <th className="px-6 py-4 text-center">Entries</th>
                            <th className="px-6 py-4 text-center">Points Cost</th>
                            <th className="px-6 py-4">Format</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                            { date: 'Oct 24, 2024 • 14:22', name: 'India Textile Export Bulk_Q3', entries: 1250, cost: 1250, format: 'XLSX' },
                            { date: 'Oct 22, 2024 • 09:10', name: 'Vietnam Tech Lane Analysis', entries: 420, cost: 420, format: 'CSV' },
                            { date: 'Oct 20, 2024 • 18:45', name: 'Brazil Coffee Shipments_Full', entries: 8400, cost: 8400, format: 'JSON' },
                            { date: 'Oct 18, 2024 • 11:30', name: 'USA Port Manifest_LAX', entries: 200, cost: 200, format: 'XLSX' },
                        ].map((tx, i) => (
                            <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-8 py-5 text-sm font-medium text-slate-500">{tx.date}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{tx.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center font-bold text-slate-600 dark:text-slate-300">{tx.entries.toLocaleString()}</td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold rounded-lg text-xs">
                                        <Zap className="w-3 h-3" /> {tx.cost}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-xs font-black text-slate-400">{tx.format}</td>
                                <td className="px-8 py-5 text-right">
                                    <Button variant="ghost" size="sm" className="font-bold text-amber-600">Re-Download</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

/* --- SECTION: HUMAN ANALYSED MSI REPORTS --- */
function MSIRequestSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Request Form */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="border-2 border-amber-500/20 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -z-10 rounded-full"></div>
                    <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-2xl font-black font-display flex items-center gap-3">
                            <MessageSquareQuote className="w-6 h-6 text-amber-500" />
                            Request Professional MSI Analysis
                        </CardTitle>
                        <CardDescription>Human analysts will curate a custom Market Strength Index report for your specific trade lane.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Title</label>
                                <Input placeholder="e.g. Q4 Competitor Analysis - Lithium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary HS Codes</label>
                                <Input placeholder="Comma separated codes..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Geographic Scope</label>
                                <Input placeholder="e.g. SE Asia, Brazil, Mexico" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Required Timeline</label>
                                <select className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500 transition-all">
                                    <option>Standard (3-5 Business Days)</option>
                                    <option>Express (24-48 Hours)</option>
                                    <option>Bespoke (Extended Project)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specific Requirements & Data Points</label>
                            <textarea
                                placeholder="Describe the specific insights you are looking for..."
                                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">A custom quote will be generated within 2 hours.</span>
                            </div>
                            <Button variant="brand" className="px-8 h-12 text-lg font-bold">Submit Request</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Past MSI Requests Sidebar */}
            <div className="space-y-6">
                <Card className="bg-slate-900 text-white border-none shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg">Why MSI Professional?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <WhyMSIItem title="Human Verification" desc="Data anomalies checked by trade experts." />
                        <WhyMSIItem title="Competitor Profiling" desc="Deep-dive into hidden entity structures." />
                        <WhyMSIItem title="Price Predictions" desc="Algorithm + Expert market sentiment." />
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Active Requests</h4>
                    {[
                        { title: 'Semiconductor Lane Analysis', status: 'In Review', date: 'Oct 25' },
                        { title: 'Vietnam Shoe Manufacturers', status: 'Awaiting Quote', date: 'Oct 23' },
                        { title: 'Global Lithium Price Study', status: 'Completed', date: 'Oct 12' },
                    ].map((req, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-500 transition-all cursor-pointer group">
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{req.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.date}</p>
                            </div>
                            <Badge variant={req.status === 'Completed' ? 'success' : 'warning'} className="text-[9px] px-2">{req.status}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function WhyMSIItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
            </div>
            <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CheckCircle2({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>;
}
