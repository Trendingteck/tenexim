"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import {
    Sparkles,
    ChevronLeft,
    Search,
    X,
    MessageSquarePlus,
    Trash2,
    History,
    ChevronRight,
    Zap,
    ChevronsLeft,
    MoreHorizontal,
    Pencil,
    Trash,
    Pin,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/copilot/WelcomeScreen';
import MessageItem from '@/components/copilot/MessageItem';
import ChatInput from '@/components/copilot/ChatInput';
import FileViewerPanel from '@/components/copilot/FileViewerPanel';
import ImageLightbox from '@/components/copilot/ImageLightbox';
import { useCopilot, Message } from '@/hooks/copilot/useCopilot';
import { Button } from '@tenexim/ui';

function CopilotContent() {
    const {
        messages,
        sessions,
        currentSessionId,
        isThinking,
        streamingContent,
        sendMessage,
        clearChat,
        selectSession,
        createNewChat,
        removeSession,
        renameSession,
        pinSession,
        isLoadingMessages,
        activeFile,
        setActiveFile
    } = useCopilot();

    const [inputValue, setInputValue] = useState('');
    const [sidepanelOpen, setSidepanelOpen] = useState(true);
    const [historySearch, setHistorySearch] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking, streamingContent]);

    const handleNewChat = () => {
        createNewChat();
        setInputValue('');
    };

    const handleRename = (id: string, currentTitle: string) => {
        setEditingSessionId(id);
        setEditTitle(currentTitle);
        setActiveMenuId(null);
    };

    const submitRename = async (id: string) => {
        if (editTitle.trim()) {
            await renameSession(id, editTitle);
        }
        setEditingSessionId(null);
    };

    // Group sessions by month
    const groupedSessions = sessions.reduce((acc: any, session) => {
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(session.updatedAt));
        if (!acc[month]) acc[month] = [];
        acc[month].push(session);
        return acc;
    }, {});

    const filteredMonths = Object.keys(groupedSessions).filter(month =>
        groupedSessions[month].some((s: any) => s.title.toLowerCase().includes(historySearch.toLowerCase()))
    );

    const handleClearChat = () => {
        if (messages.length === 0 && !currentSessionId) return;
        setShowClearConfirm(true);
    };

    const confirmClearChat = () => {
        clearChat();
        setShowClearConfirm(false);
    };

    // Image Detection Logic
    const isActiveFileImage = activeFile && (
        (activeFile instanceof File && activeFile.type.startsWith('image/')) ||
        (activeFile.type && activeFile.type.startsWith('image/')) ||
        (activeFile.base64 !== undefined)
    );

    return (
        <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex animate-in fade-in duration-300 overflow-hidden">

            {/* LIGHTBOX OVERLAY FOR IMAGES */}
            {isActiveFileImage && (
                <ImageLightbox file={activeFile} onClose={() => setActiveFile(null)} />
            )}

            {/* Clear Chat Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowClearConfirm(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 p-6 w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-7 h-7 text-amber-500" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Delete This Chat?</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                This will <span className="text-red-400 font-semibold">permanently delete</span> the current conversation including all messages and attached files. This action cannot be undone.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition-all border border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClearChat}
                                className="flex-1 h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* COLLAPSIBLE SIDEPANEL */}
            <aside
                className={`
                    flex flex-col h-full bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out relative group/sidebar shrink-0
                    ${sidepanelOpen ? 'w-[300px]' : 'w-16 cursor-w-resize'}
                `}
                onClick={() => !sidepanelOpen && setSidepanelOpen(true)}
            >
                {/* Logo Area */}
                <div className={`flex items-center h-20 px-4 border-b border-slate-900 ${sidepanelOpen ? 'justify-between' : 'justify-center'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {sidepanelOpen && <span className="text-lg font-black text-white font-display tracking-tight">Trady</span>}
                    </div>
                    {sidepanelOpen && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setSidepanelOpen(false); }}
                            className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Sidebar Actions & History */}
                {sidepanelOpen ? (
                    <div className="flex-1 flex flex-col p-3 space-y-4 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-3.5 h-3.5" />
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                className="w-full h-9 pl-9 pr-3 bg-slate-900 border border-slate-800 rounded-md text-[13px] text-white placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleNewChat}
                                className="flex items-center justify-center gap-2 h-9 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-amber-600/10 cursor-pointer"
                            >
                                <MessageSquarePlus className="w-3.5 h-3.5" />
                                New
                            </button>
                            <button
                                onClick={handleClearChat}
                                className="flex items-center justify-center gap-2 h-9 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md font-bold text-[11px] uppercase tracking-wider transition-all border border-slate-800 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Clear
                            </button>
                        </div>

                        {/* History Scroll Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-6 pb-6 mt-2 text-slate-400">
                            {filteredMonths.length > 0 ? filteredMonths.map((month) => (
                                <div key={month} className="space-y-1.5">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 mb-1">{month}</h3>
                                    <div className="space-y-0.5">
                                        {groupedSessions[month].filter((s: any) => s.title.toLowerCase().includes(historySearch.toLowerCase())).map((item: any) => (
                                            <div key={item.id} className="group relative">
                                                {editingSessionId === item.id ? (
                                                    <input
                                                        autoFocus
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        onBlur={() => submitRename(item.id)}
                                                        onKeyDown={(e) => e.key === 'Enter' && submitRename(item.id)}
                                                        className="w-full bg-slate-800 text-[13px] text-white px-3 py-1.5 rounded-md outline-none border border-amber-500/50"
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => selectSession(item.id)}
                                                        className={`
                                                            w-full text-left py-1.5 px-3 rounded-md transition-colors flex items-center justify-between cursor-pointer
                                                            ${currentSessionId === item.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'}
                                                            ${item.isPinned ? 'border-l-2 border-amber-500' : ''}
                                                        `}
                                                    >
                                                        <span className="text-[13px] font-medium truncate pr-4">
                                                            {item.title}
                                                        </span>
                                                        {item.isPinned && <Pin className="w-2.5 h-2.5 text-amber-500 shrink-0 group-hover:opacity-0" />}
                                                    </button>
                                                )}

                                                {/* History Item Menu Trigger */}
                                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                                        }}
                                                        className="p-1 hover:bg-slate-800 rounded-md text-slate-500 hover:text-white transition-colors cursor-pointer"
                                                    >
                                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Actual Dropdown Menu */}
                                                {activeMenuId === item.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-36 bg-slate-900 border border-slate-800 rounded-md shadow-2xl z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                                                        <MenuButton
                                                            icon={<Pencil className="w-3 h-3" />}
                                                            label="Rename"
                                                            onClick={() => handleRename(item.id, item.title)}
                                                        />
                                                        <MenuButton
                                                            icon={<Pin className={`w-3 h-3 ${item.isPinned ? 'text-amber-500' : ''}`} />}
                                                            label={item.isPinned ? "Unpin" : "Pin"}
                                                            onClick={() => { pinSession(item.id, !item.isPinned); setActiveMenuId(null); }}
                                                        />
                                                        <div className="h-[1px] bg-slate-800 my-1" />
                                                        <MenuButton
                                                            icon={<Trash className="w-3 h-3 text-red-500" />}
                                                            label="Delete"
                                                            onClick={() => { removeSession(item.id); setActiveMenuId(null); }}
                                                            danger
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-[10px] uppercase font-bold text-slate-700 tracking-widest">No history yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center py-6 space-y-6">
                        <button onClick={handleNewChat} className="p-2 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer">
                            <MessageSquarePlus className="w-5 h-5" />
                        </button>
                        <button onClick={() => setSidepanelOpen(true)} className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
                            <History className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Footer Sidebar */}
                <div className={`p-3 border-t border-slate-900 ${sidepanelOpen ? '' : 'items-center'} flex flex-col gap-3`}>
                    {sidepanelOpen ? (
                        <div className="flex items-center justify-between p-2 bg-slate-900 rounded-md border border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-slate-800 overflow-hidden border border-slate-700" />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-white">Upgrade</span>
                                    <span className="text-[9px] text-slate-500">Free Tier</span>
                                </div>
                            </div>
                            <Button size="sm" variant="brand" className="h-6 px-3 rounded-full text-[9px] cursor-pointer">Plan</Button>
                        </div>
                    ) : (
                        <button onClick={() => setSidepanelOpen(true)} className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </aside>

            {/* DUAL-PANE COHESIVE FLEX container */}
            <div className="flex-1 flex min-w-0 bg-slate-50 dark:bg-slate-950">
                
                {/* CHAT THREAD WORKSPACE (LEFT) */}
                <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-all duration-300 min-w-0 ${activeFile && !isActiveFileImage ? 'w-[55%] border-r border-slate-200 dark:border-slate-800' : 'w-full'}`}>
                    {/* LAB HEADER */}
                    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => router.push('/dashboard/overview')}
                                className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2 font-black text-[9px] uppercase tracking-widest cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Exit Lab
                            </button>
                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Global Intelligence Workspace</span>
                                </div>
                                <h1 className="text-sm font-black text-slate-900 dark:text-white leading-tight uppercase font-display">
                                    {messages.length > 0 ? 'Analysis Active' : 'New Investigation'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400">Tokens: 4.8k</span>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/30 dark:bg-slate-950/20">
                        {/* Visual Background Accent */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none opacity-40"></div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pt-10 pb-40">
                            <div className={`mx-auto w-full px-8 transition-all duration-300 ${activeFile && !isActiveFileImage ? 'max-w-3xl' : 'max-w-4xl'}`}>
                                {isLoadingMessages ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                                        <p className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest">
                                            Syncing secure ledger...
                                        </p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <WelcomeScreen onSuggestionClick={(text: string) => setInputValue(text)} />
                                ) : (
                                    <div className="space-y-6">
                                        {messages.map((msg: Message, idx: number) => (
                                            <MessageItem 
                                                key={idx} 
                                                role={msg.role} 
                                                content={msg.content} 
                                                files={msg.files} 
                                                onFileClick={setActiveFile}
                                            />
                                        ))}

                                        {/* Streaming Response */}
                                        {streamingContent && (
                                            <MessageItem role="model" content={streamingContent} isStreaming />
                                        )}

                                        {/* Minimal Thinking Indicator */}
                                        {isThinking && !streamingContent && (
                                            <div className="flex items-center gap-3 animate-in fade-in duration-200">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INPUT BOX - Properly spaced from the bottom edge */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-5 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 dark:via-slate-950/90 to-transparent pointer-events-none">
                            <div className="pointer-events-auto">
                                <ChatInput
                                    onSend={sendMessage}
                                    isThinking={isThinking}
                                    inputValue={inputValue}
                                    setInputValue={setInputValue}
                                    onDraftFileClick={setActiveFile}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SPECIALIZED FILE AUDITING WORKSPACE (RIGHT SPLIT PANEL) - Only renders for documents/CSVs */}
                {activeFile && !isActiveFileImage && (
                    <div className="w-[45%] h-full shrink-0">
                        <FileViewerPanel 
                            file={activeFile} 
                            onClose={() => setActiveFile(null)} 
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

function MenuButton({ icon, label, onClick, danger }: { icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean }) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`
                w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer
                ${danger ? 'text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
        >
            {icon}
            {label}
        </button>
    );
}

export default function CopilotPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Initializing Copilot Node...</span>
                </div>
            </div>
        }>
            <CopilotContent />
        </Suspense>
    );
}