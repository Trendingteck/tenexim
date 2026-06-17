import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { User, Sparkles, FileText, Copy, Check, ThumbsUp, RotateCcw } from 'lucide-react';

interface MessageItemProps {
    role: 'user' | 'model';
    content: string;
    files?: any[];
    isStreaming?: boolean;
    onFileClick?: (file: any) => void; // Trigger callback when historical file badges are clicked
}

export default function MessageItem({ role, content, files, isStreaming, onFileClick }: MessageItemProps) {
    const isUser = role === 'user';

    return (
        <div className={`group flex gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up items-start w-full`}>
            {/* Direct CDN inject to bypass TurboPack module resolution error on build */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" 
                crossOrigin="anonymous" 
            />

            <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                ${isUser ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700' : 'bg-amber-500 text-white shadow-amber-500/20'}
            `}>
                {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>

            <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                {files && files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {files.map((file, index) => (
                            <div 
                                key={index} 
                                onClick={() => onFileClick && onFileClick(file)}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                            >
                                <FileText className="w-4 h-4 text-amber-500" />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={`
                    w-full text-[16px] leading-relaxed text-slate-800 dark:text-slate-100
                    ${isUser ? 'text-slate-700 dark:text-slate-200 text-right' : ''}
                `}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            p: ({ node, ...props }) => <p className={`mb-4 last:mb-0 ${isUser ? 'font-medium' : ''}`} {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li {...props} />,
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                    <table className="w-full text-sm border-collapse" {...props} />
                                </div>
                            ),
                            th: ({ node, ...props }) => <th className="border-b border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/50 font-bold text-xs uppercase tracking-wider text-left text-slate-500" {...props} />,
                            td: ({ node, ...props }) => <td className="border-b border-slate-100 dark:border-slate-800/50 p-3 text-slate-700 dark:text-slate-300" {...props} />,
                            
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeContent = String(children).replace(/\n$/, '');
                                const isInline = !className;

                                if (isInline) {
                                    return (
                                        <code className="bg-slate-100 dark:bg-slate-800 rounded-md px-1.5 py-0.5 text-[14px] font-mono text-amber-600 dark:text-amber-400" {...props}>
                                            {children}
                                        </code>
                                    );
                                }

                                return (
                                    <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm my-4 font-mono text-sm w-full">
                                        <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                            <span className="text-xs font-bold text-slate-550 dark:text-slate-400">
                                                {match ? match[1] : 'code'}
                                            </span>
                                            <CopyButton text={codeContent} />
                                        </div>
                                        <div className="overflow-x-auto p-4 bg-slate-50/50 dark:bg-[#131316]">
                                            <pre className="text-slate-800 dark:text-slate-200 whitespace-pre">
                                                <code>{codeContent}</code>
                                            </pre>
                                        </div>
                                    </div>
                                );
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                    
                    {isStreaming && (
                        <span className="inline-block w-2 h-5 ml-1 align-middle bg-amber-500 animate-pulse rounded-sm" />
                    )}
                </div>

                {!isUser && content && !isStreaming && (
                    <div className="mt-2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Copy className="w-4 h-4" />} onClick={() => navigator.clipboard.writeText(content)} />
                        <ActionButton icon={<ThumbsUp className="w-4 h-4" />} />
                        <ActionButton icon={<RotateCcw className="w-4 h-4" />} />
                    </div>
                )}
            </div>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {}
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 rounded-md transition-colors"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? <span className="text-emerald-500">Copied</span> : <span>Copy</span>}
        </button>
    );
}

function ActionButton({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
        >
            {icon}
        </button>
    );
}