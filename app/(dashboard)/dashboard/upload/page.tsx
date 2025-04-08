import React from 'react';

const UploadPage = () => {
  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>Upload Your CV</h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-6 text-gray-600'>
          Upload your CV file to begin optimization.
        </p>
        <div className='flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-12'>
          <div className='text-center'>
            <p className='text-sm text-gray-500'>
              Drag and drop your file here, or click to browse
            </p>
            <button className='mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
