'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export type DashboardNavProps = {
  className?: string;
};

const DashboardNav: React.FC<DashboardNavProps> = ({ className }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Upload CV',
      href: '/dashboard/upload',
      active: pathname === '/dashboard/upload',
    },
    {
      name: 'Job Description',
      href: '/dashboard/job-description',
      active: pathname === '/dashboard/job-description',
    },
    {
      name: 'Review & Download',
      href: '/dashboard/review',
      active: pathname === '/dashboard/review',
    },
  ];

  return (
    <nav className={`flex flex-col space-y-1 ${className}`}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
            item.active
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{item.name}</span>
          {item.active && (
            <div className='ml-auto h-2 w-2 rounded-full bg-blue-600'></div>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default DashboardNav;
