import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { cvData } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a CV' },
        { status: 401 },
      );
    }

    // Get CV ID from request
    const { searchParams } = new URL(req.url);
    const cvId = searchParams.get('id');

    if (!cvId) {
      return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
    }

    // Delete the CV record
    const result = await db
      .delete(cvData)
      .where(and(eq(cvData.id, parseInt(cvId)), eq(cvData.userId, user.id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'CV not found or you do not have permission to delete it' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'CV deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 });
  }
}
