import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ResumeSchema } from '@/lib/resume-match/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { cvText } = await request.json();

    if (!cvText || typeof cvText !== 'string') {
      return NextResponse.json(
        { error: 'CV text is required' },
        { status: 400 },
      );
    }

    const prompt = `You are an expert resume parser. Extract structured information from the following CV/resume and format it as a JSON object.

Resume Text:
${cvText}

Format the output as a valid JSON object with the following structure:
{
  "basics": {
    "name": "Full name of the person",
    "label": "Professional title/role",
    "email": "Email address",
    "phone": "Phone number",
    "summary": "Professional summary/objective",
    "location": {
      "address": "Street address",
      "city": "City",
      "countryCode": "Country code",
      "region": "State/Province/Region"
    }
  },
  "work": [
    {
      "company": "Company name",
      "position": "Job title",
      "startDate": "Start date",
      "endDate": "End date or 'Present'",
      "summary": "Job description and achievements"
    }
  ],
  "education": [
    {
      "institution": "School/University name",
      "area": "Field of study",
      "studyType": "Degree",
      "startDate": "Start date",
      "endDate": "End date"
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "level": "Expertise level",
      "keywords": ["Keyword1", "Keyword2"]
    }
  ],
  "languages": [
    {
      "language": "Language name",
      "fluency": "Fluency level"
    }
  ],
  "interests": [
    {
      "name": "Interest category",
      "keywords": ["Keyword1", "Keyword2"]
    }
  ]
}

If certain information is not present in the CV, use empty strings for text fields or empty arrays for lists. Make sure the output is a valid JSON object.

Respond ONLY with the JSON object, no other text.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2, // Lower temperature for more consistent output
    });

    // Extract JSON from response
    const content = response.content[0].text;
    let resumeJson: ResumeSchema;

    try {
      // Try to parse the JSON response
      resumeJson = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON from LLM response', e);
      // If parsing fails, extract JSON object from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resumeJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from LLM response');
      }
    }

    return NextResponse.json({ resumeJson });
  } catch (error) {
    console.error('Error parsing CV:', error);
    return NextResponse.json({ error: 'Failed to parse CV' }, { status: 500 });
  }
}
