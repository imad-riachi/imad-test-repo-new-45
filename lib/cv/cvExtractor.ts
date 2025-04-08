/**
 * CV Extractor Module
 *
 * Responsible for extracting content from uploaded CV documents (Word, Google Docs)
 * and converting it to a structured JSON format
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export type CVExtractedData = {
  id: string;
  filename: string;
  content: CVContent;
  uploadDate: string;
  userId: number | null;
  fileType: string;
};

export type CVContent = {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  achievements?: string[];
  certifications?: CertificationEntry[];
  languages?: LanguageEntry[];
  projects?: ProjectEntry[];
  rawContent: string;
};

export type EducationEntry = {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
  gpa?: string;
};

export type ExperienceEntry = {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
  achievements?: string[];
};

export type CertificationEntry = {
  name: string;
  issuer?: string;
  date?: string;
  description?: string;
};

export type LanguageEntry = {
  language: string;
  proficiency?: string;
};

export type ProjectEntry = {
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Extracts content from an uploaded CV file
 */
export async function extractCVContent(
  file: File,
  userId: number | null = null,
): Promise<CVExtractedData> {
  // Create a buffer from the file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileType = file.type;
  let rawContent = '';

  // Extract raw text based on file type
  try {
    if (
      fileType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // .docx file
      rawContent = await extractFromDocx(buffer);
    } else if (fileType === 'application/msword') {
      // .doc file
      rawContent = await extractFromDoc(buffer);
    } else if (fileType === 'application/vnd.google-apps.document') {
      // Google Doc
      rawContent = await extractFromGoogleDoc(buffer);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting content from file:', error);
    throw new Error('Failed to extract content from the CV file');
  }

  // Process the raw content into structured data
  const content = processRawContent(rawContent);

  return {
    id: randomUUID(),
    filename: file.name,
    content,
    uploadDate: new Date().toISOString(),
    userId,
    fileType,
  };
}

/**
 * Extract text from .docx files
 */
async function extractFromDocx(buffer: Buffer): Promise<string> {
  try {
    // In a real implementation, we would use a library like mammoth.js
    // For now, we'll return a placeholder for demo purposes
    return 'This is placeholder content from a .docx file. In production, we would use mammoth.js or similar to extract the actual content.';
  } catch (error) {
    console.error('Error extracting from docx:', error);
    throw error;
  }
}

/**
 * Extract text from .doc files
 */
async function extractFromDoc(buffer: Buffer): Promise<string> {
  try {
    // In a real implementation, we would use a library for .doc extraction
    // For now, we'll return a placeholder for demo purposes
    return 'This is placeholder content from a .doc file. In production, we would use a DOC extraction library.';
  } catch (error) {
    console.error('Error extracting from doc:', error);
    throw error;
  }
}

/**
 * Extract text from Google Docs
 */
async function extractFromGoogleDoc(buffer: Buffer): Promise<string> {
  try {
    // In a real implementation, we would use Google Drive API
    // For now, we'll return a placeholder for demo purposes
    return 'This is placeholder content from a Google Doc. In production, we would use Google Drive API to extract content.';
  } catch (error) {
    console.error('Error extracting from Google Doc:', error);
    throw error;
  }
}

/**
 * Process raw text content into structured CV JSON data
 */
function processRawContent(rawContent: string): CVContent {
  // In a real implementation, this would use NLP/AI techniques to extract structured information
  // For demo purposes, we'll return a simple structured object with the raw content

  return {
    personalInfo: {
      name: 'John Doe', // Placeholder
      email: 'john.doe@example.com', // Placeholder
      phone: '+1 234 567 8900', // Placeholder
    },
    summary:
      'Experienced software engineer with expertise in web development and cloud technologies.', // Placeholder
    education: [
      {
        institution: 'Example University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2015-09',
        endDate: '2019-06',
      },
    ],
    experience: [
      {
        company: 'Example Corp',
        position: 'Senior Software Engineer',
        startDate: '2019-07',
        endDate: 'Present',
        description:
          'Developed full-stack web applications using modern JavaScript frameworks.',
      },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
    rawContent, // Include the raw content for future processing
  };
}

/**
 * Temporary function to save extracted data to a JSON file (for testing purposes)
 */
export async function saveExtractedData(
  data: CVExtractedData,
  outputDir: string,
): Promise<string> {
  const outputPath = path.join(outputDir, `${data.id}.json`);
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  return outputPath;
}
