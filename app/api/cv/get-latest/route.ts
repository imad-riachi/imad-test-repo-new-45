import { NextRequest } from 'next/server';
import { getUserLatestCV } from '@/lib/db/queries';
import { APIError, ErrorType, createErrorResponse } from '@/lib/api/errors';

export async function GET(req: NextRequest) {
  try {
    const latestCV = await getUserLatestCV();

    if (!latestCV) {
      return Response.json({ cv: null }, { status: 200 });
    }

    return Response.json({
      cv: {
        id: latestCV.id,
        fileName: latestCV.fileName,
        fileSize: latestCV.fileSize,
        fileType: latestCV.fileType,
        createdAt: latestCV.createdAt,
      },
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
