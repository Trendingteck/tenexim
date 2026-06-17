"use client";

import { useState } from 'react';
import { 
    Fingerprint, 
    ShieldAlert, 
    Globe, 
    Search, 
    Users,
    Download
} from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@tenexim/ui';
import { useComplianceAudit } from '@/hooks/useAnlayticsAudit';

export default function RiskCompliancePage() {
    const { runAudit, auditResult, isAuditing } = useComplianceAudit();
    const [searchQuery, setSearchQuery] = useState('');
    const [auditHs, setAuditHs] = useState('854231');
    const [auditOrigin, setAuditOrigin] = useState('CHN');

    const handleAuditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        runAudit({ hsCode: auditHs, origin: auditOrigin });
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.25em]">Security Clearance Level v9</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display uppercase">
                        Sovereign Risk Compliance Ledger
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Audit entity records, flag forced labor (UFLPA) components, and run automated tariff compliance screenings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                        <Download className="w-4 h-4 mr-1.5" />
                        Download Registry
                    </Button>
                    <Button variant="brand" className="h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800">
                        Sanction Lists Sync
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Fingerprint className="w-4 h-4 text-amber-500" />
                            HS / Origin Surtax Calculator
                        </CardTitle>
                        <CardDescription className="text-[10px]">Verify tariff exposures and landed customs surcharges directly.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
                        <form onSubmit={handleAuditSubmit} className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">HS / Custom Tariff Code</label>
                                <Input 
                                    value={auditHs} 
                                    onChange={(e) => setAuditHs(e.target.value)} 
                                    placeholder="e.g. 854231" 
                                    className="h-8 text-xs rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Origin Territory (3-Letter ISO)</label>
                                <Input 
                                    value={auditOrigin} 
                                    onChange={(e) => setAuditOrigin(e.target.value.toUpperCase())} 
                                    placeholder="e.g. CHN" 
                                    className="h-8 text-xs rounded-lg font-mono uppercase"
                                    maxLength={3}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isAuditing}
                                className="w-full h-9 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 hover:bg-amber-600 rounded-lg shadow-sm"
                            >
                                {isAuditing ? 'Auditing Ledger...' : 'Screen Custom Vectors'}
                            </Button>
                        </form>

                        {auditResult && (
                            <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-800 space-y-2 animate-in fade-in zoom-in-95 font-mono text-[10px]">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                                    <span className="text-[8px] text-slate-400 uppercase font-black">TARIFF COMPLIANCE STATUS</span>
                                    <span className={`px-1 rounded text-[8px] font-bold ${auditResult.overallRisk.includes('HIGH') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{auditResult.sanctions}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="flex justify-between"><span className="text-slate-400">Basic Rate:</span> <span className="font-bold">{auditResult.basicTariff}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400">Surcharges:</span> <span className="font-bold text-amber-400">{auditResult.surtax}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400">Assessment:</span> <span className={`font-bold uppercase ${auditResult.overallRisk.includes('HIGH') ? 'text-red-400' : 'text-emerald-400'}`}>{auditResult.overallRisk}</span></p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-slate-400" />
                            Monitored Entity Directory
                        </span>
                        <div className="relative max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input 
                                placeholder="Search audited exporters..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 pl-8 text-[10px] font-medium bg-white max-w-[200px]"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[10px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[8px] font-black uppercase tracking-wider">
                                    <th className="px-5 py-3 pl-6">AUDITED CORPORATION</th>
                                    <th className="px-5 py-3 text-center">UFLPA STATUS</th>
                                    <th className="px-5 py-3 text-center">OFAC SANCTIONS</th>
                                    <th className="px-5 py-3 text-center">ULTIMATE BENEFICIAL OWNER (UBO)</th>
                                    <th className="px-5 py-3 text-right pr-6">OVERALL LANDED RISK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {[
                                    { name: "SICHUAN ENERGY LITHIUM CO", country: "CHN", uflpa: "CLEARED", ofac: "CLEARED", ubo: "State-Owned Entity", risk: "LOW RISK", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                                    { name: "XINJIANG HIGH-TECH SILICON INDUSTRIAL", country: "CHN", uflpa: "FLAGGED BLOCK", ofac: "SDN LISTED", ubo: "Xinjiang Dev Corp", risk: "RESTRICTED", statusColor: "text-red-600 bg-red-50 border-red-100" },
                                    { name: "DA NANG METALS FACTORY LTD", country: "VNM", uflpa: "AUDIT REQUIRED", ofac: "CLEARED", ubo: "VNM Private Ltd", risk: "MODERATE RISK", statusColor: "text-amber-600 bg-amber-50 border-amber-100" },
                                    { name: "VOLGOGRAD SPECIAL CARGO CARRIER", country: "RUS", uflpa: "CLEARED", ofac: "SDN LISTED", ubo: "Maritime Transport LLC", risk: "RESTRICTED", statusColor: "text-red-600 bg-red-50 border-red-100" },
                                ].filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map((entity, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3.5 pl-6">
                                            <div className="font-bold text-slate-900">{entity.name}</div>
                                            <div className="text-[8px] text-slate-400 font-semibold uppercase flex items-center gap-1 mt-0.5">
                                                <Globe className="w-2.5 h-2.5" /> Origin country: {entity.country}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-black border ${entity.uflpa === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {entity.uflpa}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-black border ${entity.ofac === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {entity.ofac}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center text-slate-500 font-medium">
                                            {entity.ubo}
                                        </td>
                                        <td className="px-5 py-3.5 text-right pr-6 font-bold">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black border ${entity.statusColor}`}>
                                                {entity.risk}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}