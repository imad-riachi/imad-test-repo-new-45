import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard-nav';

export const metadata: Metadata = {
  title: 'Upload CV',
  description: 'Upload your CV for tailoring to a specific job description',
};

export default function UploadCVPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='space-y-12'>
        {/* Page Header */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>Upload Your CV</h1>
          <p className='text-muted-foreground text-lg'>
            Upload your existing CV to get started with the tailoring process.
          </p>
        </div>

        {/* Dashboard Navigation */}
        <DashboardNav />

        {/* Upload Section Placeholder */}
        <div className='bg-card rounded-lg border p-8 shadow-sm'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='bg-primary/10 rounded-full p-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-primary h-8 w-8'
              >
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                <polyline points='17 8 12 3 7 8'></polyline>
                <line x1='12' y1='3' x2='12' y2='15'></line>
              </svg>
            </div>
            <h3 className='text-xl font-semibold'>
              Drag and drop your CV file
            </h3>
            <p className='text-muted-foreground max-w-md'>
              Upload a Word or Google Doc file containing your CV. We&apos;ll
              extract the content for you.
            </p>
            <button className='bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-6 py-3 font-medium'>
              Select File
            </button>
            <p className='text-muted-foreground text-sm'>
              Supported formats: .docx, .doc, .gdoc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
