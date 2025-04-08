import React from 'react';

const DashboardPage = () => {
  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        CV Rewriting Service
      </h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h2 className='mb-4 text-xl font-semibold'>
          Welcome to Your Dashboard
        </h2>
        <p className='mb-6 text-gray-600'>
          Optimize your CV for job applications by following these simple steps:
        </p>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='rounded-md border border-gray-100 bg-gray-50 p-4'>
            <h3 className='mb-2 font-medium'>1. Upload Your CV</h3>
            <p className='text-sm text-gray-500'>
              Upload your existing CV in Word or Google Doc format.
            </p>
          </div>
          <div className='rounded-md border border-gray-100 bg-gray-50 p-4'>
            <h3 className='mb-2 font-medium'>2. Add Job Description</h3>
            <p className='text-sm text-gray-500'>
              Enter the job description you&apos;re applying for.
            </p>
          </div>
          <div className='rounded-md border border-gray-100 bg-gray-50 p-4'>
            <h3 className='mb-2 font-medium'>3. Review & Download</h3>
            <p className='text-sm text-gray-500'>
              Review your optimized CV and download it in your preferred format.
            </p>
          </div>
        </div>
        <div className='mt-8 flex justify-center'>
          <button className='rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
