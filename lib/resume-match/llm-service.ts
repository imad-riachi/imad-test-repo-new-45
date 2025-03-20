'use client';

import { ResumeSchema } from './types';

export async function adaptResume(
  jsonResume: ResumeSchema,
  jobSpec: string,
): Promise<string> {
  try {
    console.log(
      'Resume JSON being sent to API:',
      JSON.stringify(jsonResume, null, 2),
    );
    console.log('Job Spec being sent to API:', jobSpec);

    const response = await fetch('/api/adapt-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jsonResume, jobSpec }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling API:', error);
    // Fallback to mock in case of error
    return mockLLMResponse(jsonResume, jobSpec);
  }
}

// Keep the mockLLMResponse function for fallback
function mockLLMResponse(jsonResume: ResumeSchema, jobSpec: string): string {
  return `# Adapted Resume

## Professional Summary
${jsonResume.basics.summary || 'A dedicated professional with a track record of success and relevant experience.'}

## Skills
${jsonResume.skills.map((skill) => `- ${skill.name}`).join('\n') || '- Communication\n- Problem Solving\n- Teamwork'}

## Work Experience
${jsonResume.work.map((job) => `### ${job.company || 'Company'}\n**${job.position || 'Position'}** | ${job.startDate || 'Start Date'} - ${job.endDate || 'Present'}\n\n${job.summary || 'Responsibilities and achievements.'}`).join('\n\n') || '### Work Experience\nDetails would be listed here based on the resume provided.'}

## Education
${jsonResume.education.map((edu) => `### ${edu.institution || 'Institution'}\n**${edu.studyType || 'Degree'} in ${edu.area || 'Field'}** | ${edu.startDate || 'Start Date'} - ${edu.endDate || 'End Date'}`).join('\n\n') || '### Education\nDetails would be listed here based on the resume provided.'}

---

*Note: This is a mock response generated without using the Anthropic API.*`;
}
