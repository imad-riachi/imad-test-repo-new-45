'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export type DashboardNavProps = {
  className?: string;
};

const navItems = [
  {
    name: 'Upload CV',
    path: '/dashboard/upload-cv',
    description: 'Upload your existing CV in Word or Google Doc format',
  },
  {
    name: 'Job Description',
    path: '/dashboard/job-description',
    description: 'Enter the job description for your target position',
  },
  {
    name: 'Review & Download',
    path: '/dashboard/review-download',
    description: 'Review your tailored CV and download it',
  },
];

const DashboardNav: React.FC<DashboardNavProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn('w-full overflow-hidden', className)}>
      <div className='flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-4'>
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const number = index + 1;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'group hover:border-primary relative flex flex-1 flex-col rounded-lg border p-4 transition-all',
                isActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:shadow-sm',
              )}
            >
              <div className='mb-2 flex items-center'>
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {number}
                </div>
                <h3 className='ml-3 font-medium'>{item.name}</h3>
              </div>
              <p className='text-muted-foreground text-sm'>
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardNav;
