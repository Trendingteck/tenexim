import React from 'react';
import { Sparkles, Database, Terminal, Globe, Search } from 'lucide-react';

interface WelcomeScreenProps {
    onSuggestionClick: (text: string) => void;
}

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in-up">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-amber-500/20 shadow-2xl relative">
                    <Sparkles className="w-20 h-20 text-amber-500" />
                </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 text-center font-display">
                Your AI Trade Assistant
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 text-center max-w-lg text-lg font-medium leading-relaxed">
                Ask anything about global trade, market trends, or specific shipment details. I have access to 2B+ records in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
                <SuggestionCard
                    icon={<Database className="w-5 h-5 text-amber-500" />}
                    label="Analyze Coffee imports from Brazil"
                    onClick={() => onSuggestionClick("Analyze Coffee imports from Brazil over the last 6 months")}
                />
                <SuggestionCard
                    icon={<Terminal className="w-5 h-5 text-blue-500" />}
                    label="Find trending HS Codes in USA"
                    onClick={() => onSuggestionClick("What are the currently trending HS Codes for imports into the USA?")}
                />
                <SuggestionCard
                    icon={<Globe className="w-5 h-5 text-emerald-500" />}
                    label="Competitor movement in Vietnam"
                    onClick={() => onSuggestionClick("Show me recent shipment movements for tech companies in Vietnam")}
                />
                <SuggestionCard
                    icon={<Search className="w-5 h-5 text-purple-500" />}
                    label="Export growth of Green Energy"
                    onClick={() => onSuggestionClick("Analyze export growth of solar panel components from China")}
                />
            </div>
        </div>
    );
}

function SuggestionCard({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-amber-500 transition-all group flex items-start space-x-4 shadow-sm"
        >
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors shrink-0">
                {icon}
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-tight">{label}</span>
        </button>
    );
}
