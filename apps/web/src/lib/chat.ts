import { PrismaClient } from '@tenexim/database';
import { GoogleGenAI } from "@google/genai";

// =============================================================================
// SHARED DATABASE & AI CONFIGURATION
// This file contains all shared utilities for the chat system to avoid duplication
// =============================================================================

// Global Prisma instance (singleton pattern for Next.js)
const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
    cachedUser: any;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Google Generative AI instance
export const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
});

// AI Model configuration
export const AI_MODEL = 'gemini-2.5-flash';

// System instruction for the AI
export const SYSTEM_INSTRUCTION = `
You are Trady, an expert Trade Intelligence Partner.

**Your Goal:**
Provide immediate, high-value answers. Be an expert in HS codes, ports, and logistics, but communicate naturally.

**Operational Rules:**
- Be Concise by Default: Answer the specific question directly.
- Dynamic Depth: Provide detailed breakdowns only when asked for "Analysis".
- Data Formatting: Use Markdown tables for data rows. Use bullet points for lists.
- Proactive Help: Briefly suggest a relevant next step only if it adds immediate value.

**Persona:**
You are professional, warm, and adaptive. You simply solve the problem.
`;

// Cached user getter (avoids repeated DB calls)
export async function getOrCreateUser() {
    // Return cached user if available
    if (globalForPrisma.cachedUser) {
        return globalForPrisma.cachedUser;
    }

    // Get or create the demo user
    let user = await prisma.user.findFirst({
        where: { email: 'demo@client.com' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@client.com',
                name: 'Demo Client',
                passwordHash: 'mock',
            }
        });
    }

    // Cache for future calls
    globalForPrisma.cachedUser = user;
    return user;
}

// Helper to prepare chat history for Gemini
export function formatChatHistory(messages: any[]) {
    return messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
    }));
}
