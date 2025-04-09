/**
 * CV Parser Service
 *
 * This module provides functionality to parse CV text and convert it to a structured JSON format.
 */

import { extractTextFromCV } from './text-extractor';

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  address?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Skill {
  name: string;
  level?: string;
}

/**
 * Interface representing parsed CV data structure
 */
export interface CvData {
  /** Full name of the CV owner */
  name: string;

  /** Contact information */
  contactInfo: {
    /** Email address */
    email: string;
    /** Optional phone number */
    phone?: string;
    /** Optional website or portfolio URL */
    website?: string;
    /** Optional LinkedIn profile URL */
    linkedin?: string;
    /** Optional GitHub profile URL */
    github?: string;
    /** Optional location information */
    location?: string;
  };

  /** Optional professional summary or objective statement */
  summary?: string;

  /** Work experience entries, listed in reverse chronological order */
  workExperience: Array<{
    /** Company or organization name */
    company: string;
    /** Job title or position */
    position: string;
    /** Employment period (e.g. "2020-Present" or "Jan 2018 - Dec 2020") */
    period: string;
    /** List of responsibilities or achievements */
    responsibilities: string[];
    /** Optional location of the job */
    location?: string;
  }>;

  /** Education entries, listed in reverse chronological order */
  education: Array<{
    /** Institution name */
    institution: string;
    /** Degree or certification obtained */
    degree: string;
    /** Graduation year or period */
    year: string;
    /** Optional field of study */
    fieldOfStudy?: string;
    /** Optional GPA or academic achievements */
    achievements?: string[];
  }>;

  /** Skills with optional proficiency levels */
  skills: Array<{
    /** Skill name */
    name: string;
    /** Optional proficiency level (e.g. "Beginner", "Intermediate", "Advanced") */
    level?: string;
  }>;

  /** Optional certifications section */
  certifications?: Array<{
    /** Name of the certification */
    name: string;
    /** Issuing organization */
    issuer: string;
    /** Date obtained or validity period */
    date: string;
  }>;

  /** Optional projects section */
  projects?: Array<{
    /** Project name */
    name: string;
    /** Project description */
    description: string;
    /** Optional technologies used */
    technologies?: string[];
    /** Optional project URL */
    url?: string;
  }>;

  /** Optional languages section */
  languages?: Array<{
    /** Language name */
    name: string;
    /** Proficiency level */
    level: string;
  }>;

  /** Optional interests or hobbies */
  interests?: string[];

  /** Optional references section */
  references?: Array<{
    /** Reference name */
    name: string;
    /** Reference position */
    position: string;
    /** Reference contact information */
    contact: string;
    /** Optional relation to the candidate */
    relation?: string;
  }>;
}

/**
 * Helper function to extract an email address from text
 *
 * @param text The text to search for an email
 * @returns The first email address found, or undefined
 */
function extractEmail(text: string): string | undefined {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : undefined;
}

/**
 * Helper function to extract a phone number from text
 *
 * @param text The text to search for a phone number
 * @returns The first phone number found, or undefined
 */
function extractPhone(text: string): string | undefined {
  // This regex covers common phone number formats
  const phoneRegex =
    /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : undefined;
}

/**
 * Helper function to extract a LinkedIn URL from text
 *
 * @param text The text to search for a LinkedIn URL
 * @returns The first LinkedIn URL found, or undefined
 */
function extractLinkedIn(text: string): string | undefined {
  const linkedinRegex = /linkedin\.com\/in\/[A-Za-z0-9_-]+/i;
  const match = text.match(linkedinRegex);
  return match ? match[0] : undefined;
}

/**
 * Helper function to extract contact information from text
 *
 * @param text The CV text
 * @returns An object containing contact information
 */
function extractContactInfo(text: string): CvData['contactInfo'] {
  const email = extractEmail(text);
  return {
    email: email || 'no-email@example.com', // Ensure email is always a string
    phone: extractPhone(text),
    linkedin: extractLinkedIn(text),
  };
}

