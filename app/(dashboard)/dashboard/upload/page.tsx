'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CVUpload from '@/components/cv-upload';
import CVList, { CVFile } from '@/components/cv-list';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

const UploadPage = () => {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // State for previously uploaded CVs
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user's CVs
  const fetchCVs = async () => {
    setIsLoading(true);
    setLoadingError(null);

    try {
      const response = await fetch('/api/cv');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch CVs');
      }

      setCvFiles(data.files || []);

      // If there are files and none is selected, select the most recent one
      if (data.files?.length > 0 && !selectedFileId) {
        setSelectedFileId(data.files[0].fileId);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
      setLoadingError(
        error instanceof Error ? error.message : 'Failed to load your CVs',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a CV
  const handleDeleteCV = async (id: number) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete CV');
      }

      // Remove the deleted CV from the list
      setCvFiles((prev) => prev.filter((cv) => cv.id !== id));

      // If the deleted CV was selected, clear the selection
      if (
        selectedFileId &&
        cvFiles.find((cv) => cv.id === id)?.fileId === selectedFileId
      ) {
        setSelectedFileId(undefined);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete CV');
    } finally {
      setIsDeleting(false);
    }
  };

  // Select a CV
  const handleSelectCV = (fileId: string) => {
    setSelectedFileId(fileId);

    // If a CV is already selected and job description page is ready,
    // we could auto-navigate to it
    router.push('/dashboard/job-description');
  };

  // Upload a new CV
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setUploadError(null);
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to our API endpoint
      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload CV');
      }

      // Handle successful upload
      setUploadSuccess(true);

      // Refresh the CV list to include the new upload
      await fetchCVs();

      // Redirect to the job description page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/job-description');
      }, 2000);
    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch CVs on initial load
  useEffect(() => {
    fetchCVs();
  }, []);

  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>Upload Your CV</h1>

      {/* Previously uploaded CVs section */}
      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Your CVs</h2>
          <Button
            variant='outline'
            size='sm'
            onClick={fetchCVs}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='mr-2 h-4 w-4' />
            )}
            Refresh
          </Button>
        </div>

        {isLoading && (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
          </div>
        )}

        {loadingError && (
          <div className='mb-4 rounded-md bg-red-50 p-4'>
            <div className='flex'>
              <AlertCircle className='mr-2 h-5 w-5 text-red-400' />
              <p className='text-sm text-red-700'>{loadingError}</p>
            </div>
          </div>
        )}

        {!isLoading && !loadingError && cvFiles.length === 0 && (
          <p className='py-8 text-center text-gray-500'>
            You haven&apos;t uploaded any CVs yet.
          </p>
        )}

        <CVList
          files={cvFiles}
          onDelete={handleDeleteCV}
          onSelect={handleSelectCV}
          selectedFileId={selectedFileId}
          className='mt-4'
        />
      </div>

      {/* Upload new CV section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h2 className='mb-4 text-xl font-semibold'>Upload a New CV</h2>
        <p className='mb-6 text-gray-600'>
          Upload your CV file to begin optimization. We accept Word documents
          (.doc, .docx) and Google Docs.
        </p>

        <CVUpload onFileUpload={handleFileUpload} />

        {isUploading && (
          <div className='mt-6 rounded-md bg-blue-50 p-4'>
            <p className='font-medium text-blue-800'>Uploading your CV...</p>
            <p className='mt-2 text-sm text-blue-700'>
              Please wait while we process your document.
            </p>
          </div>
        )}

        {uploadError && (
          <div className='mt-6 rounded-md bg-red-50 p-4'>
            <p className='font-medium text-red-800'>Error uploading your CV</p>
            <p className='mt-2 text-sm text-red-700'>{uploadError}</p>
          </div>
        )}

        {uploadSuccess && (
          <div className='mt-6 rounded-md bg-green-50 p-4'>
            <p className='font-medium text-green-800'>
              Ready for the next step!
            </p>
            <p className='mt-2 text-sm text-green-700'>
              &ldquo;{uploadedFile?.name}&rdquo; has been uploaded successfully.
              Redirecting to the next step...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
