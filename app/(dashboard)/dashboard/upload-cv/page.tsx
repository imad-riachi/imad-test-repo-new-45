'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CVUpload } from '@/components/cv-upload';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload CV');
      }

      toast.success('CV uploaded successfully!');

      // Store the CV ID in session storage for the next step
      sessionStorage.setItem('cvId', data.cvId);

      // Navigate to the next step
      router.push('/dashboard/job-description');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to upload CV. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Upload CV</h1>
        <p className='text-muted-foreground mt-2'>
          Upload your CV in Word or Google Doc format.
        </p>
      </div>

      <div className='space-y-6 rounded-lg border p-8'>
        <CVUpload onFileAccepted={handleFileAccepted} />

        {file && (
          <div className='mt-4 flex justify-end'>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
