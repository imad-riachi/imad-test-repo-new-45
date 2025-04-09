'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { RewriteResponse } from '@/lib/cv-rewriter/rewriter';

export interface JobDescriptionFormProps {
  /** The CV data that will be optimized */
  cvData: CvData;
  /** Optional callback for when rewrite is complete */
  onRewriteComplete?: (response: RewriteResponse) => void;
  /** Optional callback for handling errors */
  onRewriteError?: (message: string) => void;
  /** Optional class name for the form */
  className?: string;
}

/**
 * Form for entering a job description to optimize a CV
 */
const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  cvData,
  onRewriteComplete,
  onRewriteError,
  className,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count when job description changes
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setJobDescription(value);
    setError(null);

    // Count words
    const words = value.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  // Validate and submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setError(null);

    // Validate input
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    // Check word count (minimum 10 words)
    const words = jobDescription.trim().split(/\s+/).filter(Boolean);
    if (words.length < 10) {
      setError(
        'Please provide a more detailed job description (at least 10 words)',
      );
      return;
    }

    // Start submission
    setIsSubmitting(true);

    try {
      // Call the API
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
        throw new Error('Failed to rewrite CV');
      }

      // Parse the response
      const data = await response.json();

      // Call the success callback if provided
      if (onRewriteComplete) {
        onRewriteComplete(data);
      }
    } catch (error) {
      console.error('Error submitting job description:', error);

      // Set error message
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);

      // Call the error callback if provided
      if (onRewriteError) {
        onRewriteError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label
                htmlFor='jobDescription'
                className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Job Description
              </label>
              <Textarea
                id='jobDescription'
                placeholder='Paste the job description here to optimize your CV for this specific job'
                value={jobDescription}
                onChange={handleDescriptionChange}
                rows={8}
                disabled={isSubmitting}
                className='resize-none'
              />
              <div className='text-muted-foreground flex justify-between text-xs'>
                <span>{wordCount} words</span>
                {wordCount < 10 && wordCount > 0 && (
                  <span className='text-amber-500'>
                    Add at least {10 - wordCount} more words
                  </span>
                )}
              </div>
              {error && (
                <p className='text-destructive text-sm font-medium'>{error}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Optimizing...' : 'Optimize CV for this job'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JobDescriptionForm;
