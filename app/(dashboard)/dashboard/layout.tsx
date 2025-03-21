import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard-nav';
import { MobileToggle } from '@/components/dashboard-nav/mobile-toggle';

export const metadata: Metadata = {
  title: 'CV Rewriter Dashboard',
  description: 'Optimize your CV for job applications',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10'>
        <aside className='fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block'>
          <div className='h-full py-6 pr-6 pl-8 lg:py-8'>
            <DashboardNav />
          </div>
        </aside>
        <main className='flex w-full flex-col overflow-hidden'>
          <div className='flex items-center py-4 md:hidden'>
            <MobileToggle />
            <div className='ml-2 text-lg font-semibold'>CV Rewriter</div>
          </div>
          <div className='py-6'>{children}</div>
        </main>
      </div>
    </div>
  );
}
