'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export type CVFile = {
  id: number;
  fileId: string;
  filename: string;
  uploadedAt: string;
  status?: 'processed' | 'pending' | 'error';
};

export type CVListProps = {
  files: CVFile[];
  onDelete: (id: number) => void;
  onSelect: (fileId: string) => void;
  selectedFileId?: string;
  className?: string;
  isDeleting?: boolean;
};

const CVList: React.FC<CVListProps> = ({
  files,
  onDelete,
  onSelect,
  selectedFileId,
  className,
  isDeleting = false,
}) => {
  if (files.length === 0) {
    return null;
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'error':
        return (
          <AlertTriangle className='h-5 w-5 text-red-500 dark:text-red-400' />
        );
      case 'pending':
        return (
          <Clock className='h-5 w-5 text-yellow-500 dark:text-yellow-400' />
        );
      case 'processed':
      default:
        return (
          <CheckCircle className='h-5 w-5 text-green-500 dark:text-green-400' />
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <h3 className='mb-2 text-lg font-medium text-gray-900 dark:text-gray-100'>
        Your Uploaded CVs
      </h3>
      <div className='space-y-2'>
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              'flex items-center justify-between rounded-md border p-3 transition-colors',
              selectedFileId === file.fileId
                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50',
            )}
          >
            <div
              className='flex flex-1 cursor-pointer items-center gap-3'
              onClick={() => onSelect(file.fileId)}
            >
              <FileText className='h-5 w-5 text-gray-500 dark:text-gray-400' />
              <div className='flex-1'>
                <p className='font-medium text-gray-900 dark:text-gray-100'>
                  {file.filename}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Uploaded {formatDistanceToNow(new Date(file.uploadedAt))} ago
                </p>
              </div>

              {/* Status indicator */}
              <div className='ml-2'>{getStatusIcon(file.status)}</div>
            </div>

            {/* Replace the delete button with the confirmation dialog */}
            <DeleteConfirmDialog
              fileName={file.filename}
              onConfirm={() => onDelete(file.id)}
              isDeleting={isDeleting}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVList;
