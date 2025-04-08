'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type DeleteConfirmDialogProps = {
  fileName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
};

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  fileName,
  onConfirm,
  isDeleting = false,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
          disabled={isDeleting}
        >
          <Trash2 className='h-4 w-4' />
          <span className='sr-only'>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete CV</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{fileName}&quot;? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className='bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
