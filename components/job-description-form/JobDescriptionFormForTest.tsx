// This is a simplified version of JobDescriptionForm for testing purposes
// In a real app, you shouldn't need this workaround

import React, { useState } from 'react';

// Mock types
interface CvData {
  name: string;
  contactInfo: {
    email: string;
  };
  workExperience: any[];
  education: any[];
  skills: any[];
}

interface RewriteResponse {
  originalCv: CvData;
  rewrittenCv: CvData;
  jobDescription: string;
  matches: { skills: any[]; experience: any[] };
  improvements: any[];
}

// Mock UI components
const Button = (props: any) => <button {...props}>{props.children}</button>;
const Card = (props: any) => (
  <div className={props.className}>{props.children}</div>
);
const CardHeader = (props: any) => <div>{props.children}</div>;
const CardTitle = (props: any) => <h3>{props.children}</h3>;
const CardContent = (props: any) => <div>{props.children}</div>;
const CardFooter = (props: any) => <div>{props.children}</div>;
const Textarea = (props: any) => <textarea {...props} />;

interface JobDescriptionFormProps {
  cvData: CvData;
  onRewriteComplete?: (response: RewriteResponse) => void;
  onRewriteError?: (message: string) => void;
  className?: string;
}

const JobDescriptionFormForTest: React.FC<JobDescriptionFormProps> = ({
  cvData,
  onRewriteComplete,
  onRewriteError,
  className,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);

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

export default JobDescriptionFormForTest;
