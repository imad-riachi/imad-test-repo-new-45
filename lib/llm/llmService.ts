import {
  CVContent,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
} from '@/lib/cv/cvExtractor';
import Anthropic from '@anthropic-ai/sdk';

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
    console.log('Starting CV optimization with Anthropic SDK');
    // Claude API key from environment variable
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      throw new Error('Claude API key not found in environment variables');
    }

    // Initialize the Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Build the prompt with instructions and context
    const systemPrompt = `
      You are an expert CV optimizer. Your task is to rewrite and optimize the provided CV 
      to better match a specific job description. Follow these guidelines:
      
      1. Emphasize relevant skills and experience that match the job description
      2. Use active voice and impactful language
      3. Quantify achievements where possible
      4. Remove irrelevant information
      5. Format your response as JSON that matches the expected structure
      
      IMPORTANT: Your response MUST be valid JSON that can be parsed with JSON.parse(). 
      Do not include any explanatory text outside the JSON object.
      The JSON should have the following structure:
      {
        "summary": "string",
        "experience": [
          {
            "company": "string",
            "position": "string",
            "date": "string",
            "description": ["string"],
            "achievements": ["string"]
          }
        ],
        "skills": ["string"],
        "education": [
          {
            "institution": "string",
            "degree": "string",
            "date": "string",
            "description": "string"
          }
        ],
        "projects": [
          {
            "name": "string",
            "description": "string",
            "technologies": ["string"]
          }
        ]
      }
    `;

    console.log('Sending request using Anthropic SDK');

    // Send the request using the SDK
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is my current CV:\n${JSON.stringify(cvContent, null, 2)}\n\nHere is the job description I'm applying for:\n${jobDescription}\n\nPlease optimize my CV for this job description. IMPORTANT: Respond ONLY with a JSON object that follows the structure I specified. Do not include any explanation or text before or after the JSON object.`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.2,
    });

    console.log('Received response from Claude API');

    // Extract the JSON response from Claude
    let responseText = '';
    for (const content of response.content) {
      if (content.type === 'text') {
        responseText += content.text;
      }
    }

    console.log(
      'Raw response from Claude:',
      responseText.substring(0, 100) + '...',
    );

    // Extract the JSON from the response
    // This handles cases where Claude might wrap the JSON in markdown code blocks
    const jsonMatch =
      responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/) ||
      responseText.match(/\{[\s\S]*\}/); // Try to find a JSON object directly

    if (!jsonMatch) {
      console.error('Could not find JSON in Claude response');
      console.log('Response text starts with:', responseText.substring(0, 200));
      throw new Error(
        'Invalid response format: Could not extract JSON from Claude response',
      );
    }

    const jsonString = jsonMatch[0].startsWith('{')
      ? jsonMatch[0]
      : jsonMatch[1].trim();

    console.log(
      'Extracted JSON string starts with:',
      jsonString.substring(0, 50) + '...',
    );

    try {
      // Parse the response into the expected format
      const rewrittenCV = JSON.parse(
        jsonString,
      ) as CVOptimizationResponse['rewrites'];

      return {
        rewrites: rewrittenCV,
        rawResponse: response as unknown as ClaudeResponse,
      };
    } catch (parseError: unknown) {
      console.error('JSON parsing error:', parseError);
      console.log(
        'Failed to parse JSON string:',
        jsonString.substring(0, 100) + '...',
      );
      throw new Error(
        `Failed to parse Claude response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
      );
    }
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
