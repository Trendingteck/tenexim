import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    getChatSessions, 
    createChatSession, 
    getSessionMessages, 
    deleteChatSession, 
    renameChatSession, 
    togglePinSession 
} from '@/actions/chat';

export interface Message {
    role: 'user' | 'model';
    content: string;
    files?: {
        name: string;
        type: string;
        size: number;
        extractedText?: string;
        base64?: string;
    }[];
}

// 1. Unified security validations specifying only images, txt, pdf, csv, and excel documents
const ALLOWED_TYPES = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'text/plain', 'application/pdf',
    'text/csv', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.txt', '.pdf', '.csv', '.xlsx', '.xls'];

export const validateFiles = (files: File[]): File[] => {
    return files.filter(file => {
        const fileType = file.type;
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        
        const isAllowedType = ALLOWED_TYPES.includes(fileType);
        const isAllowedExtension = ALLOWED_EXTENSIONS.includes(fileExtension);
        
        if (isAllowedType || isAllowedExtension) {
            return true;
        } else {
            alert(`File type not allowed: ${file.name}. Only images, txt, pdf, csv, and excel files are supported.`);
            return false;
        }
    });
};

export function useCopilot() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlId = searchParams.get('id');

    const [sessions, setSessions] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(urlId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(!!urlId);

    // Dynamic right side file preview panel state
    const [activeFile, setActiveFile] = useState<any | null>(null);

    // Track loaded session ID to prevent redundant loading transitions
    const loadedSessionIdRef = useRef<string | null>(null);

    const fetchSessions = useCallback(async () => {
        try {
            const res = await getChatSessions();
            if (res.success && res.sessions) {
                setSessions(res.sessions);
            }
        } catch (error) {
            console.error('Error fetching chat sessions:', error);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const loadMessages = useCallback(async (sessionId: string) => {
        if (loadedSessionIdRef.current === sessionId) return;
        
        setIsLoadingMessages(true);
        setMessages([]);
        setStreamingContent('');
        
        try {
            const res = await getSessionMessages(sessionId);
            if (res.success && res.messages) {
                const mappedMessages: Message[] = res.messages.map((m: any) => ({
                    role: m.role as 'user' | 'model',
                    content: m.content,
                    files: m.files ? (m.files as any[]) : []
                }));
                setMessages(mappedMessages);
                loadedSessionIdRef.current = sessionId;
            }
        } catch (error) {
            console.error('Error loading session messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        if (urlId) {
            setCurrentSessionId(urlId);
            loadMessages(urlId);
        } else {
            setCurrentSessionId(null);
            setMessages([]);
            setStreamingContent('');
            loadedSessionIdRef.current = null;
            setIsLoadingMessages(false);
            setActiveFile(null);
        }
    }, [urlId, loadMessages]);

    const selectSession = useCallback((sessionId: string) => {
        router.replace(`/dashboard/copilot?id=${sessionId}`);
    }, [router]);

    const createNewChat = useCallback(() => {
        router.replace('/dashboard/copilot');
    }, [router]);

    const removeSession = useCallback(async (sessionId: string) => {
        try {
            const res = await deleteChatSession(sessionId);
            if (res.success) {
                if (currentSessionId === sessionId) {
                    createNewChat();
                }
                await fetchSessions();
            }
        } catch (error) {
            console.error('Error deleting chat session:', error);
        }
    }, [currentSessionId, createNewChat, fetchSessions]);

    const renameSession = useCallback(async (sessionId: string, title: string) => {
        try {
            const res = await renameChatSession(sessionId, title);
            if (res.success) {
                await fetchSessions();
            }
        } catch (error) {
            console.error('Error renaming chat session:', error);
        }
    }, [fetchSessions]);

    const pinSession = useCallback(async (sessionId: string, isPinned: boolean) => {
        try {
            const res = await togglePinSession(sessionId, isPinned);
            if (res.success) {
                await fetchSessions();
            }
        } catch (error) {
            console.error('Error toggling pin status:', error);
        }
    }, [fetchSessions]);

    const clearChat = useCallback(async () => {
        if (!currentSessionId) return;
        await removeSession(currentSessionId);
    }, [currentSessionId, removeSession]);

    const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const processFiles = async (files: File[]) => {
        const processed = [];
        for (const file of files) {
            if (file.type === 'application/pdf') {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/chat/parse-pdf', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    processed.push({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        extractedText: data.success ? data.text : undefined
                    });
                } catch (err) {
                    console.error('Failed to parse PDF document:', err);
                    processed.push({ name: file.name, type: file.type, size: file.size });
                }
            } else if (file.type.startsWith('image/')) {
                try {
                    const dataUrl = await toBase64(file);
                    const rawBase64 = dataUrl.split(',')[1];
                    processed.push({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        base64: rawBase64
                    });
                } catch (err) {
                    console.error('Failed to convert image to base64:', err);
                    processed.push({ name: file.name, type: file.type, size: file.size });
                }
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.type === 'text/csv' || file.name.endsWith('.csv')) {
                try {
                    // Extract text contents to save in context database
                    const text = await new Promise<string>((resolve, reject) => {
                        const r = new FileReader();
                        r.onload = () => resolve(r.result as string);
                        r.onerror = reject;
                        r.readAsText(file);
                    });
                    processed.push({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        extractedText: text
                    });
                } catch (err) {
                    processed.push({ name: file.name, type: file.type, size: file.size });
                }
            } else {
                processed.push({ name: file.name, type: file.type, size: file.size });
            }
        }
        return processed;
    };

    const sendMessage = async (content: string, rawFiles: File[] = []) => {
        if (!content.trim() && rawFiles.length === 0) return;
        setIsThinking(true);
        setStreamingContent('');

        try {
            const processedFiles = await processFiles(rawFiles);
            let sessionId = currentSessionId;

            if (!sessionId) {
                const title = content.trim().slice(0, 35) || 'New Chat';
                const res = await createChatSession(title);
                if (res.success && res.session) {
                    sessionId = res.session.id;
                    loadedSessionIdRef.current = sessionId;
                    setCurrentSessionId(sessionId);
                    router.replace(`/dashboard/copilot?id=${sessionId}`);
                    await fetchSessions();
                } else {
                    throw new Error(res.error || 'Could not instantiate database session context');
                }
            }

            const userMsg: Message = {
                role: 'user',
                content,
                files: processedFiles
            };
            setMessages(prev => [...prev, userMsg]);

            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    content,
                    files: processedFiles
                })
            });

            if (!response.ok) {
                throw new Error('Streaming transaction returned a failure code');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('ReadableStream processing is unsupported');

            const decoder = new TextDecoder();
            let accumulatedResponse = '';
            let lineBuffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                lineBuffer += decoder.decode(value, { stream: true });
                const lines = lineBuffer.split('\n');
                lineBuffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;

                    if (trimmedLine.startsWith('data: ')) {
                        const jsonStr = trimmedLine.slice(6).trim();
                        try {
                            const parsed = JSON.parse(jsonStr);
                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }
                            if (parsed.done) {
                                setMessages(prev => [...prev, { role: 'model', content: accumulatedResponse }]);
                                setStreamingContent('');
                                break;
                            }
                            if (parsed.text) {
                                accumulatedResponse += parsed.text;
                                setStreamingContent(accumulatedResponse);
                            }
                        } catch (err) {
                            console.error('Error parsing streaming line:', err, 'Context:', trimmedLine);
                        }
                    }
                }
            }

            await fetchSessions();

        } catch (error) {
            console.error('Stream processing encountered an exception:', error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                content: '⚠️ An error occurred while generating the response. Please check server logs.' 
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    return {
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
    };
}