import { NextRequest } from 'next/server';
import {
  getUserActiveJobDescription,
  saveJobDescription,
  deleteJobDescription,
} from '@/lib/db/queries';

// GET: Retrieve the active job description
export async function GET() {
  try {
    const jobDescription = await getUserActiveJobDescription();

    if (!jobDescription) {
      return Response.json({ jobDescription: null }, { status: 200 });
    }

    return Response.json({ jobDescription }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/job-description:', error);
    return Response.json(
      { error: 'Failed to retrieve job description' },
      { status: 500 },
    );
  }
}

// POST: Save a new job description
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { content } = data;

    if (!content || typeof content !== 'string') {
      return Response.json(
        { error: 'Job description content is required' },
        { status: 400 },
      );
    }

    const jobDescription = await saveJobDescription(content);

    return Response.json({ success: true, jobDescription }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/job-description:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to save job description';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Delete a job description
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { error: 'Valid job description ID is required' },
        { status: 400 },
      );
    }

    await deleteJobDescription(Number(id));

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/job-description:', error);
    return Response.json(
      { error: 'Failed to delete job description' },
      { status: 500 },
    );
  }
}
