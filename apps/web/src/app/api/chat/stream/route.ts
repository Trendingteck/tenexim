import { NextRequest } from 'next/server';
import { generateChatStream } from '@tenexim/ai';
import { prisma } from '@tenexim/database';

export async function POST(request: NextRequest) {
    try {
        const { sessionId, content, files = [] } = await request.json();

        if (!sessionId) {
            return Response.json({ error: 'Missing sessionId parameter' }, { status: 400 });
        }

        // 1. Verify that the session actually exists in PostgreSQL before writing messages
        const sessionExists = await prisma.chatSession.findUnique({
            where: { id: sessionId }
        });
        
        if (!sessionExists) {
            return Response.json({ 
                error: `Foreign key validation failed: Session with ID ${sessionId} does not exist.` 
            }, { status: 400 });
        }

        // 2. Commit the user content securely to PostgreSQL first
        await prisma.chatMessage.create({
            data: {
                sessionId,
                role: 'user',
                content: content,
                files: files.length ? files : undefined
            }
        });

        // 3. Resolve historical context (this now safely includes the user message we just created)
        const messageHistory = await prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            take: 20
        });

        const encoder = new TextEncoder();
        
        // 4. Initiate response generation using standard Server-Sent Events (SSE)
        const stream = new ReadableStream({
            async start(controller) {
                let completeText = '';
                try {
                    const aiStream = await generateChatStream(content, messageHistory, files);
                    
                    for await (const chunk of aiStream) {
                        completeText += chunk;
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ text: chunk, done: false })}\n\n`)
                        );
                    }

                    // 5. Save the final model response to the persistent ledger
                    const aiMessage = await prisma.chatMessage.create({
                        data: {
                            sessionId,
                            role: 'model',
                            content: completeText
                        }
                    });

                    // 6. Bump update timestamp on the active session
                    await prisma.chatSession.update({
                        where: { id: sessionId },
                        data: { updatedAt: new Date() }
                    });

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ done: true, messageId: aiMessage.id })}\n\n`)
                    );
                    controller.close();
                } catch (streamError: any) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: streamError.message, done: true })}\n\n`)
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
        return Response.json({ error: error.message }, { status: 500 });
    }
}