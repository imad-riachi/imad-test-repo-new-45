import { NextRequest } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { cvData } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { APIError, ErrorType, createErrorResponse } from '@/lib/api/errors';

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const user = await getUser();
    if (!user) {
      throw new APIError(
        'You must be logged in to delete a CV',
        ErrorType.UNAUTHORIZED,
        401,
      );
    }

    // Get CV ID from request
    const { searchParams } = new URL(req.url);
    const cvId = searchParams.get('id');

    if (!cvId) {
      throw new APIError('CV ID is required', ErrorType.BAD_REQUEST, 400);
    }

    // Delete the CV record
    const result = await db
      .delete(cvData)
      .where(and(eq(cvData.id, parseInt(cvId)), eq(cvData.userId, user.id)))
      .returning();

    if (result.length === 0) {
      throw new APIError(
        'CV not found or you do not have permission to delete it',
        ErrorType.BAD_REQUEST,
        404,
      );
    }

    return Response.json({
      message: 'CV deleted successfully',
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
