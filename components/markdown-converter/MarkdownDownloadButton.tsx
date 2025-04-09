'use client';

import React from 'react';
import { CVData } from '@/components/cv-display';

export type MarkdownDownloadButtonProps = {
  cv: CVData | null;
  className?: string;
  filename?: string;
  buttonText?: string;
  onMarkdownDownload?: (data: {
    cv?: CVData | null;
    filename?: string;
  }) => void;
};

const MarkdownDownloadButton: React.FC<MarkdownDownloadButtonProps> = ({
  cv,
  className = 'rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50',
  filename = 'optimized_cv.md',
  buttonText = 'Download as Markdown',
  onMarkdownDownload,
}) => {
  return (
    <button
      onClick={() => {
        onMarkdownDownload?.({ cv, filename });
      }}
      disabled={!cv}
      className={className}
      aria-label='Download CV as Markdown'
    >
      {buttonText}
    </button>
  );
};

export default MarkdownDownloadButton;
