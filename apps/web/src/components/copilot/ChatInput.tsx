import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText, Image as ImageIcon, Grid } from 'lucide-react';
import { Button } from '@tenexim/ui';
import { validateFiles } from '@/hooks/copilot/useCopilot';

interface ChatInputProps {
    onSend: (text: string, files: File[]) => void;
    isThinking: boolean;
    inputValue: string;
    setInputValue: (val: string) => void;
    onDraftFileClick?: (file: File) => void; // Pass draft clicks to active file viewer
}

export default function ChatInput({ onSend, isThinking, inputValue, setInputValue, onDraftFileClick }: ChatInputProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    
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
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 250)}px`;
        }
    };

    // Paste files (Ctrl+V) with strict lockdown verification
    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        const pastedFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                if (file) pastedFiles.push(file);
            }
        }
        if (pastedFiles.length > 0) {
            e.preventDefault();
            const validated = validateFiles(pastedFiles);
            setSelectedFiles(prev => [...prev, ...validated]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
        if (e.type === 'dragleave') setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const validated = validateFiles(Array.from(e.dataTransfer.files));
            setSelectedFiles(prev => [...prev, ...validated]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, idx) => idx !== index));
    };

    const hasContent = inputValue.trim().length > 0 || selectedFiles.length > 0;

    return (
        <div className="w-full max-w-3xl mx-auto relative z-40 group">
            <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`
                    relative bg-white dark:bg-[#1a1a1e] rounded-2xl flex flex-col transition-all duration-300
                    shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)]
                    ${isDragActive 
                        ? 'border-amber-500 ring-1 ring-amber-500/30' 
                        : 'border border-slate-200 dark:border-slate-700/80 focus-within:border-slate-300 dark:focus-within:border-slate-600'}
                `}
            >
                {/* File Previews */}
                {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-4 pt-4 pb-1">
                        {selectedFiles.map((file, index) => (
                            <div 
                                key={index} 
                                onClick={() => onDraftFileClick && onDraftFileClick(file)}
                                className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 bg-slate-50 dark:bg-slate-800/85 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/90 transition-colors"
                            >
                                <FileThumbnail file={file} />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }} 
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Text Input Area */}
                <textarea
                    ref={textAreaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder="Message Trady..."
                    rows={1}
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-[16px] text-slate-850 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-505 resize-none max-h-[250px] leading-relaxed"
                />

                {/* Action Controls */}
                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            accept=".png,.jpg,.jpeg,.webp,.gif,.txt,.pdf,.csv,.xlsx,.xls"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const validated = validateFiles(Array.from(e.target.files));
                                    setSelectedFiles(prev => [...prev, ...validated]);
                                }
                            }} 
                        />
                    </div>

                    <button
                        onClick={handleSendClick}
                        disabled={!hasContent || isThinking}
                        className={`
                            p-2 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer
                            ${hasContent 
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-105' 
                                : 'bg-slate-100 text-slate-450 dark:bg-slate-800/80 dark:text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        <Send className="w-4.5 h-4.5" />
                    </button>
                </div>
            </div>
            
            <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-505 font-medium">
                Sovereign Trade Workspace • Supports Images, TXT, PDF, CSV, Excel.
            </p>
        </div>
    );
}

function FileThumbnail({ file }: { file: File }) {
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setImgUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    if (imgUrl) return <img src={imgUrl} alt="preview" className="w-5 h-5 object-cover rounded" />;
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
    if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        return <Grid className="w-4 h-4 text-teal-500" />;
    }
    return <FileText className="w-4 h-4 text-amber-500" />;
}