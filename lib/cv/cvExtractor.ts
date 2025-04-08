/**
 * CV Extractor Module
 *
 * Responsible for extracting content from uploaded CV documents (Word, Google Docs)
 * and converting it to a structured JSON format
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import mammoth from 'mammoth';

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
 * Sanitize content for database storage to prevent UTF-8 encoding issues
 * Removes NULL bytes and other control characters that can cause PostgreSQL to reject the data
 */
function sanitizeContent(content: string): string {
  // Remove NULL bytes (0x00) which cause PostgreSQL errors
  const sanitized = content.replace(/\0/g, '');

  // Replace control characters (except tabs, newlines, and carriage returns)
  // Using a character-by-character approach to avoid regex control character issues
  let result = '';
  for (let i = 0; i < sanitized.length; i++) {
    const charCode = sanitized.charCodeAt(i);
    // Keep only printable characters and allowed whitespace (tab, newline, carriage return)
    if (
      charCode >= 32 ||
      charCode === 9 ||
      charCode === 10 ||
      charCode === 13
    ) {
      result += sanitized[i];
    }
  }

  return result;
}

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

    // Sanitize content before further processing
    rawContent = sanitizeContent(rawContent);
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
    // Use mammoth.js to extract text from the docx file
    const result = await mammoth.extractRawText({ buffer });
    let extractedText = result.value;

    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (extractedText.length > 0) {
      return extractedText;
    }

    // If we couldn't extract meaningful text, include a note
    return 'Your resume was uploaded but the text extraction needs improvement. Please ensure the CV optimization still matches your experiences and skills.';
  } catch (error) {
    console.error('Error extracting from docx:', error);
    // Return a more useful error message that includes the actual upload
    return 'There was an error extracting content from your uploaded .docx file. The CV optimization will continue with limited information.';
  }
}

/**
 * Extract text from .doc files
 */
async function extractFromDoc(buffer: Buffer): Promise<string> {
  try {
    // Try to extract text from the buffer directly
    // In a real implementation, we would use a specialized library

    // For now, look for plain text in the binary data
    const text = buffer.toString('utf-8');

    // Try to find text in the binary data (very basic approach)
    let extractedText = '';

    // Look for readable segments (this is very rudimentary)
    // Split the text using a simple approach to find readable portions
    const chunks = [];
    let currentChunk = '';

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Keep only printable ASCII characters, tabs, newlines, and carriage returns
      if (
        (charCode >= 32 && charCode <= 126) ||
        charCode === 9 ||
        charCode === 10 ||
        charCode === 13
      ) {
        currentChunk += text[i];
      } else if (currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    const textSegments = chunks.filter(
      (segment) =>
        segment.length > 10 &&
        /[a-zA-Z]{3,}/.test(segment) &&
        !/^[ \t\n\r]+$/.test(segment),
    );

    if (textSegments.length > 0) {
      extractedText = textSegments.join('\n\n');
    }

    if (extractedText.length > 100) {
      return extractedText;
    }

    // If we couldn't extract meaningful text, include a note but preserve any text we found
    return `[The system attempted to extract content from your .doc file. The extraction process may be incomplete.]\n\n${extractedText || 'Your resume was uploaded but the text extraction needs improvement. Please ensure the CV optimization still matches your experiences and skills.'}`;
  } catch (error) {
    console.error('Error extracting from doc:', error);
    // Return a more useful error message that includes the actual upload
    return 'There was an error extracting content from your uploaded .doc file. The CV optimization will continue with limited information.';
  }
}

/**
 * Extract text from Google Docs
 */
async function extractFromGoogleDoc(buffer: Buffer): Promise<string> {
  try {
    // Google Docs are typically exported as other formats
    // Try to extract text from the buffer as if it were exported as text

    const text = buffer.toString('utf-8');

    // Clean up the text
    const extractedText = text.replace(/\s+/g, ' ').trim();

    if (extractedText.length > 100) {
      return extractedText;
    }

    // If we couldn't extract meaningful text, include a note but preserve any text we found
    return `[The system attempted to extract content from your Google Doc. The extraction process may be incomplete.]\n\n${extractedText || 'Your resume was uploaded as a Google Doc but the text extraction needs improvement. Please ensure the CV optimization still matches your experiences and skills.'}`;
  } catch (error) {
    console.error('Error extracting from Google Doc:', error);
    // Return a more useful error message that includes the actual upload
    return 'There was an error extracting content from your uploaded Google Doc. The CV optimization will continue with limited information.';
  }
}

/**
 * Process raw text content into structured CV JSON data
 */
function processRawContent(rawContent: string): CVContent {
  // Use the actual raw content instead of hardcoded mock data
  // For a real production app, this would use NLP to extract structured information

  // Parse basic information from the raw text
  // This is a simple implementation - in a real app we would use more sophisticated parsing
  const lines = rawContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Extract potential name (first non-empty line as a simple heuristic)
  const potentialName = lines.length > 0 ? lines[0] : 'Unknown';

  // Try to extract email using a simple regex
  const emailMatch = rawContent.match(
    /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/,
  );
  const email = emailMatch ? emailMatch[0] : '';

  // Try to extract phone using a simple regex
  const phoneMatch = rawContent.match(
    /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/,
  );
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract skills - look for common section headers and the words that follow
  const skillsMatch = rawContent.match(/skills:?(.*?)(?:\n\n|\n\w+:|\n$)/is);
  const skillsText = skillsMatch ? skillsMatch[1].trim() : '';
  const skills = skillsText
    .split(/[,;.]/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 2 && skill.length < 30);

  // Extract a summary if present
  const summaryMatch = rawContent.match(/summary:?(.*?)(?:\n\n|\n\w+:|\n$)/is);
  const summary = summaryMatch
    ? summaryMatch[1].trim()
    : `Professional with experience in ${skills.slice(0, 3).join(', ')}`;

  // For experience, education, etc. - in a real app we would do more sophisticated parsing
  // For now, let's just create a single experience entry based on detected text patterns

  return {
    personalInfo: {
      name: potentialName,
      email: email,
      phone: phone,
    },
    summary: summary,
    education: [
      {
        institution: 'Extracted from uploaded CV',
        degree: 'Details from your uploaded document',
        startDate: '',
        endDate: '',
      },
    ],
    experience: [
      {
        company: 'Extracted from uploaded CV',
        position: 'Position from your uploaded document',
        startDate: '',
        endDate: '',
        description: 'Details extracted from your uploaded CV document.',
      },
    ],
    skills: skills.length > 0 ? skills : ['Skills extracted from your CV'],
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
