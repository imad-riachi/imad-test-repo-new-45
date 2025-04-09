'use client';

import { useState } from 'react';
import CvUploadForm from '@/components/cv-upload-form';
import JobDescriptionForm from '@/components/job-description-form';
import CvRewrittenDisplay from '@/components/cv-rewritten-display';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { RewriteResponse } from '@/lib/cv-rewriter/rewriter';

export default function DashboardPage() {
  const [extractedCvData, setExtractedCvData] = useState<CvData | null>(null);
  const [rewriteResponse, setRewriteResponse] =
    useState<RewriteResponse | null>(null);

  const handleUploadComplete = (fileData: {
    name: string;
    type: string;
    url: string;
    data?: any;
  }) => {
    if (fileData.data) {
      setExtractedCvData(fileData.data);
      // Reset rewrite response when new CV is uploaded
      setRewriteResponse(null);
    }
  };

  const handleRewriteComplete = (response: RewriteResponse) => {
    setRewriteResponse(response);
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='space-y-12'>
        {/* Welcome Section */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            CV Assistant
          </h1>
          <p className='text-muted-foreground text-lg'>
            Upload your CV and let&apos;s optimize it for job applications.
          </p>
        </div>

        {/* Step 1: CV Upload Section */}
        {!extractedCvData && (
          <div className='max-w-xl space-y-4'>
            <div className='bg-card rounded-lg border p-6 shadow-sm'>
              <h2 className='mb-4 text-2xl font-semibold'>
                Step 1: Upload Your CV
              </h2>
              <CvUploadForm
                onUploadComplete={handleUploadComplete}
                extractData={true}
              />
            </div>
          </div>
        )}

        {/* Step 2: Job Description Form */}
        {extractedCvData && !rewriteResponse && (
          <div className='max-w-xl space-y-4'>
            <div className='bg-card rounded-lg border p-6 shadow-sm'>
              <h2 className='mb-4 text-2xl font-semibold'>
                Step 2: Enter Job Description
              </h2>
              <p className='text-muted-foreground mb-6'>
                Paste the job description to optimize your CV for this specific
                role.
              </p>
              <JobDescriptionForm
                cvData={extractedCvData}
                onRewriteComplete={handleRewriteComplete}
              />
            </div>
          </div>
        )}

        {/* Step 3: Rewritten CV Display */}
        {rewriteResponse && (
          <div className='space-y-6'>
            <div className='bg-card rounded-lg border p-6 shadow-sm'>
              <h2 className='mb-4 text-2xl font-semibold'>
                Step 3: Review Your Optimized CV
              </h2>
              <CvRewrittenDisplay rewriteResponse={rewriteResponse} />
            </div>

            <div className='flex gap-4'>
              <button
                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium'
                onClick={() => setRewriteResponse(null)}
              >
                Try Another Job Description
              </button>
              <button
                className='hover:bg-secondary hover:text-secondary-foreground border-input rounded-md border px-4 py-2 text-sm font-medium'
                onClick={() => {
                  setExtractedCvData(null);
                  setRewriteResponse(null);
                }}
              >
                Upload a Different CV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
