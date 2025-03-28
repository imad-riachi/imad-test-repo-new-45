import { NextRequest } from 'next/server';
import { rewriteCV, APIError } from '@/lib/services/llmService';
import { getUserLatestCV } from '@/lib/db/queries';
import { createErrorResponse } from '@/lib/api/errors';

export async function POST(req: NextRequest) {
  try {
    // Get job description from request body
    const data = await req.json();
    const { jobDescription } = data;

    if (!jobDescription || typeof jobDescription !== 'string') {
      return Response.json(
        { error: 'Job description is required' },
        { status: 400 },
      );
    }

    // Get the latest CV data for the user
    const latestCV = await getUserLatestCV();

    if (!latestCV) {
      return Response.json(
        { error: 'No CV found. Please upload a CV first.' },
        { status: 404 },
      );
    }

    // Call the LLM service to rewrite the CV
    const rewrittenCV = await rewriteCV(latestCV, jobDescription);

    // Return the rewritten CV
    return Response.json(
      {
        rewrittenCV,
        originalCVId: latestCV.id,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return createErrorResponse(error);
  }
}
