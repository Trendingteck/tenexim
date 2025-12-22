
import React from 'react';
import { Database, Zap, ShieldCheck, BarChart3, Users, Globe } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="flex flex-col items-start p-10 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 group hover:border-brand-500 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300">
        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-sm text-brand-500 group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 font-display uppercase tracking-tight">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
);

export const Features: React.FC = () => {
    return (
        <section id="platform" className="py-32 bg-slate-50 dark:bg-slate-950 relative border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <h2 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em] mb-4">Core Capabilities</h2>
                    <p className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter font-display uppercase">
                        Precision Intelligence for <span className="underline decoration-brand-500 decoration-8 underline-offset-8">Market Mastery</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureItem 
                        icon={Globe}
                        title="Hyper-Global Scale"
                        desc="Connect into 218+ countries with a single query. Our database is unified, normalized, and accessible in milliseconds."
                    />
                    <FeatureItem 
                        icon={Zap}
                        title="AI-Powered MSI"
                        desc="Market Strength Index scores generated in real-time using proprietary algorithms and current trade volumes."
                    />
                    <FeatureItem 
                        icon={ShieldCheck}
                        title="Verified Shippers"
                        desc="We don't just show names; we verify entities. Every exporter and importer in our system is vetted for authenticity."
                    />
                    <FeatureItem 
                        icon={BarChart3}
                        title="Competitor Radar"
                        desc="Track every move your competitors make. See their shifting supply chain routes and new supplier partnerships as they happen."
                    />
                    <FeatureItem 
                        icon={Users}
                        title="Decision Maker Data"
                        desc="Unlock direct contact information for C-level executives and supply chain managers. Stop guessing, start talking."
                    />
                    <FeatureItem 
                        icon={Database}
                        title="Data Cleansing"
                        desc="Our AI cleanses messy manifest data, resolving company name variations and fixing HS code discrepancies automatically."
                    />
                </div>
            </div>
        </section>
    );
};
