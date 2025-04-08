import { ReactNode } from 'react';
import DashboardNav from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';

export type DashboardLayoutProps = {
  children: ReactNode;
  className?: string;
  showNavigation?: boolean;
  title?: string;
  description?: string;
};

const DashboardLayout = ({
  children,
  className,
  showNavigation = true,
  title,
  description,
}: DashboardLayoutProps) => {
  return (
    <div className={cn('container py-6', className)}>
      {showNavigation && <DashboardNav />}

      {(title || description) && (
        <div className='mb-8 space-y-2'>
          {title && <h1 className='text-3xl font-bold'>{title}</h1>}
          {description && (
            <p className='text-muted-foreground'>{description}</p>
          )}
        </div>
      )}

      <main className='min-h-[calc(100vh-200px)]'>{children}</main>
    </div>
  );
};

export default DashboardLayout;
