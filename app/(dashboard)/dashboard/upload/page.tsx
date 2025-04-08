'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CVUpload from '@/components/cv-upload';

const UploadPage = () => {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setUploadError(null);
    setIsUploading(true);

    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to our API endpoint
      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload CV');
      }

      // Handle successful upload
      setUploadSuccess(true);

      // Redirect to the job description page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/job-description');
      }, 2000);
    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>Upload Your CV</h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-6 text-gray-600'>
          Upload your CV file to begin optimization. We accept Word documents
          (.doc, .docx) and Google Docs.
        </p>

        <CVUpload onFileUpload={handleFileUpload} />

        {isUploading && (
          <div className='mt-6 rounded-md bg-blue-50 p-4'>
            <p className='font-medium text-blue-800'>Uploading your CV...</p>
            <p className='mt-2 text-sm text-blue-700'>
              Please wait while we process your document.
            </p>
          </div>
        )}

        {uploadError && (
          <div className='mt-6 rounded-md bg-red-50 p-4'>
            <p className='font-medium text-red-800'>Error uploading your CV</p>
            <p className='mt-2 text-sm text-red-700'>{uploadError}</p>
          </div>
        )}

        {uploadSuccess && (
          <div className='mt-6 rounded-md bg-green-50 p-4'>
            <p className='font-medium text-green-800'>
              Ready for the next step!
            </p>
            <p className='mt-2 text-sm text-green-700'>
              &ldquo;{uploadedFile?.name}&rdquo; has been uploaded successfully.
              Redirecting to the next step...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
