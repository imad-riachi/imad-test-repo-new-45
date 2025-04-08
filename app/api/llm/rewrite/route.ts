import { NextRequest, NextResponse } from 'next/server';
import { optimizeCV, mockOptimizeCV } from '@/lib/llm/llmService';
import { getUser } from '@/lib/db/queries';
import { getCVDataByFileId } from '@/lib/db/queries';

/**
 * API route that accepts a CV file ID and job description, then uses Claude AI
 * to rewrite and optimize the CV based on the job description.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get the request body
    const body = await request.json();
    const { fileId, jobDescription } = body;

    // Validate required fields
    if (!fileId) {
      return NextResponse.json(
        { error: 'CV file ID is required' },
        { status: 400 },
      );
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Job description is required and must be a string' },
        { status: 400 },
      );
    }

    // Get the CV data from the database
    const cvData = await getCVDataByFileId(fileId);
    if (!cvData) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Check if the CV belongs to the authenticated user
    if (cvData.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied to this CV' },
        { status: 403 },
      );
    }

    // Optimize the CV using Claude API (or use mock function if in development/testing)
    let result;
    if (process.env.NODE_ENV === 'development' && !process.env.CLAUDE_API_KEY) {
      console.log('Using mock LLM service in development mode');
      result = mockOptimizeCV(cvData.content as any, jobDescription);
    } else {
      result = await optimizeCV(cvData.content as any, jobDescription);
    }

    // Store the optimized CV in session (or database in a production version)
    // We're keeping it simple for now with just returning the result

    // Return the rewritten CV
    return NextResponse.json({
      success: true,
      data: {
        fileId: cvData.fileId,
        originalFilename: cvData.originalFilename,
        rewrittenCV: result.rewrites,
      },
    });
  } catch (error) {
    console.error('Error in CV rewriting:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite CV', details: (error as Error).message },
      { status: 500 },
    );
  }
}
