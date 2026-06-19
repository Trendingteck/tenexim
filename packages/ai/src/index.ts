import { GoogleGenAI } from "@google/genai";
import { AI_MODEL, SYSTEM_INSTRUCTION } from "./prompts";

export interface AIModelResponse {
    text: string;
    completed: boolean;
}

export interface AttachmentPayload {
    name: string;
    type: string;
    size: number;
    extractedText?: string;
    base64?: string;
}

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
});

export function formatChatHistory(messages: any[]) {
    return messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
    }));
}

export async function generateChatStream(
    content: string,
    messageHistory: any[],
    files: AttachmentPayload[] = []
): Promise<AsyncIterable<string>> {
    // Build file context with clear structure for the AI
    let fileContext = "";
    if (files.length > 0) {
        fileContext = "\n\n---\n📎 **ATTACHED FILES:**\n";
        for (const file of files) {
            const sizeKB = file.size ? Math.round(file.size / 1024) : 'unknown';
            fileContext += `\n**File: ${file.name}** (${file.type || 'unknown type'}, ${sizeKB}KB)\n`;

            if (file.extractedText) {
                // Limit text to prevent token overflow
                const maxChars = 15000;
                const text = file.extractedText.length > maxChars
                    ? file.extractedText.substring(0, maxChars) + '\n...[truncated]'
                    : file.extractedText;
                fileContext += `\`\`\`\n${text}\n\`\`\`\n`;
            } else if (file.type?.startsWith('image/')) {
                fileContext += `[Image attached - visible to AI]\n`;
            } else {
                fileContext += `[File attached but text extraction not available]\n`;
            }
        }
        fileContext += "---\n";
    }

    // Format historical messages for Gemini context
    // Excluding the very last message in history which is user's current query
    const chat = genAI.chats.create({
        model: AI_MODEL,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: formatChatHistory(messageHistory.slice(0, -1)),
    });

    // Prepare parts for the current message
    const parts: any[] = [];

    // Add image files as inline data
    for (const file of files) {
        if (file.type?.startsWith('image/') && file.base64) {
            parts.push({
                inlineData: {
                    data: file.base64,
                    mimeType: file.type
                }
            });
        }
    }

    // Add the user's message with file context
    const fullPrompt = files.length > 0
        ? `${content}${fileContext}\n\nPlease analyze the above file(s) in relation to my question.`
        : content;
    parts.push({ text: fullPrompt });

    // Send and return text chunk stream
    const responseStream = await chat.sendMessageStream({ message: parts });

    async function* yieldTextChunks() {
        for await (const chunk of responseStream) {
            yield chunk.text || '';
        }
    }

    return yieldTextChunks();
}