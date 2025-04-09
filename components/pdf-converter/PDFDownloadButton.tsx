'use client';

import React from 'react';
import { CVData } from '@/components/cv-display';

export type PDFDownloadButtonProps = {
  cv: CVData | null;
  className?: string;
  filename?: string;
  buttonText?: string;
  onPDFDownload?: (data: { cv?: CVData | null; filename?: string }) => void;
};

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  cv,
  className = 'rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
  filename = 'optimized_cv.pdf',
  buttonText = 'Download as PDF',
  onPDFDownload,
}) => {
  return (
    <button
      onClick={() => {
        onPDFDownload?.({ cv, filename });
      }}
      disabled={!cv}
      className={className}
      aria-label='Download CV as PDF'
    >
      {buttonText}
    </button>
  );
};

export default PDFDownloadButton;
