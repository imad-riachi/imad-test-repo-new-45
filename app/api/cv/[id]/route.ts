import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { deleteCVData, getCVDataById } from '@/lib/db/queries';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const cvId = parseInt(params.id, 10);
    if (isNaN(cvId)) {
      return NextResponse.json({ error: 'Invalid CV ID' }, { status: 400 });
    }

    // Get CV data to check ownership
    const cvData = await getCVDataById(cvId);
    if (!cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Verify ownership
    if (cvData.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete CV data
    const success = await deleteCVData(cvId);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete CV' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
