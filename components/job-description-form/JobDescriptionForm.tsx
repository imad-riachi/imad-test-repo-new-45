'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CvData } from '@/lib/cv-parser/cv-parser';

export interface JobDescriptionFormProps {
  cvData: CvData;
  onRewriteComplete?: (rewriteResponse: {
    originalCv: CvData;
    rewrittenCv: CvData;
    jobDescription: string;
    matches: {
      skills: string[];
      experience: string[];
    };
    improvements: string[];
  }) => void;
  onRewriteError?: (error: string) => void;
  className?: string;
}

const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  cvData,
  onRewriteComplete,
  onRewriteError,
  className,
}) => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);

  // Update word count when job description changes
  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setJobDescription(value);
    setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (wordCount < 10) {
      setError(
        'Please provide a more detailed job description (at least 10 words)',
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Send the data to the API
      const response = await fetch('/api/cv/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to rewrite CV');
      }

      const rewriteResponse = await response.json();

      // Call the callback if provided
      if (onRewriteComplete) {
        onRewriteComplete(rewriteResponse);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';

      setError(errorMessage);

      if (onRewriteError) {
        onRewriteError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className='space-y-2'>
        <Label htmlFor='jobDescription' className='text-base font-medium'>
          Job Description
        </Label>
        <Textarea
          id='jobDescription'
          placeholder='Paste the job description here...'
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          className='min-h-32 resize-y'
          disabled={isSubmitting}
        />
        <div className='text-muted-foreground flex items-center justify-between text-xs'>
          <div>
            <span>{wordCount}</span> words
          </div>
          {wordCount < 10 && wordCount > 0 && (
            <div className='flex items-center gap-1 text-amber-500'>
              <AlertCircle className='h-3 w-3' />
              <span>Add more details for better results</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className='text-destructive flex items-center gap-1 px-1 text-sm'>
          <AlertCircle className='h-3 w-3' />
          <span>{error}</span>
        </div>
      )}

      <Button
        type='submit'
        className='w-full'
        disabled={isSubmitting || wordCount < 10}
      >
        {isSubmitting ? 'Optimizing CV...' : 'Optimize CV for This Job'}
      </Button>

      <p className='text-muted-foreground text-center text-xs'>
        Our AI will rewrite your CV to highlight relevant skills and experience
        for this job
      </p>
    </form>
  );
};

export default JobDescriptionForm;
