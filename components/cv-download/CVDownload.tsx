'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { downloadMarkdown, generatePDF } from '@/lib/cv/conversion';

export type CVDownloadProps = {
  cvContent: string;
  className?: string;
};

const CVDownload: React.FC<CVDownloadProps> = ({
  cvContent,
  className = '',
}) => {
  const handleMarkdownDownload = () => {
    downloadMarkdown(cvContent);
  };

  const handlePdfDownload = () => {
    generatePDF(cvContent);
  };

  if (!cvContent.trim()) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Button onClick={handleMarkdownDownload} className='gap-2'>
        <FileText className='h-4 w-4' />
        Download as Markdown
      </Button>
      <Button onClick={handlePdfDownload} variant='outline' className='gap-2'>
        <Download className='h-4 w-4' />
        Download as PDF
      </Button>
    </div>
  );
};

export default CVDownload;
