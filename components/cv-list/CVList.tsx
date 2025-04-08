'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type CVFile = {
  id: number;
  fileId: string;
  filename: string;
  uploadedAt: string;
};

export type CVListProps = {
  files: CVFile[];
  onDelete: (id: number) => void;
  onSelect: (fileId: string) => void;
  selectedFileId?: string;
  className?: string;
};

const CVList: React.FC<CVListProps> = ({
  files,
  onDelete,
  onSelect,
  selectedFileId,
  className,
}) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <h3 className='mb-2 text-lg font-medium'>Your Uploaded CVs</h3>
      <div className='space-y-2'>
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              'flex items-center justify-between rounded-md border p-3 transition-colors',
              selectedFileId === file.fileId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50',
            )}
          >
            <div
              className='flex flex-1 cursor-pointer items-center gap-3'
              onClick={() => onSelect(file.fileId)}
            >
              <FileText className='h-5 w-5 text-gray-500' />
              <div className='flex-1'>
                <p className='font-medium'>{file.filename}</p>
                <p className='text-xs text-gray-500'>
                  Uploaded {formatDistanceToNow(new Date(file.uploadedAt))} ago
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
              className='text-red-500 hover:bg-red-50 hover:text-red-600'
            >
              <Trash2 className='h-4 w-4' />
              <span className='sr-only'>Delete</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVList;
