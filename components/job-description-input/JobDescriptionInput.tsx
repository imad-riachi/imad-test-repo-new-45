'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export type JobDescriptionInputProps = {
  onSubmit: (jobDescription: string) => Promise<void>;
  isLoading?: boolean;
  minLength?: number;
  maxLength?: number;
};

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onSubmit,
  isLoading = false,
  minLength = 50,
  maxLength = 5000,
}) => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);

    // Clear error when user starts typing again
    if (error) {
      setError(null);
    }
  };

  const validateJobDescription = (): boolean => {
    if (jobDescription.trim().length < minLength) {
      setError(
        `Job description must be at least ${minLength} characters long.`,
      );
      return false;
    }

    if (jobDescription.trim().length > maxLength) {
      setError(`Job description must be less than ${maxLength} characters.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateJobDescription()) {
      return;
    }

    try {
      await onSubmit(jobDescription);
    } catch (err) {
      console.error('Error submitting job description:', err);
      setError(
        'An error occurred while processing your job description. Please try again.',
      );
    }
  };

  const characterCount = jobDescription.trim().length;
  const isValid = characterCount >= minLength && characterCount <= maxLength;

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label
          htmlFor='jobDescription'
          className='block text-sm font-medium text-gray-700'
        >
          Job Description
        </label>
        <textarea
          id='jobDescription'
          value={jobDescription}
          onChange={handleTextChange}
          rows={8}
          className={`w-full rounded-md border p-3 text-gray-900 placeholder-gray-400 focus:ring-1 focus:outline-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder='Paste or type the job description here...'
          aria-describedby='jobDescription-error jobDescription-info'
          disabled={isLoading}
        ></textarea>

        {error && (
          <p id='jobDescription-error' className='text-sm text-red-600'>
            {error}
          </p>
        )}

        <p
          id='jobDescription-info'
          className={`text-xs ${
            !isValid && characterCount > 0 ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {characterCount} / {maxLength} characters
          {characterCount > 0 &&
            characterCount < minLength &&
            ` (minimum ${minLength} characters required)`}
        </p>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={!isValid || isLoading}
          className='bg-blue-600 text-white hover:bg-blue-700'
        >
          {isLoading ? 'Processing...' : 'Optimize My CV'}
        </Button>
      </div>
    </form>
  );
};

export default JobDescriptionInput;
