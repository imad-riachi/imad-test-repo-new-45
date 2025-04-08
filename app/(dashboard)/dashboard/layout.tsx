import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard-nav';

export const metadata: Metadata = {
  title: 'CV Rewriting Service',
  description: 'Optimize your CV for job applications',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <div className='container py-6 md:py-8'>
          <h1 className='mb-6 text-2xl font-bold md:text-3xl'>
            CV Rewriting Service
          </h1>
          <div className='flex flex-col gap-6 md:flex-row'>
            <aside className='w-full shrink-0 md:w-64'>
              <DashboardNav className='w-full' />
            </aside>
            <div className='flex-1'>{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
