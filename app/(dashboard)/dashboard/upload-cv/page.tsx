'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CVUpload } from '@/components/cv-upload';
import { Button } from '@/components/ui/button';

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // In the next ticket, we'll implement the actual API call
      // This is just a placeholder to demonstrate the UI flow
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('CV uploaded successfully!');

      // In a real implementation, we'd navigate to the next step
      // router.push('/dashboard/job-description');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload CV. Please try again.');
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
