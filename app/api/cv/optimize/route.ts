import { NextRequest, NextResponse } from 'next/server';
import {
  optimizeCvForJob,
  CvOptimizationRecommendations,
} from '@/lib/api/anthropic';
import { CvData } from '@/lib/cv-parser/cv-parser';

/**
 * API route to optimize a CV based on a job description
 *
 * @param req Request containing CV data and job description
 * @returns Optimization recommendations
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { cvData, jobDescription } = body;

    // Validate request body
    if (!cvData) {
      return NextResponse.json(
        { error: 'CV data is required' },
        { status: 400 },
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 },
      );
    }

    // Optimize CV for the job description
    const recommendations: CvOptimizationRecommendations =
      await optimizeCvForJob(cvData as CvData, jobDescription);

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error('Error optimizing CV:', error);
    return NextResponse.json(
      { error: 'Failed to optimize CV' },
      { status: 500 },
    );
  }
}
