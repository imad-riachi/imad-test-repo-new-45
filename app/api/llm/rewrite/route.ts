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
    console.log('Received request to /api/llm/rewrite');

    // Verify authentication
    const user = await getUser();
    if (!user) {
      console.log('Authentication required');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get the request body
    const body = await request.json();
    const { fileId, jobDescription } = body;

    console.log(`Processing CV optimization for fileId: ${fileId}`);

    // Validate required fields
    if (!fileId) {
      console.log('CV file ID is required');
      return NextResponse.json(
        { error: 'CV file ID is required' },
        { status: 400 },
      );
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      console.log('Job description is required and must be a string');
      return NextResponse.json(
        { error: 'Job description is required and must be a string' },
        { status: 400 },
      );
    }

    // Get the CV data from the database
    const cvData = await getCVDataByFileId(fileId);
    if (!cvData) {
      console.log(`CV not found for fileId: ${fileId}`);
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Check if the CV belongs to the authenticated user
    if (cvData.userId !== user.id) {
      console.log('Access denied to this CV');
      return NextResponse.json(
        { error: 'Access denied to this CV' },
        { status: 403 },
      );
    }

    // Optimize the CV using Claude API (or use mock function if in development/testing)
    let result;
    try {
      if (
        process.env.NODE_ENV === 'development' &&
        !process.env.CLAUDE_API_KEY
      ) {
        console.log('Using mock LLM service in development mode');
        result = mockOptimizeCV(cvData.content as any, jobDescription);
      } else {
        console.log('Calling Claude API for CV optimization');
        result = await optimizeCV(cvData.content as any, jobDescription);
      }
    } catch (optimizeError) {
      console.error('Error during CV optimization:', optimizeError);
      // Fall back to mock implementation if Claude API fails
      console.log('Falling back to mock implementation due to API error');
      result = mockOptimizeCV(cvData.content as any, jobDescription);
    }

    console.log('Successfully optimized CV');

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
