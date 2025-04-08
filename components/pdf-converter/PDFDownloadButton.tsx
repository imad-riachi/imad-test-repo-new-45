'use client';

import React from 'react';
import { CVData } from '@/components/cv-display';
import { generatePDFFromCV, downloadPDF } from '@/lib/utils/pdf-generator';

export type PDFDownloadButtonProps = {
  cv: CVData | null;
  className?: string;
  filename?: string;
  buttonText?: string;
};

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  cv,
  className = 'rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
  filename = 'optimized_cv.pdf',
  buttonText = 'Download as PDF',
}) => {
  const handleDownload = () => {
    if (!cv) return;

    const pdfBlob = generatePDFFromCV(cv);
    downloadPDF(pdfBlob, filename);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!cv}
      className={className}
      aria-label='Download CV as PDF'
    >
      {buttonText}
    </button>
  );
};

export default PDFDownloadButton;
