'use client';

import React, { useState } from 'react';
import {
  FileUp,
  BriefcaseBusiness,
  CheckCircle,
  AlertCircle,
  File,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type FileUploadProps = {
  label: string;
  accept?: string;
  type?: 'file' | 'textarea';
  placeholder?: string;
  onChange: (fileOrText: File | string) => void;
  file?: File | null;
  text?: string;
};

export function FileUpload({
  label,
  accept = '.pdf,.doc,.docx',
  type = 'file',
  placeholder = 'Paste the job description here...',
  onChange,
  file,
  text,
}: FileUploadProps) {
  const [cvFile, setCvFile] = useState<File | null>(file || null);
  const [error, setError] = useState<string | null>(null);

  const handleCVUpload = (file: File) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setError(null);
    setCvFile(file);
    onChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleCVUpload(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleCVUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Render file upload UI
  if (type === 'file') {
    return (
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <FileUp className='h-5 w-5 text-blue-600' />
          <label className='font-medium'>{label}</label>
          <span className='text-sm text-slate-500'>
            ({accept.replace(/\./g, '').toUpperCase()})
          </span>
        </div>

        <div
          className={`relative flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {cvFile ? (
            <div className='text-center'>
              <p className='font-medium text-slate-900 dark:text-slate-200'>
                {cvFile.name}
              </p>
              <p className='text-sm text-slate-500'>
                {(cvFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className='text-center'>
              <p className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                Drag and drop your CV here
              </p>
              <p className='mt-1 text-xs text-slate-500'>or browse files</p>
            </div>
          )}

          <input
            id='file-upload'
            type='file'
            accept={accept}
            onChange={handleFileChange}
            className='hidden'
          />

          {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
        </div>
      </div>
    );
  }

  // Render textarea UI
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <BriefcaseBusiness className='h-5 w-5 text-blue-600' />
        <label className='font-medium'>{label}</label>
        <span className='text-sm text-slate-500'>
          (Copy and paste job listing)
        </span>
      </div>
      <Textarea
        placeholder={placeholder}
        className='min-h-32 resize-y'
        value={text}
        onChange={handleTextChange}
      />
    </div>
  );
}
