import React from 'react';

const ReviewPage = () => {
  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        Review & Download Your CV
      </h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-6 text-gray-600'>
          Your CV has been optimized based on the job description.
        </p>

        <div className='mb-8 rounded-md border border-gray-200 p-4'>
          <h2 className='mb-4 text-xl font-semibold'>Optimized CV Preview</h2>
          <div className='h-64 overflow-y-auto rounded-md bg-gray-50 p-4'>
            <p className='text-gray-400 italic'>
              (Your optimized CV will appear here after processing)
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row sm:justify-end'>
          <button className='rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300'>
            Download as Markdown
          </button>
          <button className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
