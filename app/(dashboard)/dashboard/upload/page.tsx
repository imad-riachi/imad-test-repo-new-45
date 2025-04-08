'use client';

import React, { useState } from 'react';
import CVUpload from '@/components/cv-upload';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    // In a real implementation, we would send the file to the server here
    console.log('File uploaded:', file.name);
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

        {uploadedFile && (
          <div className='mt-6 rounded-md bg-green-50 p-4'>
            <p className='font-medium text-green-800'>
              Ready for the next step!
            </p>
            <p className='mt-2 text-sm text-green-700'>
              &ldquo;{uploadedFile.name}&rdquo; has been uploaded successfully.
              Move to the next step to enter the job description.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
