import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getChatSessions,
  createChatSession,
  getSessionMessages,
  deleteChatSession,
  renameChatSession,
  togglePinSession
} from '@/app/actions/chat';

export interface Message {
  id?: string;
  role: 'user' | 'model';
  content: string;
  files?: any[];
  createdAt?: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  isPinned: boolean;
  updatedAt: Date;
  _count?: {
    messages: number;
  };
}

const SESSION_STORAGE_KEY = 'tenexim_copilot_session';
const SESSIONS_CACHE_KEY = 'tenexim_copilot_sessions_cache';

export function useCopilot() {
  // Initialize with empty state to avoid hydration mismatch
  // localStorage/sessionStorage will be read in useEffect only
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  // Refresh sessions and cache them
  const refreshSessions = useCallback(async () => {
    const res = await getChatSessions();
    if (res.success && res.sessions) {
      setSessions(res.sessions as any);
      // Cache sessions for instant load next time
      try {
        sessionStorage.setItem(SESSIONS_CACHE_KEY, JSON.stringify(res.sessions));
      } catch { }
    }
  }, []);

  // Load everything on mount - runs only once
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initialize = async () => {
      // Step 1: Instantly load from cache for immediate display
      try {
        const cachedSessions = sessionStorage.getItem(SESSIONS_CACHE_KEY);
        if (cachedSessions) {
          setSessions(JSON.parse(cachedSessions));
        }
      } catch { }

      const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSessionId) {
        setCurrentSessionId(savedSessionId);
      }

      // Step 2: Fetch fresh data in parallel
      const promises: Promise<any>[] = [getChatSessions()];
      if (savedSessionId) {
        promises.push(getSessionMessages(savedSessionId));
      }

      const [sessionsRes, messagesRes] = await Promise.all(promises);

      if (sessionsRes.success && sessionsRes.sessions) {
        setSessions(sessionsRes.sessions as any);
        // Update cache
        try {
          sessionStorage.setItem(SESSIONS_CACHE_KEY, JSON.stringify(sessionsRes.sessions));
        } catch { }
      }

      if (savedSessionId && messagesRes?.success && messagesRes.messages) {
        // Verify session still exists
        const sessionExists = sessionsRes.sessions?.some((s: any) => s.id === savedSessionId);
        if (sessionExists) {
          setMessages(messagesRes.messages as any);
        } else {
          // Session was deleted, clear localStorage
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setCurrentSessionId(null);
        }
      }

      setIsLoading(false);
      setIsInitialized(true);
    };

    initialize();
  }, []);

  // Persist currentSessionId to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    if (currentSessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, currentSessionId);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentSessionId, isInitialized]);

  // Load messages when session changes (after initial load)
  useEffect(() => {
    if (!isInitialized) return;

    if (currentSessionId) {
      const loadMessages = async () => {
        const res = await getSessionMessages(currentSessionId);
        if (res.success && res.messages) {
          setMessages(res.messages as any);
        }
      };
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [currentSessionId, isInitialized]);

  const selectSession = useCallback((id: string | null) => {
    setCurrentSessionId(id);
  }, []);

  const createNewChat = useCallback(async (title?: string) => {
    const res = await createChatSession(title);
    if (res.success && res.session) {
      setCurrentSessionId(res.session.id);
      refreshSessions();
      return res.session.id;
    }
    return null;
  }, [refreshSessions]);

  const removeSession = useCallback(async (id: string) => {
    const res = await deleteChatSession(id);
    if (res.success) {
      if (currentSessionId === id) {
        setCurrentSessionId(null);
      }
      refreshSessions();
    }
  }, [currentSessionId, refreshSessions]);

  const renameSession = useCallback(async (id: string, title: string) => {
    const res = await renameChatSession(id, title);
    if (res.success) {
      refreshSessions();
    }
  }, [refreshSessions]);

  const pinSession = useCallback(async (id: string, isPinned: boolean) => {
    const res = await togglePinSession(id, isPinned);
    if (res.success) {
      refreshSessions();
    }
  }, [refreshSessions]);

  const clearChat = useCallback(async () => {
    if (currentSessionId) {
      // Delete the session from the database
      const res = await deleteChatSession(currentSessionId);
      if (res.success) {
        setMessages([]);
        setCurrentSessionId(null);
        refreshSessions();
      }
    } else {
      // Just clear local state if no session is selected
      setMessages([]);
    }
  }, [currentSessionId, refreshSessions]);

  const sendMessage = useCallback(async (content: string, files: File[] = []) => {
    let sessionId = currentSessionId;

    // If no session, create one first
    if (!sessionId) {
      const newTitle = content.slice(0, 40) || 'New Chat';
      sessionId = await createNewChat(newTitle);
    }

    if (!sessionId) return;

    // Prepare files for transfer (base64) with text extraction
    const processedFiles = await Promise.all(files.map(async file => {
      const base64 = await fileToBase64(file);
      let extractedText = '';

      // Extract text based on file type
      if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Text files - read directly
        extractedText = await file.text();
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // PDF files - use server-side extraction
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/chat/parse-pdf', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success && data.text) {
            extractedText = data.text;
          }
        } catch (e) {
          console.error('PDF extraction failed:', e);
        }
      }

      return {
        name: file.name,
        type: file.type,
        size: file.size,
        base64,
        extractedText
      };
    }));

    // Optimistic update - add user message
    const userMsg: Message = { role: 'user', content, files: processedFiles };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    setStreamingContent('');

    try {
      // Use streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content, files: processedFiles })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to AI');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.text) {
                accumulatedContent += data.text;
                setStreamingContent(accumulatedContent);
              }

              if (data.done) {
                // Streaming complete, add final message
                setMessages(prev => [...prev, {
                  role: 'model',
                  content: accumulatedContent,
                  id: data.messageId
                }]);
                setStreamingContent('');
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Error: Could not reach trade intelligence servers." }]);
      setStreamingContent('');
    } finally {
      setIsThinking(false);
      refreshSessions();
    }
  }, [currentSessionId, createNewChat, refreshSessions]);

  return {
    messages,
    sessions,
    currentSessionId,
    isThinking,
    isLoading,
    streamingContent,
    sendMessage,
    clearChat,
    selectSession,
    createNewChat,
    removeSession,
    renameSession,
    pinSession,
    refreshSessions
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}
