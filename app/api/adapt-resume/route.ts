import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '', // Use server-side env variable
});

export async function POST(request: Request) {
  try {
    const { jsonResume, jobSpec } = await request.json();

    const prompt = `You are a professional resume writer. Your task is to adapt the following resume to better match the job specification while maintaining complete truthfulness. Highlight relevant skills and experiences, and rephrase experiences to emphasize transferable skills that match the job requirements.

Resume (in JSON format):
${JSON.stringify(jsonResume, null, 2)}

Job Specification:
${jobSpec}

Please provide an adapted resume in markdown format that:
1. Maintains all factual information from the original resume
2. Reorganizes and rephrases content to highlight relevance to the job specification
3. Uses professional, action-oriented language
4. Emphasizes transferable skills
5. Includes a brief summary section tailored to the job

Format the output in clean markdown with appropriate sections and bullet points.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error('Error adapting resume:', error);
    return NextResponse.json(
      { error: 'Failed to adapt resume' },
      { status: 500 },
    );
  }
}
