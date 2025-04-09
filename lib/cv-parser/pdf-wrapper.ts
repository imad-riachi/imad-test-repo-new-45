/**
 * PDF Parser Wrapper
 *
 * This module provides a wrapper around pdf-parse to handle test file initialization issues.
 * pdf-parse tries to load a test file during initialization, which can cause errors if it doesn't exist.
 */

import fs from 'fs';
import path from 'path';

// Create the test directory and file if they don't exist
const testDir = './test/data';
const testFile = path.join(testDir, '05-versions-space.pdf');

// Create the directory if it doesn't exist
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
  console.log(`Created directory: ${testDir}`);
}

// Create the test file if it doesn't exist
if (!fs.existsSync(testFile)) {
  // Write a minimal valid PDF file
  const dummyPdfContent = Buffer.from(
    '%PDF-1.3\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000216 00000 n\n0000000300 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n396\n%%EOF',
  );
  fs.writeFileSync(testFile, dummyPdfContent);
  console.log(`Created test file: ${testFile}`);
}

// Instead of importing directly, we'll use a dynamic import function

/**
 * Parse PDF content from a buffer
 *
 * @param buffer PDF file buffer to parse
 * @param options Optional parsing options
 * @returns Parsed PDF data with at least text property
 */
export async function parsePdf(
  buffer: Buffer,
  options?: any,
): Promise<{ text: string; [key: string]: any }> {
  try {
    // Dynamically import pdf-parse only when needed
    // @ts-expect-error - pdf-parse doesn't have TypeScript definitions
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule.default;

    // Parse the PDF
    return await pdfParse(buffer, options);
  } catch (error) {
    console.error('Error loading or using pdf-parse:', error);
    // Return a minimal object with empty text if parsing fails
    return { text: '', error: String(error) };
  }
}
