import { CVData } from '@/lib/db/schema';

// Types for Claude API request
type MessageContent = {
  type: 'text';
  text: string;
};

type Message = {
  role: 'user' | 'assistant';
  content: MessageContent[];
};

type ClaudeRequest = {
  model: string;
  messages: Message[];
  max_tokens: number;
  temperature: number;
};

// Updated types for Claude API response based on their current API
type ClaudeContentBlock = {
  type: string;
  text: string;
};

type ClaudeAPIResponse = {
  id: string;
  type: string;
  role: string;
  content: ClaudeContentBlock[];
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
};

export class APIError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

/**
 * Generates a prompt for the Claude API based on the CV and job description
 */
const generatePrompt = (cvData: CVData, jobDescription: string): string => {
  return `
I need you to optimize my CV for a specific job. 

Here is my current CV in JSON format:
${JSON.stringify(cvData.jsonContent, null, 2)}

And here is the job description I am applying for:
${jobDescription}

Please rewrite my CV to better match this job description. Optimize the content to highlight relevant skills and experiences, while maintaining truthfulness.

Format the response as text that I can copy and paste. Include clear section headings and maintain a professional format.
`;
};

/**
 * Calls the Claude API to rewrite the CV based on the job description
 */
export const rewriteCV = async (
  cvData: CVData,
  jobDescription: string,
): Promise<string> => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new APIError('Anthropic API key is missing', 500);
  }

  const prompt = generatePrompt(cvData, jobDescription);

  const requestPayload: ClaudeRequest = {
    model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307', // Use environment variable with fallback
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new APIError(
        `Claude API error: ${errorData.error?.message || 'Unknown error'}`,
        response.status,
      );
    }

    const data = (await response.json()) as ClaudeAPIResponse;

    // Updated to handle the actual Claude API response structure
    if (!data.content) {
      throw new APIError('No response content received from Claude API', 500);
    }

    // Extract the text content from the response
    const rewrittenCV = data.content
      .filter((item) => item && item.type === 'text')
      .map((item) => item.text)
      .join('\n');

    return rewrittenCV;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Error calling Claude API: ${(error as Error).message}`,
      500,
    );
  }
};
