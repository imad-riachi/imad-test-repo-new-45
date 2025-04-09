'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CvUploadFormProps = {
  onUploadComplete?: (fileData: {
    name: string;
    type: string;
    url: string;
    data?: any;
  }) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  maxSizeMB?: number;
  extractData?: boolean;
};

const CvUploadForm: React.FC<CvUploadFormProps> = ({
  onUploadComplete,
  onUploadError,
  className,
  maxSizeMB = 5, // Default 5MB max size
  extractData = false, // Default: don't extract data
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (selectedFile: File): boolean => {
    setError(null);

    // Validate file size
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return false;
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.google-apps.document', // Google Docs
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError(
        'Invalid file type. Please upload a PDF, Word document, or Google Doc.',
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      // Send the file to the API with the extract parameter if needed
      const uploadUrl = extractData
        ? '/api/cv/upload?extract=true'
        : '/api/cv/upload';

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      setUploadProgress(100);

      const responseData = await response.json();

      if (onUploadComplete) {
        onUploadComplete({
          name: file.name,
          type: file.type,
          url: responseData.url || '',
          data: responseData.data,
        });
      }

      // Reset after success
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
    } catch (error) {
      setUploadProgress(0);
      setUploading(false);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30',
          file ? 'bg-muted/20' : '',
          'hover:border-primary/70 hover:bg-muted/10',
        )}
        onClick={handleBrowseClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          accept='.pdf,.doc,.docx,.gdoc'
        />

        {!file ? (
          <div className='flex flex-col items-center justify-center gap-2 text-center'>
            <UploadIcon className='text-muted-foreground h-10 w-10' />
            <p className='text-lg font-medium'>
              Drag & drop your CV or click to browse
            </p>
            <p className='text-muted-foreground text-sm'>
              Supports PDF, Word documents (.doc, .docx), and Google Docs
            </p>
            <p className='text-muted-foreground text-xs'>
              Maximum file size: {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <FileIcon className='text-primary h-8 w-8' />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{file.name}</p>
              <p className='text-muted-foreground text-xs'>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <div className='text-destructive px-1 text-sm'>{error}</div>}

      {file && !uploading && !error && (
        <div className='flex items-center gap-2'>
          <Button onClick={handleUpload} className='flex-1'>
            Upload CV
          </Button>
          <Button variant='outline' size='icon' onClick={handleRemoveFile}>
            <XIcon className='h-4 w-4' />
          </Button>
        </div>
      )}

      {uploading && (
        <div className='space-y-2'>
          <div className='bg-secondary h-2 w-full overflow-hidden rounded-full'>
            <div
              className='bg-primary h-full transition-all'
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className='text-muted-foreground text-center text-xs'>
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default CvUploadForm;
