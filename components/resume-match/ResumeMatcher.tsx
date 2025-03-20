'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { convertToJsonResume } from '@/lib/resume-match/json-converter';
import { adaptResume } from '@/lib/resume-match/llm-service';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { toPng } from 'html-to-image';

// 1. Add a global declaration at the top of your file
declare global {
  interface Window {
    html2pdf: any;
  }
}

export function ResumeMatcher() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobSpecText, setJobSpecText] = useState<string>('');
  const [adaptedResume, setAdaptedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 2. Replace your current useEffect with this:
  useEffect(() => {
    // Check if it's already loaded
    if (window.html2pdf) {
      console.log('html2pdf already available as global');
      return;
    }

    // Load via script tag for better compatibility
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    script.onload = () => {
      console.log('html2pdf loaded successfully via CDN');
    };
    script.onerror = (e) => {
      console.error('Failed to load html2pdf:', e);
    };

    document.head.appendChild(script);

    return () => {
      // Only remove it if we added it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleMatch = async () => {
    if (!cvFile || !jobSpecText.trim()) {
      toast('Missing Information', {
        description: 'Please upload a CV and enter a job specification.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const jsonResume = await convertToJsonResume(cvFile);
      const jobSpec = jobSpecText;
      const adapted = await adaptResume(jsonResume, jobSpec);
      setAdaptedResume(adapted);
    } catch (error) {
      console.error('Error processing resume:', error);
      toast('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'Failed to process the resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!adaptedResume) {
      console.error('No resume content to download');
      toast('Error', { description: 'No content to download' });
      return;
    }

    try {
      console.log('Downloading markdown...');

      // Create blob with UTF-8 encoding for better compatibility
      const blob = new Blob([adaptedResume], {
        type: 'text/markdown;charset=utf-8',
      });

      // Create object URL
      const url = URL.createObjectURL(blob);

      // Create anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'adapted-resume.md';
      a.style.display = 'none'; // Hide the element

      // Append to document, click, and clean up
      document.body.appendChild(a);
      a.click();

      // Small delay before cleanup to ensure download starts
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      toast('Success', { description: 'Markdown file downloaded' });
    } catch (error) {
      console.error('Error downloading markdown:', error);
      toast('Error', { description: 'Failed to download markdown file' });
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) {
      toast('Error', { description: 'Content not available' });
      return;
    }

    try {
      toast('Processing', { description: 'Generating PDF...' });

      // Convert to PNG first (more compatible)
      const dataUrl = await toPng(contentRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });

      // Create PDF from image
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);

      pdf.save('adapted-resume.pdf');
      toast('Success', { description: 'PDF downloaded successfully' });
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast('Error', { description: 'Failed to generate PDF' });
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardContent className='p-6'>
          <div className='grid gap-6 md:grid-cols-1'>
            <div>
              <FileUpload
                accept='.pdf,.doc,.docx'
                label='Upload CV'
                onChange={setCvFile}
                file={cvFile}
              />
            </div>
            <div>
              <FileUpload
                type='textarea'
                label='Job Specification'
                placeholder='Paste the job description here...'
                onChange={setJobSpecText}
                text={jobSpecText}
              />
            </div>
          </div>

          <div className='mt-6 flex justify-center'>
            <Button
              onClick={handleMatch}
              disabled={isLoading}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2 text-white hover:from-blue-700 hover:to-indigo-700'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                'Adapt Resume'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {adaptedResume && (
        <div className='mt-6'>
          <Card>
            <CardContent className='p-6'>
              <div
                ref={contentRef}
                className='prose prose-sm dark:prose-invert max-w-none'
              >
                <ReactMarkdown>{adaptedResume}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <div className='mt-4 flex flex-wrap gap-2'>
            <Button
              id='pdf-download-button'
              onClick={handleDownloadPDF}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              size='sm'
            >
              <FileDown className='h-4 w-4' />
              Download PDF
            </Button>
            <Button
              onClick={handleDownloadMarkdown}
              variant='outline'
              className='flex items-center gap-2'
              size='sm'
            >
              <FileText className='h-4 w-4' />
              Download Markdown
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
