import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { rewriteCV } from '@/lib/cv-rewriter/rewriter';
import { z } from 'zod';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { db } from '@/lib/db/drizzle';

// Define schema for request validation
const rewriteRequestSchema = z.object({
  cvData: z.custom<CvData>((val) => {
    // Custom validation for CvData structure
    const data = val as any;
    return (
      data &&
      typeof data === 'object' &&
      typeof data.name === 'string' &&
      typeof data.contactInfo === 'object' &&
      typeof data.contactInfo.email === 'string' &&
      Array.isArray(data.workExperience) &&
      Array.isArray(data.education) &&
      Array.isArray(data.skills)
    );
  }, 'Invalid CV data structure'),

  jobDescription: z
    .string()
    .min(10, 'Job description must be at least 10 words long')
    .refine((text) => {
      // Check if job description has at least 10 words
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      return wordCount >= 10;
    }, 'Job description must be at least 10 words long'),
});

/**
 * API handler for CV rewriting
 * This endpoint receives a CV in JSON format and a job description,
 * then uses an LLM service to rewrite the CV to match the job requirements.
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request data
    try {
      rewriteRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid request data',
            details: error.format(),
          },
          { status: 400 },
        );
      }
      throw error;
    }

    const { cvData, jobDescription } = body;

    // Process the CV rewriting
    const rewriteResponse = await rewriteCV(cvData, jobDescription);

    // Store the rewrite request in the database (optional)
    // This could be used for tracking usage, improving the service, etc.
    // db.insert(...) would go here

    // Return the rewritten CV
    return NextResponse.json(rewriteResponse, { status: 200 });
  } catch (error) {
    console.error('Error rewriting CV:', error);

    return NextResponse.json(
      {
        error: 'Failed to rewrite CV',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
