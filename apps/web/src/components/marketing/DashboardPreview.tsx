
import React from 'react';
import { Play, Activity, Globe, Zap, Database } from 'lucide-react';

export const DashboardPreview: React.FC = () => {
    return (
        <div className="relative max-w-5xl mx-auto group perspective-1000">
            {/* Background Glows */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand-500/20 transition-all"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>

            <div className="relative bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] border border-slate-800 p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transform-gpu rotate-x-2 transition-transform duration-700 group-hover:rotate-x-0 group-hover:scale-[1.01]">
                {/* Internal UI Frame */}
                <div className="bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 aspect-[16/9] relative">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=2070" 
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
                        alt="Trade Intelligence Dashboard" 
                    />
                    
                    {/* Overlay UI Elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center shadow-2xl shadow-brand-500/50 cursor-pointer hover:scale-110 active:scale-95 transition-all group/play z-20">
                            <Play className="text-white w-8 h-8 fill-current ml-1" />
                        </div>
                    </div>

                    {/* Floating Data Widgets */}
                    <div className="absolute top-10 left-10 p-5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl animate-in slide-in-from-left-4 duration-1000">
                        <div className="flex items-center gap-3 mb-3">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Flow</span>
                        </div>
                        <div className="h-10 w-32 bg-slate-800 rounded-lg flex items-end gap-1 p-2">
                            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500/50 rounded-sm" style={{ height: `${h * 100}%` }}></div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 p-5 bg-brand-600 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 duration-1000 delay-300">
                        <div className="flex items-center gap-3 mb-2">
                            <Database className="w-4 h-4 text-white/60" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Scan</span>
                        </div>
                        <div className="text-xl font-black text-white font-display">2,148,204,912</div>
                        <div className="text-[9px] font-bold text-white/60 uppercase tracking-tighter mt-1">Verified Shipment Manifests</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
