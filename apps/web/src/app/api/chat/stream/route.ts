import { NextRequest } from 'next/server';
import { prisma, genAI, AI_MODEL, SYSTEM_INSTRUCTION, formatChatHistory } from '@/lib/chat';

// =============================================================================
// STREAMING CHAT API ROUTE
// Handles real-time AI responses via Server-Sent Events
// =============================================================================

export async function POST(request: NextRequest) {
    try {
        const { sessionId, content, files = [] } = await request.json();

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

        // Save user message
        await (prisma as any).chatMessage.create({
            data: {
                sessionId,
                role: 'user',
                content: content + (files.length > 0 ? `\n\n[${files.length} file(s) attached]` : ""),
                files: files.length > 0 ? files.map((f: any) => ({ name: f.name, type: f.type, size: f.size })) : undefined
            }
        });

        // Get history for context
        const history = await (prisma as any).chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            take: 20
        });

        // Prepare Gemini chat with streaming
        const chat = genAI.chats.create({
            model: AI_MODEL,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
            history: formatChatHistory(history.slice(0, -1)),
        });

        // Prepare parts for the current message
        const parts: any[] = [];

        // Add image files as inline data (Gemini can see these)
        for (const file of files) {
            if (file.type?.startsWith('image/')) {
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

        // Create a streaming response using Server-Sent Events
        const encoder = new TextEncoder();
        let fullResponse = '';

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const response = await chat.sendMessageStream({ message: parts });

                    for await (const chunk of response) {
                        const text = chunk.text || '';
                        if (text) {
                            fullResponse += text;
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text, done: false })}\n\n`)
                            );
                        }
                    }

                    // Save the complete AI message
                    const aiMessage = await (prisma as any).chatMessage.create({
                        data: {
                            sessionId,
                            role: 'model',
                            content: fullResponse
                        }
                    });

                    // Update session timestamp
                    await (prisma as any).chatSession.update({
                        where: { id: sessionId },
                        data: { updatedAt: new Date() }
                    });

                    // Send done signal
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ done: true, messageId: aiMessage.id })}\n\n`)
                    );
                    controller.close();
                } catch (error: any) {
                    console.error('Streaming error:', error);
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`)
                    );
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('Chat stream error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
