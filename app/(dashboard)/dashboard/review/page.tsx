'use client';

import { useState, useEffect } from 'react';
import CVDisplay from '@/components/cv-display';
import CVDownload from '@/components/cv-download';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewrittenCV, setRewrittenCV] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get job description from sessionStorage
    const jobDescription = sessionStorage.getItem('jobDescription');

    if (!jobDescription) {
      setError(
        'No job description found. Please go back and enter a job description.',
      );
      return;
    }

    const callLLMAPI = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/llm/rewrite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobDescription }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to optimize CV');
        }

        const data = await response.json();
        setRewrittenCV(data.rewrittenCV);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setIsLoading(false);
      }
    };

    callLLMAPI();
  }, []);

  const goBack = () => {
    router.push('/dashboard/job-description');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Review & Download
          </h1>
          <p className='text-muted-foreground mt-2'>
            Review and download your optimized CV.
          </p>
        </div>
        <Button variant='outline' onClick={goBack} className='gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>
      </div>

      <div className='rounded-lg border p-6'>
        <CVDisplay
          cvContent={rewrittenCV}
          isLoading={isLoading}
          error={error}
          className='min-h-[400px]'
        />

        {rewrittenCV && !isLoading && !error && (
          <CVDownload cvContent={rewrittenCV} className='mt-6' />
        )}
      </div>
    </div>
  );
}
