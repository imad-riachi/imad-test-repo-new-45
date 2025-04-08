import {
  CVContent,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
} from '@/lib/cv/cvExtractor';

// Claude API response type
export type ClaudeResponse = {
  id: string;
  type: string;
  content: Array<{
    type: string;
    text?: string;
  }>;
};

// CV optimization response
export type CVOptimizationResponse = {
  rewrites: {
    summary?: string;
    experience?: Array<{
      company: string;
      position: string;
      date?: string; // Simplified date format for display
      description: string[];
      achievements?: string[];
    }>;
    skills?: string[];
    education?: Array<{
      institution: string;
      degree: string;
      date?: string; // Simplified date format for display
      description?: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies?: string[];
    }>;
  };
  rawResponse: ClaudeResponse;
};

/**
 * Sends a CV and job description to Claude API for optimization
 * @param cvContent - The parsed CV content from the extraction module
 * @param jobDescription - The job description provided by the user
 * @returns A processed response with the rewritten CV content
 */
export async function optimizeCV(
  cvContent: CVContent,
  jobDescription: string,
): Promise<CVOptimizationResponse> {
  try {
    // Claude API key from environment variable
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      throw new Error('Claude API key not found in environment variables');
    }

    // Build the prompt with instructions and context
    const systemPrompt = `
      You are an expert CV optimizer. Your task is to rewrite and optimize the provided CV 
      to better match a specific job description. Follow these guidelines:
      
      1. Emphasize relevant skills and experience that match the job description
      2. Use active voice and impactful language
      3. Quantify achievements where possible
      4. Remove irrelevant information
      5. Format your response as JSON that matches the expected structure
      
      Respond ONLY with properly formatted JSON that contains the rewritten CV content.
    `;

    // Construct the request payload
    const payload = {
      model: 'claude-3-opus-20240229',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here is my current CV:\n${JSON.stringify(cvContent, null, 2)}\n\nHere is the job description I'm applying for:\n${jobDescription}\n\nPlease optimize my CV for this job description.`,
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.2,
    };

    // Send the request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorBody}`);
    }

    const claudeResponse = (await response.json()) as ClaudeResponse;

    // Extract the JSON response from Claude
    let responseText = '';
    for (const content of claudeResponse.content) {
      if (content.type === 'text' && content.text) {
        responseText += content.text;
      }
    }

    // Extract the JSON from the response
    // This handles cases where Claude might wrap the JSON in markdown code blocks
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/) || [null, responseText];

    const jsonString = jsonMatch[1] ? jsonMatch[1].trim() : responseText.trim();

    // Parse the response into the expected format
    const rewrittenCV = JSON.parse(
      jsonString,
    ) as CVOptimizationResponse['rewrites'];

    return {
      rewrites: rewrittenCV,
      rawResponse: claudeResponse,
    };
  } catch (error) {
    console.error('Error optimizing CV with Claude:', error);
    throw new Error(
      `Failed to optimize CV: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Creates a mock response for testing without calling the actual API
 * @param cvContent - The parsed CV content from the extraction module
 * @param jobDescription - The job description provided by the user
 * @returns A mocked CV optimization response
 */
export function mockOptimizeCV(
  cvContent: CVContent,
  jobDescription: string,
): CVOptimizationResponse {
  // Extract job-related keywords for simulation
  const keywords = jobDescription.toLowerCase().split(/\s+/);

  // Get original summary and enhance it
  const originalSummary = cvContent.summary || '';

  return {
    rewrites: {
      summary: `${originalSummary} With proven expertise in ${keywords.slice(0, 5).join(', ')}.`,
      experience: cvContent.experience.map((exp: ExperienceEntry) => ({
        company: exp.company,
        position: exp.position,
        date:
          exp.startDate && exp.endDate
            ? `${exp.startDate} - ${exp.endDate}`
            : exp.startDate || exp.endDate || '',
        description: exp.description
          ? [
              exp.description +
                ` [Optimized for ${keywords.slice(0, 3).join(', ')}]`,
            ]
          : [`Experience with ${keywords.slice(0, 3).join(', ')}`],
        achievements: exp.achievements || [],
      })),
      skills: cvContent.skills,
      education: cvContent.education.map((edu: EducationEntry) => ({
        institution: edu.institution,
        degree: edu.degree || 'Degree',
        date:
          edu.startDate && edu.endDate
            ? `${edu.startDate} - ${edu.endDate}`
            : edu.startDate || edu.endDate || '',
        description: edu.description,
      })),
      projects: cvContent.projects?.map((proj: ProjectEntry) => ({
        name: proj.name,
        description:
          proj.description ||
          `Project related to ${keywords.slice(0, 3).join(', ')}`,
        technologies: proj.technologies,
      })),
    },
    rawResponse: {
      id: 'mock-response-id',
      type: 'message',
      content: [
        {
          type: 'text',
          text: 'Mock response for testing',
        },
      ],
    },
  };
}
