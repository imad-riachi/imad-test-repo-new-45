import { NextRequest, NextResponse } from 'next/server';
import { getUser, getUserCVData } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get CV data for the user
    const cvFiles = await getUserCVData(user.id);

    // Transform to a simpler format
    const formattedFiles = cvFiles.map((cv) => ({
      id: cv.id,
      fileId: cv.fileId,
      filename: cv.originalFilename,
      uploadedAt: cv.uploadedAt.toISOString(),
    }));

    return NextResponse.json({ files: formattedFiles });
  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CV files' },
      { status: 500 },
    );
  }
}
