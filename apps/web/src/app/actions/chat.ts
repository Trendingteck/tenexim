'use server';

import { revalidatePath } from 'next/cache';
import { prisma, getOrCreateUser } from '@/lib/chat';

// =============================================================================
// CHAT SESSION CRUD OPERATIONS (Server Actions)
// =============================================================================

export async function getChatSessions() {
    try {
        const user = await getOrCreateUser();
        const sessions = await (prisma as any).chatSession.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                title: true,
                isPinned: true,
                updatedAt: true,
            },
            orderBy: [
                { isPinned: 'desc' },
                { updatedAt: 'desc' }
            ],
            take: 50
        });
        return { success: true, sessions };
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        return { success: false, error: 'Failed to fetch sessions' };
    }
}

export async function createChatSession(title: string = 'New Chat') {
    try {
        const user = await getOrCreateUser();
        const session = await (prisma as any).chatSession.create({
            data: {
                title,
                userId: user.id,
            }
        });
        revalidatePath('/dashboard/copilot');
        return { success: true, session };
    } catch (error) {
        console.error('Error creating chat session:', error);
        return { success: false, error: 'Failed to create session' };
    }
}

export async function getSessionMessages(sessionId: string) {
    try {
        const messages = await (prisma as any).chatMessage.findMany({
            where: { sessionId },
            select: {
                id: true,
                role: true,
                content: true,
                files: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' }
        });
        return { success: true, messages };
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { success: false, error: 'Failed to fetch messages' };
    }
}

export async function deleteChatSession(sessionId: string) {
    try {
        await (prisma as any).chatSession.delete({
            where: { id: sessionId }
        });
        revalidatePath('/dashboard/copilot');
        return { success: true };
    } catch (error) {
        console.error('Error deleting session:', error);
        return { success: false, error: 'Failed to delete session' };
    }
}

export async function renameChatSession(sessionId: string, title: string) {
    try {
        await (prisma as any).chatSession.update({
            where: { id: sessionId },
            data: { title }
        });
        revalidatePath('/dashboard/copilot');
        return { success: true };
    } catch (error) {
        console.error('Error renaming session:', error);
        return { success: false, error: 'Failed to rename session' };
    }
}

export async function togglePinSession(sessionId: string, isPinned: boolean) {
    try {
        await (prisma as any).chatSession.update({
            where: { id: sessionId },
            data: { isPinned }
        });
        revalidatePath('/dashboard/copilot');
        return { success: true };
    } catch (error) {
        console.error('Error pinning session:', error);
        return { success: false, error: 'Failed to pin session' };
    }
}
