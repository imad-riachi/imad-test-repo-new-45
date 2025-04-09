/**
 * CV Text Extraction Utility
 *
 * This module provides functions to extract text from various CV file formats
 * (PDF, Word Documents, and Google Docs).
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import mammoth from 'mammoth';
import { parsePdf } from './pdf-wrapper';

/**
 * Advanced text normalization and cleanup
 * @param text Raw extracted text
 */
function normalizeText(text: string): string {
  return (
    text
      // Replace multiple newlines with a single one
      .replace(/\n{3,}/g, '\n\n')
      // Replace multiple spaces with a single one
      .replace(/[ \t]+/g, ' ')
      // Fix common OCR/extraction issues
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Add space after bullet points if missing
      .replace(/•(?=[a-zA-Z])/g, '• ')
      .replace(/-(?=[a-zA-Z])/g, '- ')
      // Add space after typical section headers if missing
      .replace(
        /(Education|Experience|Skills|Summary|Certification|Projects|Languages|References):(?=[a-zA-Z])/gi,
        '$1: ',
      )
      // Trim each line
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
  );
}

/**
 * Improved extraction of content structure from raw text
 * @param text Raw extracted text
 */
function enhanceExtractedText(text: string): string {
  // Add section markers if they don't exist but the content suggests sections
  let enhanced = text;

  // Look for potential education section
  if (
    !text.match(/education:/i) &&
    text.match(/bachelor|master|degree|university|college|diploma/i)
  ) {
    const educationIndicators = [
      'Bachelor',
      'Master',
      'PhD',
      'University',
      'College',
      'Degree',
      'B.S.',
      'M.S.',
      'B.A.',
      'M.A.',
      'GPA',
      'Graduated',
    ];

    for (const indicator of educationIndicators) {
      const regex = new RegExp(`(\\n|^)([^\\n]*${indicator}[^\\n]*)`, 'i');
      const match = enhanced.match(regex);
      if (match) {
        enhanced = enhanced.replace(match[0], `\n\nEducation:\n${match[2]}`);
        break;
      }
    }
  }

  // Look for potential experience section
  if (
    !text.match(/experience:|work experience:/i) &&
    text.match(/worked at|position|role at|job title|company|employer/i)
  ) {
    enhanced = enhanced.replace(
      /(\n|^)([^\n]*(worked at|position:|job title:|company:|employer:)[^\n]*)/i,
      '\n\nWork Experience:\n$2',
    );
  }

  // Look for potential skills section
  if (
    !text.match(/skills:|technical skills:/i) &&
    text.match(
      /proficient in|familiar with|knowledge of|expertise in|technologies/i,
    )
  ) {
    enhanced = enhanced.replace(
      /(\n|^)([^\n]*(proficient in|familiar with|knowledge of|expertise in|technologies:)[^\n]*)/i,
      '\n\nSkills:\n$2',
    );
  }

  return enhanced;
}

/**
 * Extracts text content from a PDF file
 *
 * @param filePath Path to the PDF file
 * @returns Extracted text content
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    console.log(`Reading PDF file from: ${filePath}`);

    // Read the file content
    const fileBuffer = await readFile(filePath);

    try {
      // Use our PDF parser wrapper to extract text from the PDF
      const data = await parsePdf(fileBuffer, {
        version: '1.10.100', // Use a fixed version to prevent further issues
      });

      // Verify we got actual content
      if (data && data.text && data.text.length > 0) {
        console.log(
          `Successfully extracted ${data.text.length} characters from PDF`,
        );

        // Clean and enhance the extracted text
        const normalizedText = normalizeText(data.text);
        const enhancedText = enhanceExtractedText(normalizedText);

        return enhancedText;
      } else {
        throw new Error('Extracted PDF text is empty');
      }
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);

      // Fallback 1: Try simpler PDF parsing approach
      console.log('Attempting simple PDF text extraction as fallback...');

      // Extract visible text using a simpler approach
      // Convert Buffer to string and search for text patterns
      const bufferString = fileBuffer.toString(
        'utf-8',
        0,
        Math.min(fileBuffer.length, 1000000),
      );

      // Get text content between parentheses (often how text is stored in PDFs)
      const textMatches = bufferString.match(/\(([^)]+)\)/g) || [];
      const extractedText = textMatches
        .map((match) => match.substring(1, match.length - 1))
        .filter((text) => /[a-zA-Z]{2,}/.test(text)) // Only keep strings with actual words
        .join(' ');

      if (extractedText && extractedText.length > 100) {
        console.log(
          `Extracted ${extractedText.length} characters using fallback method`,
        );

        // Clean and enhance the extracted text
        const normalizedText = normalizeText(extractedText);
        const enhancedText = enhanceExtractedText(normalizedText);

        return enhancedText;
      }

      // If both methods fail, return a helpful message but include any content we found
      return `PDF text extraction was difficult for this document. Limited text extracted:\n\n${extractedText || 'No clear text found'}.\n\nPlease try uploading a Word document (.docx) for better results.`;
    }
  } catch (error) {
    console.error('Error reading PDF file:', error);
    return 'Could not open PDF file. Please check if the file is corrupted or try a different format.';
  }
}

/**
 * Extracts text content from a Word document (.doc or .docx)
 *
 * @param filePath Path to the Word document
 * @returns Extracted text content
 */
