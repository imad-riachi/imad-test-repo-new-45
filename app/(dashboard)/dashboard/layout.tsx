import { Metadata } from 'next';

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
        <div className='container flex flex-col gap-8 py-6 md:flex-row'>
          <div className='flex-1'>{children}</div>
        </div>
      </main>
    </div>
  );
}
