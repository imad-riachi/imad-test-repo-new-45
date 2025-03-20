import React from 'react';
import { ResumeMatcher } from '@/components/resume-match/ResumeMatcher';

export const metadata = {
  title: 'Resume Match - AI-Powered Resume Adaptation',
  description: 'Adapt your resume to job specifications with AI assistance',
};

export default function ResumePage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 dark:from-gray-900 dark:to-gray-950'>
      <div className='container mx-auto'>
        <header className='mb-8 text-center'>
          <h1 className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent'>
            Resume Match
          </h1>
          <p className='text-muted-foreground mt-2 text-lg'>
            Tailor your resume to match job specifications with AI
          </p>
        </header>

        <ResumeMatcher />
      </div>
    </div>
  );
}
