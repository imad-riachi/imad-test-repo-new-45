'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export type CVDisplayProps = {
  cvContent: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
};

const CVDisplay: React.FC<CVDisplayProps> = ({
  cvContent,
  isLoading = false,
  error = null,
  className = '',
}) => {
  // Function to format CV content with line breaks
  const formatContent = (content: string): React.ReactNode => {
    // Split by double newlines for paragraphs
    return content.split('\n\n').map((paragraph, i) => (
      <React.Fragment key={i}>
        {paragraph.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {line}
            {j < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
        {i < content.split('\n\n').length - 1 && <p className='my-4' />}
      </React.Fragment>
    ));
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-20 w-5/6' />
        <Skeleton className='h-24 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-4 ${className}`}
      >
        <AlertCircle className='h-5 w-5' />
        <p>{error}</p>
      </div>
    );
  }

  if (!cvContent.trim()) {
    return (
      <div
        className={`text-muted-foreground flex justify-center p-8 ${className}`}
      >
        <p>No CV content available. Please complete the previous steps.</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-background rounded-lg border p-6 whitespace-pre-wrap ${className}`}
    >
      <div className='prose prose-sm dark:prose-invert max-w-none'>
        {formatContent(cvContent)}
      </div>
    </div>
  );
};

export default CVDisplay;
