import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { cvData } from '@/lib/db/schema';
import { processCVFile } from '@/lib/cv/extractor';
import { getUser } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to upload a CV' },
        { status: 401 },
      );
    }

    // Handle file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Process the CV file
    const cvDataResult = await processCVFile(file, user.id.toString());

    // Save to database
    const result = await db
      .insert(cvData)
      .values({
        userId: user.id,
        fileName: cvDataResult.fileName,
        fileSize: cvDataResult.fileSize,
        fileType: cvDataResult.fileType,
        content: cvDataResult.content,
        jsonContent: cvDataResult.jsonContent,
      })
      .returning();

    return NextResponse.json({
      message: 'CV uploaded and processed successfully',
      cvId: result[0].id,
    });
  } catch (error) {
    console.error('Error processing CV:', error);
    return NextResponse.json(
      { error: 'Failed to process CV' },
      { status: 500 },
    );
  }
}
