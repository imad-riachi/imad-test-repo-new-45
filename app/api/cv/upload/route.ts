import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { db } from '@/lib/db/drizzle';
import { getSession } from '@/lib/auth/session';
import { cvFiles } from '@/lib/db/schema';
import { processCVFile } from '@/lib/cv-parser/cv-parser';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Supported MIME types
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.google-apps.document',
];

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get URL parameters - check if we should extract data immediately
    const { searchParams } = new URL(request.url);
    const extractData = searchParams.get('extract') === 'true';

    // Parse the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 },
      );
    }

    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Please upload a PDF, Word document, or Google Doc.',
        },
        { status: 400 },
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const fileName = `${userId}_${timestamp}.${fileExtension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate file path
    const filePath = join(uploadDir, fileName);

    // Convert the file to buffer for storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Write file to disk
    await writeFile(filePath, fileBuffer);

    // Store metadata in database
    const newFile = await db
      .insert(cvFiles)
      .values({
        userId,
        fileName,
        fileType: file.type,
        fileSize: file.size,
        filePath: `uploads/${fileName}`, // Store relative path
        originalName,
        uploadedAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Prepare the response
    const response: any = {
      id: newFile[0].id,
      name: originalName,
      type: file.type,
      size: file.size,
      url: `/api/cv/files/${newFile[0].id}`,
    };

    // If extract=true, process the CV file and extract structured data
    if (extractData) {
      try {
        const extractedData = await processCVFile(filePath, file.type);
        response.data = extractedData;
      } catch (extractError) {
        console.error('Error extracting CV data:', extractError);
        // We don't want to fail the upload if extraction fails
        response.extractionError = 'Failed to extract CV data';
      }
    }

    // Return success response
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
