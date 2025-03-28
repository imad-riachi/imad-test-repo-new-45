import { NextResponse } from 'next/server';
import { getUserLatestCV } from '@/lib/db/queries';

export async function GET() {
  try {
    const latestCV = await getUserLatestCV();

    if (!latestCV) {
      return NextResponse.json({ cv: null }, { status: 200 });
    }

    return NextResponse.json({
      cv: {
        id: latestCV.id,
        fileName: latestCV.fileName,
        fileSize: latestCV.fileSize,
        fileType: latestCV.fileType,
        createdAt: latestCV.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching latest CV:', error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}
