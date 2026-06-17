"use client";

import React from 'react';
import { Database, Zap, ShieldCheck, BarChart3, Users, Globe } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex flex-col items-start p-8 bg-white dark:bg-slate-950 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800/80 group hover:border-amber-500 hover:shadow-2xl dark:hover:shadow-amber-500/5 transition-all duration-300">
    <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm text-slate-900 dark:text-amber-400 group-hover:scale-105 transition-transform group-hover:bg-amber-500/10 border border-slate-200/20 dark:border-slate-800/20">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 tracking-wider uppercase font-display">{title}</h3>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold uppercase tracking-wider">{desc}</p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950/20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-3">Sovereign Capabilities</h2>
          <p className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display uppercase">
            Designed for Market Intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureItem 
            icon={Globe}
            title="Global Node Coverage"
            desc="Examine shipping routes across multiple global territories. Complete manifests are indexed in sub-50ms thresholds."
          />
          <FeatureItem 
            icon={Zap}
            title="Market Strength Index"
            desc="Sourcing volume ratings calculated in real time using ClickHouse database aggregation pipelines."
          />
          <FeatureItem 
            icon={ShieldCheck}
            title="Sanctions Clearance"
            desc="Supplier registries checked against dynamic OFAC SDN watchlists via high-speed trigram indexing."
          />
          <FeatureItem 
            icon={BarChart3}
            title="Competitor Analysis"
            desc="Track shipment departures, port arrivals, and routing updates directly from live billing manifestations."
          />
          <FeatureItem 
            icon={Users}
            title="Verified Stakeholders"
            desc="Verify registered entities, complete physical coordinate locations, and track parent company node listings."
          />
          <FeatureItem 
            icon={Database}
            title="UNPDF Document Engine"
            desc="AI extraction services parse messy and unstructured trade invoices directly into standardized table rows."
          />
        </div>
      </div>
    </section>
  );
};