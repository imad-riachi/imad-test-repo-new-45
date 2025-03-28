'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import JobDescriptionInput from '@/components/job-description';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function JobDescriptionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingJobDescription, setExistingJobDescription] = useState<
    string | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobDescription = async () => {
      try {
        const response = await fetch('/api/job-description');
        const data = await response.json();

        if (data.jobDescription) {
          setExistingJobDescription(data.jobDescription.content);
        }
      } catch (error) {
        console.error('Failed to fetch job description:', error);
        toast.error('Failed to load job description. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDescription();
  }, []);

  const handleJobDescriptionSubmit = async (jobDescription: string) => {
    setIsSubmitting(true);

    try {
      // Store the job description in the database
      const response = await fetch('/api/job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: jobDescription }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save job description');
      }

      // Store the job description in sessionStorage for use in the review page
      sessionStorage.setItem('jobDescription', jobDescription);

      // Navigate to the review page
      router.push('/dashboard/review');
    } catch (error) {
      console.error('Failed to process job description:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to process job description. Please ensure you have uploaded your CV first.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    router.push('/dashboard/upload-cv');
  };

  const goNext = () => {
    if (existingJobDescription) {
      // Store the existing job description in sessionStorage
      sessionStorage.setItem('jobDescription', existingJobDescription);
      router.push('/dashboard/review');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Job Description</h1>
          <p className='text-muted-foreground mt-2'>
            Enter the job description for CV optimization.
          </p>
        </div>
        {!isLoading && (
          <div className='flex gap-2'>
            <Button variant='outline' onClick={goBack} className='gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
            {existingJobDescription && (
              <Button variant='outline' onClick={goNext} className='gap-2'>
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className='rounded-lg border p-8'>
        {isLoading ? (
          <div className='flex h-48 items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
          </div>
        ) : (
          <JobDescriptionInput
            onJobDescriptionSubmit={handleJobDescriptionSubmit}
            isSubmitting={isSubmitting}
            initialJobDescription={existingJobDescription || ''}
          />
        )}
      </div>
    </div>
  );
}
