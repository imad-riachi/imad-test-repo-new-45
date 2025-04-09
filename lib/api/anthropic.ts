/**
 * Anthropic API Service for CV Processing
 *
 * This module provides functions to interact with Anthropic's Claude API
 * for CV parsing and optimization tasks.
 */

import { CvData } from '../cv-parser/cv-parser';

// Anthropic API configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Maximum allowed tokens in the response
const MAX_TOKENS = 4000;

/**
 * Error class for Anthropic API errors
 */
export class AnthropicApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public detail?: any,
  ) {
    super(message);
    this.name = 'AnthropicApiError';
  }
}

/**
 * Sends a request to the Anthropic API
 *
 * @param systemPrompt The system instructions for Claude
 * @param userPrompt The user message/query for Claude
 * @returns The response from Claude
 */
async function callAnthropicApi(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new AnthropicApiError(
      'Anthropic API key is not configured. Please set the ANTHROPIC_API_KEY environment variable.',
    );
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AnthropicApiError(
        `Anthropic API error: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    if (error instanceof AnthropicApiError) {
      throw error;
    }
    throw new AnthropicApiError(
      `Failed to call Anthropic API: ${(error as Error).message}`,
    );
  }
}

/**
 * System prompt for CV information extraction
 */
const CV_EXTRACTION_SYSTEM_PROMPT = `
You are an expert CV/resume parser. Your task is to extract structured information from the raw CV text provided.
Follow these guidelines:
1. Extract information into these categories: name, contact info, summary, work experience, education, skills
2. Maintain the structure and details from the original text
3. For work experience, identify company, position, dates, and responsibilities
4. For education, identify institution, degree, field of study, and dates
5. Format your response as valid JSON with no additional text or explanations
6. If a field is not found, include it as empty string or empty array
7. Be comprehensive and extract all relevant information
8. IMPORTANT: Return ONLY raw JSON, no Markdown formatting, no code blocks, no \`\`\` delimiters
9. CRITICAL: Always include the "summary" field with content. If no clear summary exists, create one based on the CV content.

Your output should match this structure:
{
  "name": "string",
  "contactInfo": {
    "email": "string",
    "phone": "string",
    "linkedin": "string",
    "website": "string",
    "location": "string"
  },
  "summary": "string",
  "workExperience": [
    {
      "company": "string",
      "position": "string",
      "period": "string",
      "responsibilities": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "skills": [
    {
      "name": "string"
    }
  ]
}
`;

/**
 * Extracts structured CV information from raw text using Claude
 *
 * @param cvText The raw text extracted from a CV document
 * @returns Structured CV data
 */
export async function extractCvWithLLM(cvText: string): Promise<CvData> {
  const userPrompt = `Please extract the structured information from this CV text:\n\n${cvText}`;

  try {
    const apiResponse = await callAnthropicApi(
      CV_EXTRACTION_SYSTEM_PROMPT,
      userPrompt,
    );

    // Extract JSON from possibly markdown-formatted response
    let jsonString = apiResponse;

    // Check if the response is wrapped in markdown code blocks
    const jsonBlockMatch = apiResponse.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      // Extract just the JSON content from inside the code block
      jsonString = jsonBlockMatch[1].trim();
    }

    console.log(
      'Extracted CV JSON string:',
      jsonString.substring(0, 100) + '...',
    );

    // Parse the JSON response
    const extractedData = JSON.parse(jsonString) as CvData;

    // Log extracted data for debugging
    console.log(
      'Extracted CV data summary field present:',
      Boolean(extractedData.summary),
    );

    // Generate a default summary if none was extracted
    if (!extractedData.summary || extractedData.summary.trim() === '') {
      console.log(
        'No summary found, generating one from skills and experience',
      );
      let generatedSummary = 'Professional with ';

      // Add skills to summary if available
      if (extractedData.skills && extractedData.skills.length > 0) {
        const skillNames = extractedData.skills.slice(0, 3).map((s) => s.name);
        generatedSummary += `expertise in ${skillNames.join(', ')}. `;
      }

      // Add experience to summary if available
      if (
        extractedData.workExperience &&
        extractedData.workExperience.length > 0
      ) {
        const latestJob = extractedData.workExperience[0];
        generatedSummary += `Experience as ${latestJob.position} at ${latestJob.company}.`;
      }

      extractedData.summary = generatedSummary;
    }

    // Ensure we return a valid CvData structure even if the LLM didn't provide all fields
    return {
      name: extractedData.name || 'Unknown Name',
      contactInfo: {
        email: extractedData.contactInfo?.email || '',
        phone: extractedData.contactInfo?.phone,
        linkedin: extractedData.contactInfo?.linkedin,
        website: extractedData.contactInfo?.website,
        location: extractedData.contactInfo?.location,
      },
      summary:
        extractedData.summary || 'Professional with experience in the field.',
      workExperience: extractedData.workExperience || [],
      education: extractedData.education || [],
      skills: extractedData.skills || [],
    };
  } catch (error) {
    console.error('Error extracting CV with LLM:', error);

    // Return default data structure if LLM processing fails
    return {
      name: 'Processing Error',
      contactInfo: { email: '' },
      summary:
        'An experienced professional with diverse skills. The CV processing system encountered an error, but you can edit this summary with your own content.',
      workExperience: [],
      education: [],
      skills: [],
    };
  }
}

/**
 * System prompt for CV optimization based on job description
 */
const CV_OPTIMIZATION_SYSTEM_PROMPT = `
You are an expert CV/resume optimizer. Your task is to analyze a CV and a job description, 
then provide actionable recommendations to better align the CV with the job requirements.
Follow these guidelines:
1. Identify skills and experiences in the job description that are missing or underemphasized in the CV
2. Suggest specific content improvements and rewording for the CV
3. Highlight relevant experiences and skills that should be emphasized
4. Provide specific suggestions for improving the summary section
5. Structure your response as JSON with sections for summary improvement, work experience recommendations, skills to add/emphasize
6. Be specific and actionable in your suggestions
7. Focus on honest representation, not fabrication
8. IMPORTANT: Return ONLY raw JSON, no Markdown formatting, no code blocks, no \`\`\` delimiters

Your output should match this structure:
{
  "summaryImprovement": "string",
  "workExperienceRecommendations": [
    {
      "company": "string",
      "position": "string",
      "improvements": ["string"]
    }
  ],
  "skillsRecommendations": {
    "add": ["string"],
    "emphasize": ["string"]
  },
  "overallSuggestions": ["string"]
}
`;

/**
 * Interface for CV optimization recommendations
 */
export interface CvOptimizationRecommendations {
  summaryImprovement: string;
  workExperienceRecommendations: {
    company: string;
    position: string;
    improvements: string[];
  }[];
  skillsRecommendations: {
    add: string[];
    emphasize: string[];
  };
  overallSuggestions: string[];
}

/**
 * Optimizes a CV for a specific job description using Claude
 *
 * @param cvData The structured CV data
 * @param jobDescription The job description text
 * @returns Optimization recommendations
 */
export async function optimizeCvForJob(
  cvData: CvData,
  jobDescription: string,
): Promise<CvOptimizationRecommendations> {
  // Convert CV data to a readable format for the LLM
  const cvText = `
Name: ${cvData.name}

Contact: 
${cvData.contactInfo.email}
${cvData.contactInfo.phone || ''}
${cvData.contactInfo.linkedin || ''}
${cvData.contactInfo.location || ''}

Summary:
${cvData.summary}

Work Experience:
${cvData.workExperience
  .map(
    (exp) =>
      `- ${exp.position} at ${exp.company} (${exp.period || 'No dates provided'})
   ${exp.responsibilities ? exp.responsibilities.map((r) => `  * ${r}`).join('\n') : ''}
  `,
  )
  .join('\n')}

Education:
${cvData.education
  .map(
    (edu) =>
      `- ${edu.degree} from ${edu.institution} (${edu.year || 'No date provided'})`,
  )
  .join('\n')}

Skills:
${cvData.skills.map((skill) => `- ${skill.name}`).join('\n')}
`;

  const userPrompt = `
Please optimize this CV for the following job description:

--- JOB DESCRIPTION ---
${jobDescription}
--- END JOB DESCRIPTION ---

--- CURRENT CV ---
${cvText}
--- END CURRENT CV ---

Provide specific recommendations to better align this CV with the job requirements.
`;

  try {
    const apiResponse = await callAnthropicApi(
      CV_OPTIMIZATION_SYSTEM_PROMPT,
      userPrompt,
    );

    // Extract JSON from possibly markdown-formatted response
    let jsonString = apiResponse;

    // Check if the response is wrapped in markdown code blocks
    const jsonBlockMatch = apiResponse.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      // Extract just the JSON content from inside the code block
      jsonString = jsonBlockMatch[1].trim();
    }

    console.log('Extracted JSON string:', jsonString.substring(0, 100) + '...');

    // Parse the JSON response
    const recommendations = JSON.parse(
      jsonString,
    ) as CvOptimizationRecommendations;

    return recommendations;
  } catch (error) {
    console.error('Error optimizing CV with LLM:', error);

    // Return default recommendations if LLM processing fails
    return {
      summaryImprovement:
        'Unable to generate summary improvement due to a processing error.',
      workExperienceRecommendations: [],
      skillsRecommendations: {
        add: [],
        emphasize: [],
      },
      overallSuggestions: [
        'An error occurred during CV optimization. Please try again later.',
      ],
    };
  }
}