export async function extractTextFromWord(filePath: string): Promise<string> {
  try {
    console.log(`Reading Word document from: ${filePath}`);

    // Read the file content
    const fileBuffer = await readFile(filePath);

    // Extract with both methods for best results
    const [rawTextResult, htmlResult] = await Promise.all([
      // Extract raw text
      mammoth.extractRawText({
        buffer: fileBuffer,
      }),

      // Extract HTML (has more structure information)
      mammoth.convertToHtml({
        buffer: fileBuffer,
      }),
    ]);

    // Get the raw text and HTML content
    const rawText = rawTextResult.value;
    const html = htmlResult.value;

    console.log(
      `Successfully extracted ${rawText.length} characters from Word document`,
    );

    // Use HTML structure to enhance the raw text extraction
    let enhancedText = rawText;

    // Extract section headers from HTML
    const headingMatches = html.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/g) || [];
    const headings = headingMatches.map((h) =>
      h
        .replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
        .trim(),
    );

    // Add section markers based on headings found in HTML
    headings.forEach((heading) => {
      // Only add section marker if the heading looks like a section
      if (
        /Education|Experience|Skills|Summary|Profile|Certification|Projects|Languages|References/i.test(
          heading,
        )
      ) {
        // Make sure this is a section header format if it's not already
        const headingWithColon = heading.includes(':')
          ? heading
          : `${heading}:`;

        // Find the heading in the raw text and replace it with a better formatted version
        const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(
          `(^|\\n)\\s*${escapedHeading}\\s*(:|\\n|$)`,
          'i',
        );

        if (regex.test(enhancedText)) {
          enhancedText = enhancedText.replace(
            regex,
            `\n\n${headingWithColon}\n`,
          );
        } else {
          // If the exact heading isn't found, look for content that might be this section
          // This helps with inconsistent parsing between HTML and raw text
          const approxRegex = new RegExp(
            `(^|\\n)\\s*(\\w*${heading.substring(0, 5)}\\w*)\\s*(:|\\n|$)`,
            'i',
          );
          if (approxRegex.test(enhancedText)) {
            enhancedText = enhancedText.replace(
              approxRegex,
              `\n\n${headingWithColon}\n`,
            );
          }
        }
      }
    });

    // Clean up and structurally enhance the text
    const normalizedText = normalizeText(enhancedText);
    const finalText = enhanceExtractedText(normalizedText);

    return finalText;
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    return 'Word document text extraction failed. The file may be corrupted or password-protected.';
  }
}

/**
 * Main function to extract text from a CV file based on its type
 *
 * @param filePath Path to the CV file
 * @param fileType MIME type of the file
 * @returns Extracted text content
 */
export async function extractTextFromCV(
  filePath: string,
  fileType: string,
): Promise<string> {
  try {
    console.log(`Extracting text from file: ${filePath}, type: ${fileType}`);

    switch (fileType) {
      case 'application/pdf':
        return await extractTextFromPDF(filePath);

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromWord(filePath);

      // Google Docs files are typically downloaded as .docx
      case 'application/vnd.google-apps.document':
        return await extractTextFromWord(filePath);

      default:
        return `Unsupported file type: ${fileType}. Please upload a PDF or Word document.`;
    }
  } catch (error) {
    console.error('Error in text extraction:', error);

    // Provide a generic fallback extraction result rather than failing completely
    return `Could not extract text from the uploaded file. The file may be corrupted, password-protected, or in an unsupported format. Please try a different file.`;
  }
}
