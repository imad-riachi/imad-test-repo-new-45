'use client';

import { useState, useEffect } from 'react';
import JobDescriptionInput from '@/components/job-description-input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const JobDescriptionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);
  const router = useRouter();

  // Get selected CV ID from sessionStorage on component mount
  useEffect(() => {
    const storedCvId = sessionStorage.getItem('selectedCvId');
    if (storedCvId) {
      setSelectedCvId(storedCvId);
    } else {
      // If no CV was selected, redirect to upload page
      toast.error('No CV selected', {
        description: 'Please upload or select a CV first.',
      });
      router.push('/dashboard/upload');
    }
  }, [router]);

  const handleSubmit = async (jobDescription: string) => {
    setIsLoading(true);

    try {
      // Ensure we have a selected CV
      if (!selectedCvId) {
        toast.error('No CV selected', {
          description: 'Please upload or select a CV first.',
        });
        router.push('/dashboard/upload');
        return;
      }

      // Call the API to rewrite the CV
      const response = await fetch('/api/llm/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: selectedCvId,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize CV');
      }

      const result = await response.json();

      // Store the rewritten CV in sessionStorage for the review page
      sessionStorage.setItem(
        'rewrittenCV',
        JSON.stringify(result.data.rewrittenCV),
      );
      sessionStorage.setItem('jobDescription', jobDescription);

      toast.success('CV Successfully Optimized', {
        description: 'Your CV has been optimized for the job description.',
      });

      // Navigate to the review page
      router.push('/dashboard/review');
    } catch (error) {
      console.error('Error submitting job description:', error);
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'There was an error processing your job description. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        Enter Job Description
      </h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-6 text-gray-600'>
          Enter the job description you&apos;re applying for to optimize your
          CV. We&apos;ll use this information to tailor your CV to match the job
          requirements.
        </p>
        <JobDescriptionInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          minLength={50}
          maxLength={5000}
        />
      </div>
    </div>
  );
};

export default JobDescriptionPage;
