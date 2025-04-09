import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { extractTextFromPdf } from '@/lib/pdfUtils';
import { db } from '@/lib/db';
import { extractCvData } from '@/lib/cvDataExtractor';

/**
 * This endpoint processes a CV file that has already been uploaded
 * and extracts structured data from it.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (!['pdf', 'doc', 'docx'].includes(fileType || '')) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Only PDF, DOC, and DOCX files are supported.',
        },
        { status: 400 },
      );
    }

    // Extract text content based on file type
    let textContent = '';

    if (fileType === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      textContent = await extractTextFromPdf(buffer);
    } else {
      // For doc/docx we'd need a different extraction method
      // This is a placeholder for now
      return NextResponse.json(
        { error: 'DOC/DOCX extraction not yet implemented' },
        { status: 501 },
      );
    }

    // Extract structured data from text
    const extractedData = await extractCvData(textContent);

    // Store the extracted data in database (optional)
    // This would typically be associated with the user and the uploaded CV

    return NextResponse.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error('Error processing CV extraction:', error);
    return NextResponse.json(
      { error: 'Failed to process CV' },
      { status: 500 },
    );
  }
}
