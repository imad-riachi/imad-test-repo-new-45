'use client';

import { ResumeSchema } from './types';

export async function convertToJsonResume(file: File): Promise<ResumeSchema> {
  try {
    console.log('Processing file:', file.name, 'Type:', file.type);

    // Extract text content based on file type
    let textContent: string;

    switch (file.type) {
      case 'application/pdf':
        console.log('PDF file detected');
        textContent = await file.text(); // Simple text extraction for PDF
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        console.log('DOCX file detected');
        textContent = await file.text(); // Simple text extraction for DOCX
        break;
      case 'text/plain':
        console.log('Text file detected');
        textContent = await file.text();
        break;
      default:
        console.log('Unknown file type, attempting text extraction');
        textContent = await file.text();
    }

    console.log('Extracted text content length:', textContent.length);

    // Use Anthropic API to parse the CV text into JSON
    const jsonResume = await parseWithLLM(textContent);
    console.log('Parsed CV via LLM:', JSON.stringify(jsonResume, null, 2));

    return jsonResume;
  } catch (error) {
    console.error('Error converting file to JSON Resume:', error);
    // If parsing fails, return a minimal valid schema object
    return createEmptyResumeSchema();
  }
}

async function parseWithLLM(cvText: string): Promise<ResumeSchema> {
  try {
    // Call our API route to parse the CV text
    const response = await fetch('/api/parse-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cvText }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.resumeJson;
  } catch (error) {
    console.error('Error parsing CV with LLM:', error);
    return createEmptyResumeSchema();
  }
}

function createEmptyResumeSchema(): ResumeSchema {
  return {
    basics: {
      name: '',
      label: '',
      email: '',
      phone: '',
      summary: '',
      location: {
        address: '',
        city: '',
        countryCode: '',
        region: '',
      },
    },
    work: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
  };
}
