import { NextRequest, NextResponse } from 'next/server';
import { extractCVContent } from '@/lib/cv/cvExtractor';
import { createCVData } from '@/lib/db/queries';
import { getUser } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.google-apps.document', // Google Doc
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Only Word documents and Google Docs are supported.',
        },
        { status: 400 },
      );
    }

    // Extract content from the CV
    console.log(`Extracting content from CV file: ${file.name}`);
    const extractedData = await extractCVContent(file, user.id);
    console.log(
      `Successfully extracted CV content, file ID: ${extractedData.id}`,
    );

    // Ensure the rawContent doesn't have NULL bytes or other problematic characters
    // This is a safety check in case the sanitization in extractCVContent missed something
    const rawContent = extractedData.content.rawContent.replace(/\0/g, '');

    try {
      // Store in database
      console.log(`Attempting to store CV data in database`);
      const dbEntry = await createCVData({
        originalFilename: file.name,
        fileId: extractedData.id,
        userId: user.id,
        fileType: file.type,
        content: extractedData.content as any, // Type cast for JSON data
        rawContent: rawContent,
      });

      if (!dbEntry) {
        console.error('Failed to store CV data - createCVData returned null');
        return NextResponse.json(
          { error: 'Failed to store CV data in database' },
          { status: 500 },
        );
      }

      console.log(`Successfully stored CV data, DB ID: ${dbEntry.id}`);

      // Return success with the processed data
      return NextResponse.json({
        success: true,
        data: {
          id: dbEntry.id,
          fileId: dbEntry.fileId,
          filename: dbEntry.originalFilename,
          uploadedAt: dbEntry.uploadedAt,
        },
      });
    } catch (dbError) {
      console.error('Database error while storing CV data:', dbError);
      return NextResponse.json(
        {
          error: 'Database error while storing CV data',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error processing CV upload:', error);
    return NextResponse.json(
      {
        error: 'Failed to process the uploaded file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
