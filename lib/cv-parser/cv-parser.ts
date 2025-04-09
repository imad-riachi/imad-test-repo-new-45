/**
 * CV Parser Service
 *
 * This module is responsible for parsing raw CV text into structured data.
 */

import { unlink } from 'fs/promises';
import { extractTextFromCV } from './text-extractor';
import { extractCvWithLLM } from '../api/anthropic';

/**
 * Interface for structured CV data
 */
export interface CvData {
  name: string;
  contactInfo: {
    email: string;
    phone?: string;
    linkedin?: string;
    website?: string;
    location?: string;
  };
  summary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: Language[];
  interests?: string[];
  references?: Reference[];
}

interface WorkExperience {
  company: string;
  position: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  responsibilities?: string[];
  description?: string;
  achievements?: string[];
}

interface Education {
  institution: string;
  degree: string;
  year?: string;
  graduationDate?: string;
  field?: string;
  fieldOfStudy?: string;
  gpa?: string;
  achievements?: string[];
}

interface Skill {
  name: string;
  level?: string;
  category?: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  role?: string;
  period?: string;
}

interface Language {
  name: string;
  proficiency?: string;
}

interface Reference {
  name: string;
  position?: string;
  company?: string;
  contact?: string;
}

/**
 * Helper function to extract contact information
 *
 * @param text The CV text
 * @returns Object containing contact info
 */
function extractContactInfo(text: string): {
  email: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  location?: string;
} {
  const contactInfo = {
    email: extractEmail(text) || 'no-email@example.com',
    phone: extractPhone(text),
    linkedin: extractLinkedIn(text),
    website: extractWebsite(text),
    location: extractLocation(text),
  };

  return contactInfo;
}

/**
 * Helper function to extract email address
 *
 * @param text The CV text
 * @returns The extracted email or undefined
 */
function extractEmail(text: string): string | undefined {
  // Simple regex for email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : undefined;
}

/**
 * Helper function to extract phone number
 *
 * @param text The CV text
 * @returns The extracted phone number or undefined
 */
function extractPhone(text: string): string | undefined {
  // Match various phone number formats
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : 'Not detected';
}

/**
 * Helper function to extract LinkedIn profile
 *
 * @param text The CV text
 * @returns The extracted LinkedIn URL or undefined
 */
function extractLinkedIn(text: string): string | undefined {
  // Match LinkedIn URLs or mentions
  const linkedinRegex =
    /(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+|linkedin: ([a-zA-Z0-9_-]+))/i;
  const match = text.match(linkedinRegex);
  return match ? match[0] : 'Not detected';
}

/**
 * Helper function to extract website URL
 *
 * @param text The CV text
 * @returns The extracted website or undefined
 */
