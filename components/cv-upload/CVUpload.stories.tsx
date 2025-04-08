import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import CVUpload, { CVUploadProps } from './CVUpload';

const meta: Meta<typeof CVUpload> = {
  title: 'Components/CVUpload',
  component: CVUpload,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onFileUpload: { action: 'fileUploaded' },
  },
};

export default meta;
type Story = StoryObj<typeof CVUpload>;

export const Default: Story = {
  args: {
    onFileUpload: fn(),
  },
};

// Mock component with error state for testing display
export const WithError: Story = {
  render: () => {
    return (
      <div className='w-full'>
        <div className='flex flex-col items-center justify-center rounded-md border-2 border-dashed border-red-400 bg-red-50 p-6 transition-colors'>
          <div className='mb-4 text-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mx-auto h-12 w-12 text-red-500'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10'></circle>
              <line x1='12' x2='12' y1='8' y2='12'></line>
              <line x1='12' x2='12.01' y1='16' y2='16'></line>
            </svg>
          </div>
          <div className='mb-2 text-center'>
            <p className='text-sm text-gray-500'>
              Drag and drop your CV file here, or click to browse
            </p>
          </div>
          <p className='mb-2 text-sm text-red-500'>
            Only Word documents (.doc, .docx) and Google Docs are allowed
          </p>
          <button className='bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-ring mt-2 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'>
            Browse Files
          </button>
          <p className='mt-2 text-xs text-gray-500'>
            Supported formats: .doc, .docx, Google Docs
          </p>
        </div>
      </div>
    );
  },
};

export const SuccessfulUpload: Story = {
  render: () => {
    return (
      <div className='w-full'>
        <div className='flex flex-col items-center justify-center rounded-md border-2 border-dashed border-green-400 bg-green-50 p-6 transition-colors'>
          <div className='mb-4 text-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mx-auto h-12 w-12 text-green-500'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10'></circle>
              <path d='m9 12 2 2 4-4'></path>
            </svg>
          </div>
          <div className='mb-2 text-center'>
            <p className='text-sm font-medium'>resume.docx</p>
          </div>
          <p className='mb-2 text-sm text-green-600'>
            File uploaded successfully!
          </p>
          <button className='bg-outline text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-2 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'>
            Browse Files
          </button>
          <p className='mt-2 text-xs text-gray-500'>
            Supported formats: .doc, .docx, Google Docs
          </p>
        </div>
      </div>
    );
  },
};
