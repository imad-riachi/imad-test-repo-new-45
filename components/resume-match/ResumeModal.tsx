'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { FileDown, X, FileText, Download } from 'lucide-react';

export interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function ResumeModal({ isOpen, onClose, content }: ResumeModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [html2pdfLib, setHtml2pdfLib] = useState<any>(null);

  // Dynamically import html2pdf only on client side
  useEffect(() => {
    import('html2pdf.js')
      .then((module) => {
        setHtml2pdfLib(module.default);
      })
      .catch((err) => {
        console.error('Failed to load PDF library:', err);
      });
  }, []);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adapted-resume.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!contentRef.current || !html2pdfLib) {
      console.error('PDF generation is not available yet');
      return;
    }

    const element = contentRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'adapted-resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdfLib().set(opt).from(element).save();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[80vh] max-w-4xl'>
        <DialogHeader className='flex flex-row items-center justify-between'>
          <DialogTitle>Adapted Resume</DialogTitle>
          <DialogClose asChild>
            <Button variant='ghost' size='icon'>
              <X className='h-4 w-4' />
            </Button>
          </DialogClose>
        </DialogHeader>

        <ScrollArea className='flex-1 rounded-md border p-6'>
          <div
            ref={contentRef}
            className='prose prose-sm dark:prose-invert max-w-none'
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </ScrollArea>

        <div className='mt-4 flex justify-between'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex items-center gap-2'
          >
            Close
          </Button>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={handleDownloadMarkdown}
              className='flex items-center gap-2'
            >
              <FileText className='h-4 w-4' />
              Download Markdown
            </Button>

            <Button
              onClick={handleDownloadPDF}
              disabled={!html2pdfLib}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            >
              <FileDown className='h-4 w-4' />
              Download PDF
            </Button>

            <Button
              onClick={handleDownloadMarkdown}
              className='flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600'
            >
              <Download className='h-4 w-4' />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