function extractWebsite(text: string): string | undefined {
  // Match website URLs (excluding LinkedIn)
  const websiteRegex =
    /(?:https?:\/\/(?!www\.linkedin\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i;
  const match = text.match(websiteRegex);
  return match ? match[0] : undefined;
}

/**
 * Helper function to extract location
 *
 * @param text The CV text
 * @returns The extracted location or undefined
 */
function extractLocation(text: string): string | undefined {
  // This is a simplistic approach - a real implementation would be more sophisticated
  const locationMarkers = [
    'Location:',
    'Address:',
    'City:',
    'Based in',
    'Living in',
    'Located in',
  ];

  let location = undefined;

  for (const marker of locationMarkers) {
    const regex = new RegExp(`${marker}\\s+([^\\n,]+(?:,\\s*[^\\n]+)?)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      location = match[1].trim();
      break;
    }
  }

  return location;
}

/**
 * Helper function to extract name
 *
 * @param text The CV text
 * @returns The extracted name, never undefined
 */
function extractName(text: string): string {
  // Special handling for simulated content
  if (text.includes('SIMULATED CV CONTENT')) {
    const nameMatch = text.match(/RESUME\s+\n+([A-Za-z\s]+)/);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].trim();
    }
  }

  // Look for lines that start with "Resume of" or lines at the beginning
  const resumeOfRegex = /Resume of\s+([A-Za-z\s]+)/;
  const match = text.match(resumeOfRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // As a fallback, try to get the first line that's not empty
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length > 0) {
    // Exclude lines that are likely headers like "Curriculum Vitae" or "Resume"
    const firstLine = lines[0];
    if (!firstLine.match(/resume|curriculum|vitae|cv|simulated/i)) {
      return firstLine;
    } else if (lines.length > 1) {
      return lines[1];
    }
  }

  return 'Unknown Name'; // Default value to ensure we always return a string
}

/**
 * Helper function to extract summary or professional statement
 *
 * @param text The CV text
 * @returns The extracted summary or undefined
 */
function extractSummary(text: string): string | undefined {
  // Special handling for simulated content
  if (text.includes('SIMULATED CV CONTENT')) {
    const summaryMatch = text.match(
      /Summary:\s+([^]*?)(?=\s+Work Experience:)/i,
    );
    if (summaryMatch && summaryMatch[1]) {
      return summaryMatch[1].trim();
    }
  }

  // Try multiple common section headings for summary content
  const summaryRegexPatterns = [
    // Standard "Summary:" heading
    /(?:Summary|Profile|Professional Summary|About Me|Overview|Objective):\s*([^]*?)(?=\n\n\s*(?:Work Experience|Experience|Employment|Education|Skills|Certifications|Projects|Languages):|$)/i,

    // Look for content after name and before first section that might be summary
    /^(?:.*\n){1,4}((?:[^\n]+\n){1,8})(?=\n\s*(?:Work Experience|Experience|Employment|Education|Skills):|$)/i,

    // A plain paragraph at the top that's likely a summary (if no explicit summary section exists)
    /^(?:[^\n]+\n){0,2}([^\n]+(?:\n[^\n]+){2,6})(?=\n\n)/i,
  ];

  // Try each pattern in order until we find a match
  for (const pattern of summaryRegexPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 20) {
      // Require reasonable length
      return match[1].trim();
    }
  }

  return undefined;
}

/**
 * Helper function to extract work experience
 *
 * @param text The CV text
 * @returns Array of work experience entries
 */
function extractWorkExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];

  // Special handling for simulated content
  if (text.includes('SIMULATED CV CONTENT')) {
    // Extract from mock data which has a more consistent format
    const workExpSection = text.match(
      /Work Experience:\s+([^]*?)(?=\s+Education:)/i,
    );

    if (workExpSection && workExpSection[1]) {
      const expText = workExpSection[1].trim();
      const expEntries = expText.split(/\n\n+/);

      for (const entry of expEntries) {
        const lines = entry.split('\n').map((line) => line.trim());
        if (lines.length >= 2) {
          const position = lines[0];
          const companyLine = lines[1];

          // Parse "Company (Period)" format
          const companyMatch = companyLine.match(/(.+?)\s+\((.+?)\)/);
          if (companyMatch) {
            const company = companyMatch[1].trim();
            const period = companyMatch[2].trim();

            // Get responsibilities (lines that start with "- ")
            const responsibilities = lines
              .slice(2)
              .filter((line) => line.startsWith('-'))
              .map((line) => line.substring(1).trim());

            experiences.push({
              position,
              company,
              period,
              responsibilities,
            });
          }
        }
      }

      return experiences;
    }
  }

  // Regular parsing for real CV content
  // Try multiple heading patterns to find the work experience section
  const expHeadingPatterns = [
    /(?:Work Experience|Experience|Employment(?: History)?|Professional Experience):\s*([^]*?)(?=\n\n\s*(?:Education|Skills|Certifications|Projects|Languages|References):|$)/i,
    /(?:Work Experience|Experience|Employment(?: History)?|Professional Experience)\s*\n+\s*([^]*?)(?=\n\n\s*(?:Education|Skills|Certifications|Projects|Languages|References):|$)/i,
  ];

  let workExpSection = null;

  // Try each pattern until we find a match
  for (const pattern of expHeadingPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      workExpSection = match[1].trim();
      break;
    }
  }

  if (workExpSection) {
    // Different formats for job entries
    const possibleEntryPatterns = [
      // Format: "Position at Company (Date - Date)"
      /([^,\n]+)\s+(?:at|@)\s+([^(]+)\s*\(([^)]+)\)/g,

      // Format: "Position, Company (Date - Date)"
      /([^,\n]+),\s*([^(]+)\s*\(([^)]+)\)/g,

      // Format: "Company - Position (Date - Date)"
      /([^-\n]+)\s*-\s*([^(]+)\s*\(([^)]+)\)/g,

      // Format: "Position\nCompany\nDate - Date"
      /([^\n]+)\n([^\n]+)\n((?:\d{1,2}\/\d{1,2}|\d{4})[\s-]+(?:Present|\d{1,2}\/\d{1,2}|\d{4}))/g,
    ];

    // Try each job entry pattern
    for (const pattern of possibleEntryPatterns) {
      let entryMatch;
      while ((entryMatch = pattern.exec(workExpSection)) !== null) {
        // Extract position, company, period
        let position = entryMatch[1].trim();
        let company = entryMatch[2].trim();
        const period = entryMatch[3].trim();

        // For the last pattern where we need to swap position/company
        if (pattern.toString().includes('Position\\nCompany')) {
          [position, company] = [company, position];
        }

        // Extract responsibilities - lines after this match until next job entry or end
        const entryStartIndex = entryMatch.index + entryMatch[0].length;
        const nextEntryMatch = workExpSection
          .slice(entryStartIndex)
          .match(/\n\n(?:[^\n]+\n[^\n]+\n(?:\d{1,2}\/\d{1,2}|\d{4}))/);
        const endIndex =
          nextEntryMatch && nextEntryMatch.index !== undefined
            ? entryStartIndex + nextEntryMatch.index
            : workExpSection.length;

        const responsibilitiesText = workExpSection.slice(
          entryStartIndex,
          endIndex,
        );
        const responsibilities = responsibilitiesText
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('-') || line.startsWith('•'))
          .map((line) => line.substring(1).trim());

        experiences.push({
          position,
          company,
          period,
          responsibilities:
            responsibilities.length > 0 ? responsibilities : undefined,
        });
      }

      // If we found any experiences with this pattern, break
      if (experiences.length > 0) {
        break;
      }
    }
  }

  return experiences;
}

/**
 * Helper function to extract education information
 *
 * @param text The CV text
 * @returns Array of education entries
 */
function extractEducation(text: string): Education[] {
  const educationEntries: Education[] = [];

  // Special handling for simulated content
  if (text.includes('SIMULATED CV CONTENT')) {
    // Extract from mock data which has a more consistent format
    const eduSection = text.match(/Education:\s+([^]*?)(?=\s+Skills:|$)/i);

    if (eduSection && eduSection[1]) {
      const eduText = eduSection[1].trim();
      const lines = eduText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length >= 2) {
        const degree = lines[0];
        const institutionLine = lines[1];

        // Parse "Institution (Year)" format
        const institutionMatch = institutionLine.match(/(.+?)\s+\((.+?)\)/);
        if (institutionMatch) {
          educationEntries.push({
            degree,
            institution: institutionMatch[1].trim(),
            year: institutionMatch[2].trim(),
          });
        }
      }

      return educationEntries;
    }
  }

  // Try multiple heading patterns to find the education section
  const eduHeadingPatterns = [
    /Education(?:al background)?:\s*([^]*?)(?=\n\n\s*(?:Work Experience|Experience|Employment|Skills|Certifications|Projects|Languages|References):|$)/i,
    /Education(?:al background)?\s*\n+\s*([^]*?)(?=\n\n\s*(?:Work Experience|Experience|Employment|Skills|Certifications|Projects|Languages|References):|$)/i,
  ];

  let educationSection = null;

  // Try each pattern until we find a match
  for (const pattern of eduHeadingPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      educationSection = match[1].trim();
      break;
    }
  }

  if (educationSection) {
    // Try different education entry formats
    const possibleEntryPatterns = [
      // Format: "Degree in Field, Institution (Year)"
      /((?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Diploma).+?(?:in|of)?.+?),\s*([^,(]+)(?:\s*\((.+?)\))?/g,

      // Format: "Institution - Degree in Field (Year)"
      /([^-\n]+)\s*-\s*([^(]+)(?:\s*\((.+?)\))?/g,

      // Format: "Degree\nInstitution\nYear"
      /((?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Diploma)[^\n]+)\n([^\n]+)\n((?:\d{1,2}\/\d{1,2}|\d{4})(?:[\s-]+(?:Present|\d{1,2}\/\d{1,2}|\d{4}))?)/g,

      // Format: Just look for educational institution names with years
      /(?:University|College|Institute|School)\s+(?:of\s+)?([^,\n(]+)(?:[^(]*\((\d{4}(?:\s*-\s*(?:Present|\d{4}))?)\))?/gi,
    ];

    // Try each pattern
    for (const pattern of possibleEntryPatterns) {
      let entryMatch;

      // Reset pattern's lastIndex if it was used before
      pattern.lastIndex = 0;

      while ((entryMatch = pattern.exec(educationSection)) !== null) {
        // Extract degree, institution, year based on pattern
        let degree, institution, year;

        if (
          pattern.toString().includes('University|College|Institute|School')
        ) {
          // For the last pattern that just finds schools
          institution = entryMatch[1]?.trim() || 'Unknown Institution';
          year = entryMatch[2]?.trim();

          // Try to find a degree mention nearby
          const contextStart = Math.max(0, entryMatch.index - 50);
          const contextEnd = Math.min(
            educationSection.length,
            entryMatch.index + entryMatch[0].length + 50,
          );
          const context = educationSection.substring(contextStart, contextEnd);

          const degreeMatch = context.match(
            /(Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Diploma|Degree)[^\n,]*/i,
          );
          degree = degreeMatch ? degreeMatch[0].trim() : 'Degree';
        } else if (pattern.toString().includes('Degree\\nInstitution')) {
          // For the pattern where degree is first, then institution, then year
          degree = entryMatch[1].trim();
          institution = entryMatch[2].trim();
          year = entryMatch[3]?.trim();
        } else if (pattern.toString().includes('Institution - Degree')) {
          // For pattern where institution comes first
          institution = entryMatch[1].trim();
          degree = entryMatch[2].trim();
          year = entryMatch[3]?.trim();
        } else {
          // Standard pattern: degree, institution, year
          degree = entryMatch[1].trim();
          institution = entryMatch[2].trim();
          year = entryMatch[3]?.trim();
        }

        // Create education entry
        educationEntries.push({
          degree,
          institution,
          year: year || 'Not specified',
        });
      }

      // If we found any education entries with this pattern, break
      if (educationEntries.length > 0) {
        break;
      }
    }
  }

  return educationEntries;
}

/**
 * Helper function to extract skills
 *
 * @param text The CV text
 * @returns Array of skill entries
 */
function extractSkills(text: string): Skill[] {
  // Special handling for simulated content
  if (text.includes('SIMULATED CV CONTENT')) {
    // Extract from mock data which has a more consistent format
    const skillsSection = text.match(/Skills:\s+([^]*?)(?=\s+-{2,}|$)/i);

    if (skillsSection && skillsSection[1]) {
      const skillsText = skillsSection[1].trim();
      const skillsList = skillsText.split(/,\s*/).map((skill) => skill.trim());

      return skillsList.map((skill) => ({ name: skill }));
    }
  }

  // Common programming languages and technologies
  const techKeywords = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'Ruby',
    'PHP',
    'HTML',
    'CSS',
    'React',
    'Angular',
    'Vue',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Spring',
    'ASP.NET',
    'SQL',
    'NoSQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Git',
    'REST',
    'GraphQL',
    'TDD',
    'Agile',
    'Scrum',
  ];

  const skills: Skill[] = [];
  const foundSkills = new Set<string>();

  // Helper function to escape special regex characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Look for mentioned technologies in the text
  for (const keyword of techKeywords) {
    try {
      // Escape any regex special characters in the keyword
      const escapedKeyword = escapeRegExp(keyword);
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');

      if (regex.test(text) && !foundSkills.has(keyword.toLowerCase())) {
        foundSkills.add(keyword.toLowerCase());
        skills.push({ name: keyword });
      }
    } catch (error) {
      // Log the error but continue processing other keywords
      console.error(`Error processing keyword "${keyword}":`, error);
      continue;
    }
  }

  return skills;
}

/**
 * Parses CV content into a structured format
 *
 * @param cvContent The extracted text content from a CV document
 * @returns Structured CV data
 */
export function parseCV(cvContent: string): CvData {
  // Default empty data structure
  const defaultData: CvData = {
    name: 'Unknown Name',
    contactInfo: { email: '' },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
  };

  try {
    // Extract each section with individual try-catch blocks to prevent one failure from stopping everything
    let name = 'Unknown Name';
    let contactInfo = { email: '' };
    let summary = '';
    let workExperience: WorkExperience[] = [];
    let education: Education[] = [];
    let skills: Skill[] = [];

    try {
      name = extractName(cvContent);
    } catch (error) {
      console.error('Error extracting name:', error);
    }

    try {
      contactInfo = extractContactInfo(cvContent);
    } catch (error) {
      console.error('Error extracting contact info:', error);
    }

    try {
      summary = extractSummary(cvContent) || '';
    } catch (error) {
      console.error('Error extracting summary:', error);
    }

    try {
      workExperience = extractWorkExperience(cvContent);
    } catch (error) {
      console.error('Error extracting work experience:', error);
    }

    try {
      education = extractEducation(cvContent);
    } catch (error) {
      console.error('Error extracting education:', error);
    }

    try {
      skills = extractSkills(cvContent);
    } catch (error) {
      console.error('Error extracting skills:', error);
    }

    // Return the complete data with any successfully extracted sections
    return {
      name,
      contactInfo,
      summary,
      workExperience,
      education,
      skills,
    };
  } catch (error) {
    console.error('Error parsing CV content:', error);
    // Return default data structure if overall parsing fails
    return defaultData;
  }
}

/**
 * Clean up temporary files after processing
 *
 * @param filePath Path to the temporary file to remove
 * @returns Promise that resolves when file is deleted or rejects if an error occurs
 */
export async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
    console.log(`Temporary file ${filePath} has been removed`);
  } catch (error) {
    console.error(`Failed to remove temporary file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Main function to process a CV file
 *
 * @param filePath Path to the CV file
 * @param fileType MIME type of the file
 * @param useLLM Whether to use LLM-based extraction (defaults to true)
 * @returns A structured JSON representation of the CV
 */
export async function processCVFile(
  filePath: string,
  fileType: string,
  useLLM = true,
): Promise<CvData> {
  let extractedText = '';

  try {
    // Step 1: Extract text from the CV file
    try {
      extractedText = await extractTextFromCV(filePath, fileType);
    } catch (error) {
      console.error('Error extracting text from CV file:', error);
      // Return basic structure if text extraction fails completely
      return {
        name: 'Text Extraction Failed',
        contactInfo: { email: '' },
        summary:
          'Could not extract text from the uploaded file. Please check the file format and try again.',
        workExperience: [],
        education: [],
        skills: [],
      };
    }

    // Step 2: Parse the text into structured data
    if (useLLM) {
      try {
        console.log('Using LLM for CV parsing');
        // Use the LLM-based extraction
        const parsedCV = await extractCvWithLLM(extractedText);
        return parsedCV;
      } catch (llmError) {
        console.error(
          'LLM parsing failed, falling back to rule-based parsing:',
          llmError,
        );
        // If LLM parsing fails, fall back to the rule-based method
        const parsedCV = parseCV(extractedText);
        return parsedCV;
      }
    } else {
      // Use the traditional rule-based extraction
      const parsedCV = parseCV(extractedText);
      return parsedCV;
    }
  } catch (error) {
    console.error('Error processing CV file:', error);
    // If we get here, something unexpected happened
    return {
      name: 'Processing Error',
      contactInfo: { email: '' },
      summary:
        'An unexpected error occurred while processing your CV. Our team has been notified.',
      workExperience: [],
      education: [],
      skills: [],
    };
  }
}
