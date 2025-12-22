import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, FileText, Copy, ThumbsUp, RotateCcw } from 'lucide-react';

interface MessageItemProps {
    role: 'user' | 'model';
    content: string;
    files?: any[];
    isStreaming?: boolean;
}

export default function MessageItem({ role, content, files, isStreaming }: MessageItemProps) {
    const isUser = role === 'user';

    return (
        <div className={`group flex gap-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up items-start w-full`}>
            {/* Avatar */}
            <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105
                ${isUser ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700' : 'bg-amber-500 text-white shadow-amber-500/20'}
            `}>
                {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>

            {/* Content Bubble */}
            <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                {files && files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                                <FileText className="w-4 h-4 text-amber-500" />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={`
                    w-full px-1 py-1 text-[16px] leading-relaxed
                    ${isUser ? 'text-slate-700 dark:text-slate-200 text-right' : 'text-slate-800 dark:text-slate-100'}
                `}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, ...props }) => <p className={`mb-4 last:mb-0 ${isUser ? 'font-medium' : ''}`} {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li {...props} />,
                            code: ({ node, ...props }) => <code className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-sm font-mono text-amber-600 dark:text-amber-400" {...props} />,
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                    <table className="w-full text-sm border-collapse" {...props} />
                                </div>
                            ),
                            th: ({ node, ...props }) => <th className="border-b border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/50 font-black text-[11px] uppercase tracking-wider text-left text-slate-500" {...props} />,
                            td: ({ node, ...props }) => <td className="border-b border-slate-100 dark:border-slate-800/50 p-3 text-slate-600 dark:text-slate-300" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-black mb-4 font-display" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 font-display" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 font-display" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                    {/* Streaming cursor */}
                    {isStreaming && (
                        <span className="inline-block w-2 h-5 ml-1 bg-amber-500 animate-pulse rounded-sm" />
                    )}
                </div>

                {/* Message Actions - hidden while streaming */}
                {!isUser && content && !isStreaming && (
                    <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Copy className="w-3.5 h-3.5" />} label="Copy" />
                        <ActionButton icon={<ThumbsUp className="w-3.5 h-3.5" />} label="Helpful" />
                        <ActionButton icon={<RotateCcw className="w-3.5 h-3.5" />} label="Regenerate" />
                    </div>
                )}
            </div>
        </div>
    );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors">
            {icon}
            <span>{label}</span>
        </button>
    );
}
