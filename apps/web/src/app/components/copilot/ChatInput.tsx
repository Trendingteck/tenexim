import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, FileText, Mic } from 'lucide-react';
import { Button } from '@tenexim/ui';

interface ChatInputProps {
    onSend: (text: string, files: File[]) => void;
    isThinking: boolean;
    inputValue: string;
    setInputValue: (val: string) => void;
}

export default function ChatInput({ onSend, isThinking, inputValue, setInputValue }: ChatInputProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    const handleSendClick = () => {
        if ((!inputValue.trim() && selectedFiles.length === 0) || isThinking) return;
        onSend(inputValue, selectedFiles);
        setInputValue('');
        setSelectedFiles([]);
        if (textAreaRef.current) textAreaRef.current.style.height = 'auto';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 150)}px`;
        }
    };

    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-40">
            <div className="relative group">
                {/* Subtle Glow Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>

                <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] p-2 pr-4 transition-all duration-300">

                    {/* File Attachment Strip */}
                    {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 mb-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/10 rounded-xl text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-fade-in-up border border-amber-500/20">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="max-w-[120px] truncate">{file.name}</span>
                                    <button onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} className="hover:text-red-500 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        <div className="flex items-center mb-1">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-slate-400 hover:text-amber-500 transition-colors rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => e.target.files && setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])} />

                            <button
                                className="p-3 text-slate-400 hover:text-amber-500 transition-colors rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hidden sm:flex"
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>

                        <textarea
                            ref={textAreaRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Trady..."
                            rows={1}
                            className="flex-1 px-2 py-3.5 bg-transparent outline-none text-[16px] font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none max-h-40"
                        />

                        <div className="mb-1.5">
                            <Button
                                onClick={handleSendClick}
                                disabled={(!inputValue.trim() && selectedFiles.length === 0) || isThinking}
                                className={`
                                    h-11 w-11 rounded-2xl p-0 shadow-lg shrink-0 transition-all duration-300
                                    ${(inputValue.trim() || selectedFiles.length > 0) ? 'bg-amber-500 scale-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 scale-95'}
                                `}
                            >
                                <Send className={`w-5 h-5 ${(inputValue.trim() || selectedFiles.length > 0) ? 'text-white' : 'text-slate-400'}`} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60 pointer-events-none">
                Enterprise Intelligence Engine • v2.5
            </p>
        </div>
    );
}
