'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLink = {
  name: string;
  path: string;
};

export type DashboardNavProps = {
  links?: NavLink[];
};

const defaultLinks: NavLink[] = [
  { name: 'Upload CV', path: '/dashboard/upload' },
  { name: 'Job Description', path: '/dashboard/job-description' },
  { name: 'Review & Download', path: '/dashboard/review' },
];

const DashboardNav: React.FC<DashboardNavProps> = ({
  links = defaultLinks,
}) => {
  const pathname = usePathname();

  return (
    <nav className='mb-6'>
      <ul className='flex flex-wrap items-center gap-4 border-b'>
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className={cn(
                'hover:text-primary inline-block px-4 py-3 text-sm font-medium transition-colors',
                pathname === link.path
                  ? 'border-primary text-primary border-b-2'
                  : 'text-muted-foreground',
              )}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashboardNav;
