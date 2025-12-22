import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// PDF TEXT EXTRACTION API
// Extracts text from PDF files using pdf-parse
// =============================================================================

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();

        // Dynamically import unpdf to avoid issues with client-side bundling
        const { extractText } = await import('unpdf');

        // Extract text from the PDF
        const { text } = await extractText(arrayBuffer);

        return NextResponse.json({
            success: true,
            text: text,
            info: { name: file.name }
        });
    } catch (error: any) {
        console.error('PDF parse error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to parse PDF'
        }, { status: 500 });
    }
}
