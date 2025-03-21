import mammoth from 'mammoth';

export type CVData = {
  id?: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  content: string;
  jsonContent: CVContentJSON;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CVContentJSON = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  experience?: {
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }[];
  skills?: string[];
  rawText: string;
};

/**
 * Extracts content from a Word document and returns it as raw HTML
 */
export async function extractFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting content from Word document:', error);
    throw new Error('Failed to extract content from Word document');
  }
}

/**
 * Parse the extracted content into structured CV data
 * This is a simplified parser - in a real system, you'd want to use
 * more sophisticated NLP techniques or even Claude to parse the CV
 */
export function parseRawContent(rawText: string): CVContentJSON {
  // Basic parsing using regex patterns
  // This is highly simplified and would need to be more robust in a real app

  const fullNameMatch = rawText.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m);
  const emailMatch = rawText.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,
  );
  const phoneMatch = rawText.match(/(\+?[0-9][ -]?){7,}/);

  // Basic skills extraction - look for "Skills" section and grab the text after it
  const skillsMatch = rawText.match(/Skills:?\s*([\s\S]*?)(?:\n\n|\n\r\n|$)/i);
  const skills = skillsMatch
    ? skillsMatch[1]
        .split(/[,.]/)
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  // Extract summary - typically first paragraph after contact info
  const paragraphs = rawText.split(/\n\s*\n/);
  let summary = '';

  if (paragraphs.length > 1) {
    // Skip the first paragraph (usually contains name/contact info)
    // and use the next substantive paragraph
    for (let i = 1; i < paragraphs.length; i++) {
      const p = paragraphs[i].trim();
      if (p.length > 50) {
        summary = p;
        break;
      }
    }
  }

  return {
    fullName: fullNameMatch ? fullNameMatch[0] : undefined,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    summary,
    skills,
    rawText,
  };
}

/**
 * Main function to process a CV file
 */
export async function processCVFile(
  file: File,
  userId: string,
): Promise<CVData> {
  let content = '';

  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword'
  ) {
    content = await extractFromWord(file);
  } else if (file.type === 'application/vnd.google-apps.document') {
    // For Google Docs, we'd need to use Google Drive API
    // This is a placeholder for now
    throw new Error('Google Docs extraction not implemented yet');
  } else {
    throw new Error('Unsupported file type');
  }

  const jsonContent = parseRawContent(content);

  return {
    userId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    content,
    jsonContent,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
