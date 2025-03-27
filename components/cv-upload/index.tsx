'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/msword', // doc
  'application/vnd.google-apps.document', // Google Doc
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export type CVUploadProps = {
  onFileAccepted: (file: File) => void;
  className?: string;
  initialFile?: File | null;
};

export function CVUpload({
  onFileAccepted,
  className,
  initialFile,
}: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError(
        'Invalid file type. Please upload a Word document (.doc, .docx) or Google Doc.',
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileAccepted(selectedFile);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileAccepted(droppedFile);
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

  useEffect(() => {
    if (initialFile) {
      if (validateFile(initialFile)) {
        setFile(initialFile);
        onFileAccepted(initialFile);
      }
    }
  }, [initialFile, onFileAccepted]);

  return (
    <div className={cn('w-full', className)}>
      {!file ? (
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
            'transition-colors duration-200',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/50',
            error && 'border-destructive bg-destructive/5',
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type='file'
            className='hidden'
            onChange={handleFileChange}
            accept='.doc,.docx,.gdoc'
          />

          <div className='flex flex-col items-center justify-center space-y-4 py-4'>
            {error ? (
              <div className='bg-destructive/10 text-destructive rounded-full p-3'>
                <AlertCircle className='h-6 w-6' />
              </div>
            ) : (
              <div className='bg-primary/10 text-primary rounded-full p-3'>
                <UploadCloud className='h-6 w-6' />
              </div>
            )}

            <div className='space-y-1 text-center'>
              <p className='text-sm font-medium'>
                {error || 'Drag and drop your CV file'}
              </p>
              <p className='text-muted-foreground text-xs'>
                Supported formats: Word (.doc, .docx) or Google Doc
              </p>
            </div>

            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              className='mt-2'
            >
              Select File
            </Button>
          </div>
        </div>
      ) : (
        <div className='rounded-lg border p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='bg-primary/10 text-primary rounded-full p-2'>
                <FileText className='h-5 w-5' />
              </div>
              <div>
                <p className='max-w-[200px] truncate text-sm font-medium'>
                  {file.name}
                </p>
                <p className='text-muted-foreground text-xs'>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleRemoveFile}
              className='text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Remove file</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
