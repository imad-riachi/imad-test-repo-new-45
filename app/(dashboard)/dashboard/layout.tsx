import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your SAAS dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <div>{children}</div>
    </div>
  );
}
