/**
 * Utility functions for converting CV content to different formats
 */

import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

/**
 * Converts CV content to Markdown format
 */
export const convertToMarkdown = (cvContent: string): string => {
  // Preserve line breaks and formatting
  return cvContent;
};

/**
 * Generates a downloadable Markdown file
 */
export const downloadMarkdown = (
  cvContent: string,
  filename = 'optimized-cv.md',
): void => {
  const markdownContent = convertToMarkdown(cvContent);
  const blob = new Blob([markdownContent], {
    type: 'text/markdown;charset=utf-8',
  });
  saveAs(blob, filename);
};

/**
 * Generates a PDF file from CV content
 */
export const generatePDF = (
  cvContent: string,
  filename = 'optimized-cv.pdf',
): void => {
  const doc = new jsPDF();

  // Split content into lines
  const lines = cvContent.split('\n');

  // Set initial y position
  let yPos = 20;

  // Add title
  doc.setFontSize(16);
  doc.text('Optimized CV', 105, yPos, { align: 'center' });
  yPos += 10;

  // Reset font size for content
  doc.setFontSize(12);

  // Process each line
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) {
      yPos += 7;
      continue;
    }

    // Check if we need a new page
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }

    // Add text with word wrapping
    const textLines = doc.splitTextToSize(line, 180);
    doc.text(textLines, 15, yPos);
    yPos += 7 * textLines.length;
  }

  // Save the PDF
  doc.save(filename);
};
