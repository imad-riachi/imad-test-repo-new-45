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
      <main className='flex-1'>{children}</main>
    </div>
  );
}
