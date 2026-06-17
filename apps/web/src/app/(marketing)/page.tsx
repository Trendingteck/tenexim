"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  ChevronRight,
  Database,
  Zap,
  ShieldCheck,
  Building2,
  BarChart3,
  Search,
  ChevronDown,
  ArrowRight,
  Cpu,
  Fingerprint,
  TrendingUp,
  Map,
  CheckCircle2,
  Lock,
  Plus,
  HelpCircle,
  Clock,
  ExternalLink,
  Sliders,
  Activity,
  ArrowRightLeft,
  Filter,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@tenexim/ui';
import { Navbar } from '@/components/marketing/Navbar';
import { Features } from '@/components/marketing/Features';
import { DashboardPreview } from '@/components/marketing/DashboardPreview';

// Mock Sandbox Data for Interactive Trade Ledger
const SANDBOX_DATA: Record<string, {
  hs: string;
  name: string;
  overallRisk: string;
  riskColor: string;
  tariffs: { base: string; surcharge: string; dynamicLimit: string };
  shipments: Array<{ exporter: string; importer: string; value: string; route: string; status: string; statusColor: string }>;
}> = {
  semiconductors: {
    hs: "8542.31.00",
    name: "Monolithic Integrated Circuit Processors",
    overallRisk: "LOW STABILITY VECTOR",
    riskColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
    tariffs: { base: "2.5%", surcharge: "0.0% (Exempt)", dynamicLimit: "$2,500,000 threshold" },
    shipments: [
      { exporter: "Taiwan Semiconductor Mfg [TWN]", importer: "Tata Energy Corp [IND]", value: "$1,452,000", route: "Hsinchu ➔ Nhava Sheva", status: "CLEARED", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" },
      { exporter: "Siemens Wafers GMBH [DEU]", importer: "Semicon India Ltd [IND]", value: "$842,900", route: "Hamburg ➔ Chennai Port", status: "CLEARED", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" },
    ]
  },
  batteries: {
    hs: "8507.60.00",
    name: "Lithium-Ion Storage Cell Modules",
    overallRisk: "HIGH EXPOSURE TARIFF RISK",
    riskColor: "text-red-500 bg-red-500/10 border-red-500/20",
    tariffs: { base: "3.4%", surcharge: "+25.0% active (Sec 301)", dynamicLimit: "$500,000 quota cap" },
    shipments: [
      { exporter: "Sichuan Lithium Energy [CHN]", importer: "Vistara Tech Systems [IND]", value: "$412,500", route: "Shanghai ➔ Mumbai Port", status: "UFLPA AUDIT REQ", statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/10" },
      { exporter: "Xinjiang Silicon Corp [CHN]", importer: "Indo Energy Ltd [IND]", value: "$182,000", route: "Shanghai ➔ Nhava Sheva", status: "FLAGGED BLOCK", statusColor: "text-red-500 bg-red-500/10 border-red-500/10" },
    ]
  },
  renewables: {
    hs: "8504.40.90",
    name: "Static Inverters for Solar Arrays",
    overallRisk: "MODERATE WATCHLIST VECTOR",
    riskColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    tariffs: { base: "1.8%", surcharge: "+15.0% Anti-Dumping", dynamicLimit: "$1,200,000 allowance" },
    shipments: [
      { exporter: "Da Nang Metals Factory [VNM]", importer: "CleanGrid Power [IND]", value: "$221,000", route: "Da Nang ➔ Mumbai Port", status: "COORDINATE MATCH", statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" },
    ]
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'semiconductors' | 'batteries' | 'renewables'>('semiconductors');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeFaq, setActiveFAQ] = useState<number | null>(null);

  // Live Shipment Stream Ticker Simulator
  const [tickerItem, setTickerItem] = useState({ id: 0, text: "LIVE STREAM INITIALIZING..." });
  useEffect(() => {
    const liveStreams = [
      "[Live Ingest] Nhava Sheva Custom Node #1024 synced 5G Module manifest ($142,500)",
      "[Fuzzy Resolved] 'Tata Communication' matched to verified corporate node in India",
      "[Sanctions Clearance] Siemens Wafers GMBH successfully passed OFAC SDN query mapping",
      "[UFLPA Audit] Da Nang Metals shipment flagged under Vietnam bypass route logic",
      "[ClickHouse Buffer] ClickHouse processed 24,000 rows in 44ms (Total Index Size: 2.1B)"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setTickerItem({ id: idx, text: liveStreams[idx] });
      idx = (idx + 1) % liveStreams.length;
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/dashboard/search');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-amber-500 selection:text-white transition-colors duration-300 relative overflow-hidden">
      
      {/* Dot grid layout context */}
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-[0.12] pointer-events-none"></div>

      <Navbar />

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Live Ticker Badge */}
          <div className="inline-flex items-center gap-3.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-850 mb-10 shadow-lg backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-350">
              {tickerItem.text}
            </span>
          </div>

          {/* Premium Typography Showcase */}
          <h1 className="text-4xl md:text-7.5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.05] mb-8 font-serif">
            Decisions driven by <br className="hidden md:inline" />
            <span className="text-gold-gradient italic font-normal tracking-wide">verified reality.</span>
          </h1>

          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            TENEXIM Trade OS structures raw, fragmented customs manifests into high-fidelity entity networks. Query over 2 billion global trade records instantly.
          </p>

          {/* Quick Search Action Box */}
          <div className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200/60 dark:border-slate-800/80 mb-16">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query Exporters, Importers, HS Codes, or Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-xl pl-11 pr-4 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-sm"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto h-12 px-7 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md">
                Search Node
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Corporate Validation Grid */}
          <div className="pt-10 border-t border-slate-200/60 dark:border-slate-850 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-65">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Trusted Sourcing Architecture For:</p>
            <div className="flex flex-wrap gap-x-12 gap-y-4 justify-center items-center font-serif font-black text-slate-700 dark:text-slate-350 text-sm">
              <span className="tracking-widest">MAERSK LOGISTICS</span>
              <span className="tracking-widest">DHL GLOBAL</span>
              <span className="tracking-widest">KUEHNE+NAGEL</span>
              <span className="tracking-widest">SUMITOMO CORP</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* DASHBOARD PREVIEW MATRIX */}
      {/* ========================================================================= */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <DashboardPreview />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MARITIME INGESTION NODES GRAPH (New Advanced Section) */}
      {/* ========================================================================= */}
      <section id="customs-nodes" className="py-24 relative overflow-hidden bg-slate-900 text-white border-y border-slate-850">
        <div className="absolute inset-0 bg-grid-dark opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Port Traffic Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-950/80 rounded-[2rem] border border-slate-800 p-6 relative">
                
                {/* Node Grid Layout */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest block">MARITIME DATA GIN</span>
                    <h3 className="text-sm font-black uppercase text-white font-display mt-0.5">Real-Time Custom Ingest Terminals</h3>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold uppercase tracking-wider animate-pulse">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    ACTIVE INGEST
                  </span>
                </div>

                <div className="space-y-4 font-mono text-[11px]">
                  
                  {/* Port Node 1 */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-amber-500/45 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 shrink-0">
                        <Globe className="w-5 h-5 animate-spin [animation-duration:12s]" />
                      </div>
                      <div>
                        <div className="font-extrabold text-white text-xs">PORT OF SHANGHAI [CNSHA]</div>
                        <div className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">Frequency: Dynamic • Queue size: 12 B/L</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">$12,482,900</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Synced 1m ago</span>
                    </div>
                  </div>

                  {/* Port Node 2 */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-amber-500/45 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 shrink-0">
                        <Globe className="w-5 h-5 animate-spin [animation-duration:20s]" />
                      </div>
                      <div>
                        <div className="font-extrabold text-white text-xs">ROTTERDAM SEAPORT [NLRTM]</div>
                        <div className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">Frequency: Dynamic • Queue size: 4 B/L</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">$4,120,400</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Synced 3m ago</span>
                    </div>
                  </div>

                  {/* Port Node 3 */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-amber-500/45 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-white text-xs">NHAVA SHEVA PORT [INNSA]</div>
                        <div className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">Frequency: Realtime Buffer • Queue size: 0 B/L</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">$1,894,000</span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">SYNCING NOW</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Ingestion Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <Database className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Automated Customs Ingest</span>
              </div>
              <h2 className="text-3xl md:text-5.5xl font-black uppercase tracking-tight leading-[1.1] font-serif">
                Connecting Fragmented Systems
              </h2>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider leading-relaxed">
                We ingest unstructured custom documents and standard customs data automatically. Each filing is parsed, cleaned, and compiled into standardized table structures.
              </p>
              <div className="space-y-4">
                <IngestPoint title="Direct Port Buffers" desc="Raw filings mapped in real-time from over 120 global customs stations." />
                <IngestPoint title="Automated Currency Resolvers" desc="Instant conversions of declared local values into standardized USD & INR totals." />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* CUSTOMS TARIFF SANDBOX */}
      {/* ========================================================================= */}
      <section id="sandbox" className="py-24 bg-white dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 mb-3">
              <Sliders className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Interactive Custom Ledger Sandbox</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display mb-4">
              Tariff and Compliance Sandbox
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Explore custom duty and compliance logic using real-world shipment vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Control Column */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">1. Select Cargo Classification</span>
              <div className="flex flex-col gap-2">
                {Object.keys(SANDBOX_DATA).map((key) => {
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                        isActive 
                          ? 'bg-slate-900 text-white border-transparent dark:bg-amber-500 dark:text-slate-950 font-extrabold' 
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 border-slate-200/60 dark:border-slate-800/60 hover:border-amber-500/50 cursor-pointer'
                      }`}
                    >
                      <div className="font-mono text-[9px] font-black uppercase tracking-wider opacity-60 mb-1">
                        HS {SANDBOX_DATA[key].hs}
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-tight leading-tight">
                        {SANDBOX_DATA[key].name}
                      </h3>
                      {isActive && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-slate-950"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Assessment Panel */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 space-y-3 font-mono text-[10px]">
                <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-800 pb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Customs Assessment</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${SANDBOX_DATA[activeTab].riskColor}`}>
                    {SANDBOX_DATA[activeTab].overallRisk}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="flex justify-between"><span className="text-slate-400">MFN Rate:</span> <span className="font-extrabold">{SANDBOX_DATA[activeTab].tariffs.base}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Tariff Surcharge:</span> <span className="font-extrabold text-amber-500">{SANDBOX_DATA[activeTab].tariffs.surcharge}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Volume Cap:</span> <span className="font-extrabold">{SANDBOX_DATA[activeTab].tariffs.dynamicLimit}</span></p>
                </div>
              </div>
            </div>

            {/* Ingestion Table Column */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-500" />
                  Dynamic Shipments Output Ledger
                </span>
                <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  CLICKHOUSE INGESTION ACTIVE
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60 dark:border-slate-850">
                      <th className="px-5 py-3 pl-6">Exporter Corp</th>
                      <th className="px-5 py-3">Importer Corp</th>
                      <th className="px-5 py-3 text-center">Customs Corridor</th>
                      <th className="px-5 py-3 text-right">Value (USD)</th>
                      <th className="px-5 py-3 text-right pr-6">Clearance Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                    {SANDBOX_DATA[activeTab].shipments.map((ship, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all">
                        <td className="px-5 py-4 pl-6 font-extrabold text-slate-900 dark:text-white uppercase">
                          {ship.exporter}
                        </td>
                        <td className="px-5 py-4 font-bold uppercase">{ship.importer}</td>
                        <td className="px-5 py-4 text-center text-slate-400 uppercase font-semibold">{ship.route}</td>
                        <td className="px-5 py-4 text-right font-black text-emerald-600">{ship.value}</td>
                        <td className="px-5 py-4 text-right pr-6">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black border ${ship.statusColor}`}>
                            {ship.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COMPLIANCE & TRIGRAM RESOLUTION SHOWCASE (New Advanced Section) */}
      {/* ========================================================================= */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative border-b border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                <Fingerprint className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Dynamic Stakeholder Clean-up</span>
              </div>
              <h2 className="text-3xl md:text-5.5xl font-black uppercase tracking-tight leading-[1.1] font-serif">
                Name Resolution Via Trigram Indices
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider leading-relaxed">
                Raw customs filings are notoriously messy, showing variations like "TATA ENERGY CORP", "TATA ENG L-T-D", and "TATA-CORP" for the exact same company. Our platform matches these using advanced algorithms to compile accurate stakeholder files.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white">99.4% Matching Accuracy</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Fuzzy text variations are reconciled into a single verified parent ID.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolved Trigram Visualizer */}
            <div className="lg:col-span-7">
              <Card className="border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-950 rounded-[2rem] shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trigram Index Resolution Simulator</span>
                  <span className="text-[10px] font-mono text-slate-400">RESOLVED</span>
                </div>

                <div className="space-y-4 font-mono text-[10px]">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-red-500 line-through">"Tata Electronics Indus (India) Ltd"</span>
                      <span className="text-slate-400 text-[9px] block">Raw custom filing row #1024</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                    <span className="text-emerald-500 font-bold">TATA GROUP NODES</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-red-500 line-through">"TATA ENERGY INTL CORP [IN]"</span>
                      <span className="text-slate-400 text-[9px] block">Raw custom filing row #1025</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                    <span className="text-emerald-500 font-bold">TATA GROUP NODES</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-red-500 line-through">"Tata Electronics Pvt."</span>
                      <span className="text-slate-400 text-[9px] block">Raw custom filing row #1026</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-500" />
                    <span className="text-emerald-500 font-bold">TATA GROUP NODES</span>
                  </div>
                </div>
              </Card>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURES COMPONENT IMPORT */}
      {/* ========================================================================= */}
      <Features />

      {/* ========================================================================= */}
      {/* TECHNICAL ARCHITECTURE MATRIX */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-3">
                <Cpu className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Enterprise-Grade Architecture</span>
              </div>
              <h2 className="text-3xl md:text-5.5xl font-black uppercase tracking-tight font-serif mb-4 leading-tight">
                Built for High-Velocity Compliance
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                TENEXIM is not a static database wrapper. Our architecture merges transactional PostgreSQL schemas with high-density ClickHouse analytical nodes, parsing incoming custom filings in sub-50ms execution scopes.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 font-mono">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-amber-500 text-3xl font-black mb-2">&lt;50ms</div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-300">Query Execution Threshold</h4>
                <p className="text-[9px] text-slate-500 mt-1 leading-normal">Fast indexes on billion-record sets via ClickHouse DB.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-amber-500 text-3xl font-black mb-2">99.99%</div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-300">Handshake Service SLA</h4>
                <p className="text-[9px] text-slate-500 mt-1 leading-normal">High availability clusters replicated across AWS and Supabase.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block mb-2">1. Ingestion Pipeline</span>
              <h3 className="text-sm font-black uppercase text-white mb-2">Dual-Engine Sync</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Shipment filings are mirrored to ClickHouse for aggregations and PostgreSQL for atomic transactional integrity.
              </p>
            </div>
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block mb-2">2. Parsing Core</span>
              <h3 className="text-sm font-black uppercase text-white mb-2">UNPDF Extraction</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                AI Copilot reads unstructured PDF trade bills of lading, converting messy text schemas into structured database columns.
              </p>
            </div>
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block mb-2">3. Sanction Guard</span>
              <h3 className="text-sm font-black uppercase text-white mb-2">OFAC Real-Time Match</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Incoming supplier names are checked against dynamic OFAC SDN registry lists via high-speed trigram indexes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRICING MATRIX */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-display text-slate-900 dark:text-white mb-4">
              Sovereign Pricing Structures
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
              Clear, upfront allocations mapped to your intelligence requirements.
            </p>
            
            {/* Switch Toggle */}
            <div className="inline-flex bg-slate-200/60 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-350/45">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${!isAnnual ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 cursor-pointer'}`}
              >
                Monthly Plan
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 cursor-pointer'}`}
              >
                Annual Save 20%
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* Standard Tier */}
            <Card className="flex flex-col justify-between bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl relative shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Standard Intelligence</span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">${isAnnual ? '160' : '200'}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">/ Mo</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Perfect for independent compliance operators and growing supply chains.
                </p>
                <hr className="border-slate-100 dark:border-slate-850 mb-6" />
                <ul className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Full India Direct Customs manifest</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Global Search Queries</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Standard PDF manifest parser</li>
                  <li className="flex items-center gap-2 text-slate-400 line-through"><Lock className="w-4 h-4 text-slate-300 shrink-0" /> AI Trade Copilot Advanced</li>
                </ul>
              </div>
              <Button onClick={() => router.push('/register')} className="w-full mt-8 font-black uppercase text-[10px] tracking-widest h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-900 dark:text-white border-none cursor-pointer">
                Acquire Standard Node
              </Button>
            </Card>

            {/* Premium Tier */}
            <Card className="flex flex-col justify-between bg-white dark:bg-slate-950 border-2 border-amber-500 p-8 rounded-2xl relative shadow-xl transform-gpu md:-translate-y-2">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                Most Chosen
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-2">Premium Operator</span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">${isAnnual ? '360' : '450'}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">/ Mo</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-6">
                  For active international companies mapping competitor lanes.
                </p>
                <hr className="border-slate-100 dark:border-slate-850 mb-6" />
                <ul className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Direct + Smart Mirrored global maps</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Full AI Trade Copilot Lab access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 2,000 unpdf parsed pages / Mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> OFAC SDN sanctions sync guard</li>
                </ul>
              </div>
              <Button onClick={() => router.push('/register')} className="w-full mt-8 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 border-none shadow-glow cursor-pointer">
                Acquire Premium Node
              </Button>
            </Card>

            {/* Enterprise Tier */}
            <Card className="flex flex-col justify-between bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl relative shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Enterprise Core</span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">Custom</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Custom parameters, secure REST APIs, and dedicated analyst Consulting.
                </p>
                <hr className="border-slate-100 dark:border-slate-850 mb-6" />
                <ul className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> High-volume API token pools</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated custom ClickHouse schemas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Bespoke Human MSI briefings</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Custom legal NDA parameters</li>
                </ul>
              </div>
              <Button onClick={() => router.push('/register')} className="w-full mt-8 font-black uppercase text-[10px] tracking-widest h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-900 dark:text-white border-none cursor-pointer">
                Contact Sovereign Sales
              </Button>
            </Card>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-slate-850">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-display text-slate-900 dark:text-white mb-4">
              Intelligence FAQ
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
              Standard compliance definitions and data coverage specifications.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How current are the global trade records?", a: "Direct India custom manifest datasets are synchronized at a high frequency, updating dynamically within 24 hours of official filings. Mirrored global pipelines are processed and loaded into our analytical systems on weekly scheduled batches." },
              { q: "What is the difference between direct and mirrored records?", a: "Direct records represent native filings obtained with authorized compliance nodes. Mirrored records represent reciprocal trade flows mapped by analyzing bilateral customs databases from trade corridors." },
              { q: "Can we integrate raw customs manifest files?", a: "Yes. Our platform utilizes advanced unpdf engines capable of extracting raw unstructured text parameters from customs manifests, normalizing the values, and mapping them securely to ClickHouse schemas in real-time." },
              { q: "Is the AI Trade Copilot compliant with corporate policies?", a: "Absolutely. All queries processed by the AI Trade Copilot are handled via isolated private endpoints, guaranteeing that your compliance analysis does not leak into public models." }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-slate-200/60 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 overflow-hidden animate-in fade-in duration-300">
                  <button
                    type="button"
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 border-t border-slate-100 dark:border-slate-850 p-5' : 'max-h-0 pointer-events-none'}`}>
                    <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXTENSIVE DIRECTORY FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-500" />
                <span className="font-display font-black text-xl tracking-tight uppercase">TENEXIM</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold uppercase tracking-wider">
                Sovereign Trade OS for international logistics compliance. Aggregating, index scaling, and securing trade intelligence since 2018.
              </p>
            </div>

            {/* Sitemap 1 */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4">Core Directory</h4>
              <ul className="space-y-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <li><Link href="/dashboard/search" className="hover:text-white transition">Global Search</Link></li>
                <li><Link href="/dashboard/shipments" className="hover:text-white transition">Customs Ledger</Link></li>
                <li><Link href="/dashboard/copilot" className="hover:text-white transition">Copilot Labs</Link></li>
              </ul>
            </div>

            {/* Sitemap 2 */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4">Security Parameters</h4>
              <ul className="space-y-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition">OFAC Screening</a></li>
                <li><a href="#" className="hover:text-white transition">Compliance Guard</a></li>
                <li><a href="#" className="hover:text-white transition">API Integration</a></li>
              </ul>
            </div>

            {/* Sitemap 3 */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4">Corporate Office</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                TENEXIM Intelligence Corp<br />
                Sovereign Cyber Node 102<br />
                New Delhi, India
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <p>© 2026 TENEXIM Inc. All records evaluated under Private Deployment Standards apply.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Secured via SHA-512</a>
              <a href="#" className="hover:text-white transition">Stable Node Ingest</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

function IngestPoint({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
      </div>
      <div>
        <h4 className="text-xs font-black uppercase text-white leading-none">{title}</h4>
        <p className="text-[10px] text-slate-400 mt-1 leading-normal">{desc}</p>
      </div>
    </div>
  );
}