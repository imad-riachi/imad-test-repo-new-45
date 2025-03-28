'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

export type JobDescriptionInputProps = {
  onJobDescriptionSubmit: (jobDescription: string) => void;
  isSubmitting?: boolean;
  className?: string;
  initialJobDescription?: string;
};

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobDescriptionSubmit,
  isSubmitting = false,
  className,
  initialJobDescription = '',
}) => {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update the job description when the initial value changes
  useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription]);

  const MIN_LENGTH = 50;
  const MAX_LENGTH = 5000;

  const validateJobDescription = (text: string): boolean => {
    setError(null);

    if (text.trim().length < MIN_LENGTH) {
      setError(`Job description must be at least ${MIN_LENGTH} characters.`);
      return false;
    }

    if (text.length > MAX_LENGTH) {
      setError(`Job description must be less than ${MAX_LENGTH} characters.`);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateJobDescription(jobDescription)) {
      onJobDescriptionSubmit(jobDescription);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className='space-y-4'>
        <div>
          <Textarea
            ref={textareaRef}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Enter the job description here...'
            className='min-h-[200px] resize-y'
            disabled={isSubmitting}
          />
          <div className='text-muted-foreground mt-2 flex justify-between text-xs'>
            <span>
              {jobDescription.length} / {MAX_LENGTH} characters
            </span>
            <span>Min {MIN_LENGTH} characters</span>
          </div>
        </div>

        {error && (
          <div className='bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm'>
            <AlertCircle className='h-4 w-4' />
            <p>{error}</p>
          </div>
        )}

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting ? 'Processing...' : 'Optimize My CV'}
        </Button>
      </div>
    </form>
  );
};

export default JobDescriptionInput;
