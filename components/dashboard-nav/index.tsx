'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  href: string;
  description?: string;
};

const navItems: NavItem[] = [
  {
    title: 'Upload CV',
    href: '/dashboard/upload-cv',
    description: 'Upload your CV in Word or Google Doc format',
  },
  {
    title: 'Job Description',
    href: '/dashboard/job-description',
    description: 'Enter the job description for CV optimization',
  },
  {
    title: 'Review & Download',
    href: '/dashboard/review',
    description: 'Review and download your optimized CV',
  },
];

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0',
        className,
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}

export default DashboardNav;
