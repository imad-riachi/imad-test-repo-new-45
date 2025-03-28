'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import CVUpload from '@/components/cv-upload';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

type CVFile = {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
};

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingCV, setExistingCV] = useState<CVFile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExistingCV = async () => {
      try {
        const response = await fetch('/api/cv/get-latest');
        const data = await response.json();

        if (data.cv) {
          setExistingCV(data.cv);
        }
      } catch (error) {
        console.error('Error fetching existing CV:', error);
        toast.error('Failed to load your existing CV.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingCV();
  }, []);

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

      // Update the existingCV state with the newly uploaded CV
      setExistingCV({
        id: data.cvId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        createdAt: new Date().toISOString(),
      });

      setFile(null);

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

  const handleDeleteCV = async () => {
    if (!existingCV) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cv/delete?id=${existingCV.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete CV');
      }

      toast.success('CV deleted successfully');
      setExistingCV(null);

      // Clear session storage
      sessionStorage.removeItem('cvId');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete CV. Please try again.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const goBack = () => {
    router.push('/dashboard');
  };

  const goNext = () => {
    if (existingCV) {
      router.push('/dashboard/job-description');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Upload CV</h1>
          <p className='text-muted-foreground mt-2'>
            Upload your CV in Word or Google Doc format.
          </p>
        </div>
        {!isLoading && (
          <div className='flex gap-2'>
            <Button variant='outline' onClick={goBack} className='gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
            {existingCV && (
              <Button variant='outline' onClick={goNext} className='gap-2'>
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className='space-y-6 rounded-lg border p-8'>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='text-primary h-8 w-8 animate-spin' />
            <span className='sr-only'>Loading...</span>
          </div>
        ) : existingCV ? (
          <div className='space-y-4'>
            <div className='rounded-lg border p-4'>
              <div className='flex flex-col space-y-2'>
                <h3 className='text-lg font-medium'>Your Current CV</h3>
                <p className='text-muted-foreground text-sm'>
                  You already have a CV uploaded. You need to delete it before
                  uploading a new one.
                </p>
                <div className='mt-2 flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>{existingCV.fileName}</p>
                    <p className='text-muted-foreground text-xs'>
                      {(existingCV.fileSize / 1024).toFixed(1)} KB • Uploaded on{' '}
                      {new Date(existingCV.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={handleDeleteCV}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Trash2 className='mr-2 h-4 w-4' />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex justify-end'>
              <Button onClick={() => router.push('/dashboard/job-description')}>
                Continue to Job Description
              </Button>
            </div>
          </div>
        ) : (
          <>
            <CVUpload onFileAccepted={handleFileAccepted} />

            {file && (
              <div className='mt-4 flex justify-end'>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
