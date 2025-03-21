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
 * Extracts content from a Word document and returns it as plain text
 */
export async function extractFromWord(file: File): Promise<string> {
  try {
    // For the MVP, we'll use a simple text extraction from docx
    // In a real application, we might use a more sophisticated parser
    const text = await simulateExtraction(file);
    return text;
  } catch (error) {
    console.error('Error extracting content from Word document:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract content: ${error.message}`);
    } else {
      throw new Error('Failed to extract content from Word document');
    }
  }
}

/**
 * Simulates text extraction from a docx file
 * For the MVP, we'll return a mockup of a CV
 */
async function simulateExtraction(file: File): Promise<string> {
  // For demo purposes, we'll return a mock CV text
  // This simulates a successful file parsing
  return `
John Doe
Email: john.doe@example.com
Phone: +1 (555) 123-4567
Address: 123 Main St, Anytown, USA

PROFESSIONAL SUMMARY
Experienced software engineer with over 5 years of expertise in web development. Skilled in JavaScript, TypeScript, React, and Node.js. Passionate about creating intuitive user interfaces and solving complex technical challenges.

SKILLS
JavaScript, TypeScript, React, Node.js, HTML, CSS, GraphQL, SQL, AWS, Git

WORK EXPERIENCE
Senior Frontend Developer
ABC Tech - New York, NY
January 2020 - Present
- Led development of company's flagship product using React and TypeScript
- Implemented state management using Redux and context API
- Collaborated with designers to create responsive, mobile-first interfaces

Web Developer
XYZ Solutions - San Francisco, CA
June 2017 - December 2019
- Developed and maintained multiple client websites
- Created reusable component libraries
- Optimized site performance and accessibility

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
2013 - 2017
  `;
}

/**
 * Parse the extracted content into structured CV data
 * This is a simplified parser - in a real system, you'd want to use
 * more sophisticated NLP techniques or even Claude to parse the CV
 */
export function parseRawContent(rawText: string): CVContentJSON {
  // Handle empty content
  if (!rawText || rawText.trim() === '') {
    return {
      rawText: rawText || '',
    };
  }

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
    content = await extractFromWord(file); // For demo, we'll treat it the same
  } else {
    // For demo purposes, we'll just simulate it
    content = await extractFromWord(file);
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
