import React from 'react';

const JobDescriptionPage = () => {
  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        Enter Job Description
      </h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-6 text-gray-600'>
          Enter the job description you&apos;re applying for to optimize your
          CV.
        </p>
        <div className='mb-6'>
          <label
            htmlFor='jobDescription'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            Job Description
          </label>
          <textarea
            id='jobDescription'
            rows={8}
            className='w-full rounded-md border border-gray-300 p-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
            placeholder='Paste or type the job description here...'
          ></textarea>
        </div>
        <div className='flex justify-end'>
          <button className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
            Optimize My CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionPage;
