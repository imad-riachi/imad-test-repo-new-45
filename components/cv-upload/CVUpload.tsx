'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileUp, CheckCircle2 } from 'lucide-react';

export type CVUploadProps = {
  onFileUpload: (file: File) => void;
  className?: string;
};

const CVUpload: React.FC<CVUploadProps> = ({ onFileUpload, className }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/vnd.google-apps.document', // Google Doc
  ];

  const validateFile = (file: File): boolean => {
    if (!allowedFileTypes.includes(file.type)) {
      setError('Only Word documents (.doc, .docx) and Google Docs are allowed');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError('File size should not exceed 10MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setIsSuccess(false);
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileUpload(selectedFile);
      setIsSuccess(true);
    } else {
      setFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700',
          error
            ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
            : '',
          isSuccess
            ? 'border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20'
            : '',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.google-apps.document'
        />

        <div className='mb-4 text-center'>
          {isSuccess ? (
            <CheckCircle2 className='mx-auto h-12 w-12 text-green-500 dark:text-green-400' />
          ) : error ? (
            <AlertCircle className='mx-auto h-12 w-12 text-red-500 dark:text-red-400' />
          ) : (
            <FileUp className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
          )}
        </div>

        <div className='mb-2 text-center'>
          {file ? (
            <p className='text-sm font-medium dark:text-white'>{file.name}</p>
          ) : (
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Drag and drop your CV file here, or click to browse
            </p>
          )}
        </div>

        {error && (
          <p className='mb-2 text-sm text-red-500 dark:text-red-400'>{error}</p>
        )}

        {isSuccess && (
          <p className='mb-2 text-sm text-green-600 dark:text-green-400'>
            File uploaded successfully!
          </p>
        )}

        <Button
          type='button'
          onClick={handleBrowseClick}
          variant={error ? 'destructive' : isSuccess ? 'outline' : 'default'}
          className='mt-2'
        >
          Browse Files
        </Button>

        <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
          Supported formats: .doc, .docx, Google Docs
        </p>
      </div>
    </div>
  );
};

export default CVUpload;
