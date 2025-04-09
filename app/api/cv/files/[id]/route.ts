import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db/drizzle';
import { cvFiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get the file ID from URL parameters
    const fileId = parseInt(params.id, 10);
    if (isNaN(fileId)) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    // Get user session for authentication
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Query the file metadata from the database
    const fileMetadata = await db.query.cvFiles.findFirst({
      where: eq(cvFiles.id, fileId),
    });

    if (!fileMetadata) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if the user has permission to access this file
    if (fileMetadata.userId !== session.user.id) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Read the file from disk
    const filePath = join(process.cwd(), fileMetadata.filePath);
    const fileContent = await readFile(filePath);

    // Create response with appropriate headers
    const response = new NextResponse(fileContent);

    // Set appropriate Content-Type based on file type
    response.headers.set('Content-Type', fileMetadata.fileType);

    // Set Content-Disposition to specify filename
    response.headers.set(
      'Content-Disposition',
      `inline; filename="${fileMetadata.originalName}"`,
    );

    return response;
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