/**
 * Helper function to extract name from text
 *
 * @param text The CV text
 * @returns The extracted name, never undefined
 */
function extractName(text: string): string {
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
    if (!firstLine.match(/resume|curriculum|vitae|cv/i)) {
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
  // Look for content between "Summary:" and the next section
  const summaryRegex =
    /Summary:[\s\n]+([^]*?)(?=\n\n|Work Experience:|Education:|Skills:|$)/i;
  const match = text.match(summaryRegex);
  return match ? match[1].trim() : undefined;
}

/**
 * Helper function to extract work experience
 *
 * @param text The CV text
 * @returns Array of work experience entries
 */
function extractWorkExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];

  // Look for the Work Experience section
  const workExpRegex = /Work Experience:([^]*?)(?=Education:|Skills:|$)/i;
  const match = text.match(workExpRegex);

  if (match && match[1]) {
    const workExpSection = match[1].trim();

    // Split into individual job entries (assuming they start with a position/company line)
    const jobEntries = workExpSection.split(/\n(?=[A-Za-z]+[^,\n]+,)/);

    for (const entry of jobEntries) {
      if (!entry.trim()) continue;

      // Extract position, company, and period (e.g., "Senior Developer, ABC Company (2020-Present)")
      const jobHeaderRegex = /([^,]+),\s*([^(]+)\(([^)]+)\)/;
      const headerMatch = entry.match(jobHeaderRegex);

      if (headerMatch) {
        const position = headerMatch[1].trim();
        const company = headerMatch[2].trim();
        const period = headerMatch[3].trim();

        // Extract responsibilities (lines starting with "-" or "•")
        const responsibilities = entry
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('-') || line.startsWith('•'))
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

/**
 * Helper function to extract education information
 *
 * @param text The CV text
 * @returns Array of education entries
 */
function extractEducation(text: string): Education[] {
  const educationEntries: Education[] = [];

  // Look for the Education section
  const educationRegex = /Education:([^]*?)(?=Work Experience:|Skills:|$)/i;
  const match = text.match(educationRegex);

  if (match && match[1]) {
    const educationSection = match[1].trim();

    // For simplicity, we'll assume each education entry is on one line
    // e.g., "Bachelor of Science in Computer Science, University State (2018)"
    const entryRegex = /([^,]+),\s*([^(]+)\((\d{4})\)/g;
    let entryMatch;

    while ((entryMatch = entryRegex.exec(educationSection)) !== null) {
      educationEntries.push({
        degree: entryMatch[1].trim(),
        institution: entryMatch[2].trim(),
        year: entryMatch[3].trim(),
      });
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
  // This is a simplified approach - we'll extract skills mentioned in the summary or specific sections
  // In a real-world scenario, you might have a more sophisticated approach with skill categorization

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

  // Look for mentioned technologies in the text
  for (const keyword of techKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(text) && !foundSkills.has(keyword.toLowerCase())) {
      foundSkills.add(keyword.toLowerCase());
      skills.push({ name: keyword });
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
  // In a real implementation, this would use NLP or other techniques
  // to extract structured data from the raw CV text

  // This is a placeholder implementation that would be replaced
  // with actual parsing logic in a production environment
  return {
    name: extractName(cvContent),
    contactInfo: extractContactInfo(cvContent),
    summary: extractSummary(cvContent),
    workExperience: extractWorkExperience(cvContent),
    education: extractEducation(cvContent),
    skills: extractSkills(cvContent),
  };
}

/**
 * Main function to process a CV file
 *
 * @param filePath Path to the CV file
 * @param fileType MIME type of the file
 * @returns A structured JSON representation of the CV
 */
export async function processCVFile(
  filePath: string,
  fileType: string,
): Promise<CvData> {
  try {
    // Step 1: Extract raw text from the CV file
    const extractedText = await extractTextFromCV(filePath, fileType);

    // Step 2: Parse the text into structured data
    const parsedCV = parseCV(extractedText);

    return parsedCV;
  } catch (error) {
    console.error('Error processing CV file:', error);
    throw new Error('Failed to process CV file');
  }
}
