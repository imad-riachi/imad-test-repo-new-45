import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard-nav';

export const metadata: Metadata = {
  title: 'Review & Download',
  description: 'Review your tailored CV and download it',
};

export default function ReviewDownloadPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='space-y-12'>
        {/* Page Header */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>
            Review & Download
          </h1>
          <p className='text-muted-foreground text-lg'>
            Review your tailored CV and download it in your preferred format.
          </p>
        </div>

        {/* Dashboard Navigation */}
        <DashboardNav />

        {/* Review Section */}
        <div className='grid gap-8 md:grid-cols-2'>
          {/* CV Preview */}
          <div className='bg-card rounded-lg border p-8 shadow-sm'>
            <h3 className='mb-4 text-xl font-semibold'>CV Preview</h3>
            <div className='border-input h-96 overflow-auto rounded-md border p-6'>
              <div className='prose max-w-none'>
                <h2>John Doe</h2>
                <p>Frontend Developer | React Specialist</p>
                <hr />
                <h3>Summary</h3>
                <p>
                  Experienced frontend developer with 5+ years of experience
                  building responsive web applications with React, TypeScript,
                  and modern CSS frameworks.
                </p>
                <h3>Experience</h3>
                <h4>Senior Frontend Developer - ABC Company</h4>
                <p>Jan 2020 - Present</p>
                <ul>
                  <li>
                    Led the development of a customer-facing portal using React
                    and TypeScript
                  </li>
                  <li>
                    Implemented CI/CD pipelines that reduced deployment time by
                    40%
                  </li>
                  <li>Mentored junior developers and conducted code reviews</li>
                </ul>
                <p>
                  <em>Sample CV preview. Your tailored CV will appear here.</em>
                </p>
              </div>
            </div>
          </div>

          {/* Download Options */}
          <div className='bg-card rounded-lg border p-8 shadow-sm'>
            <h3 className='mb-4 text-xl font-semibold'>Download Options</h3>
            <div className='space-y-4'>
              <p className='text-muted-foreground'>
                Select your preferred format to download your tailored CV.
              </p>

              <div className='space-y-4 pt-4'>
                <button className='hover:bg-accent flex w-full items-center justify-between rounded-md border p-4'>
                  <div className='flex items-center space-x-2'>
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
                      className='text-primary'
                    >
                      <path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'></path>
                      <polyline points='14 2 14 8 20 8'></polyline>
                    </svg>
                    <span>Download as PDF</span>
                  </div>
                  <span className='text-muted-foreground text-sm'>
                    Best for sending to employers
                  </span>
                </button>

                <button className='hover:bg-accent flex w-full items-center justify-between rounded-md border p-4'>
                  <div className='flex items-center space-x-2'>
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
                      className='text-primary'
                    >
                      <path d='M14 3v4a1 1 0 0 0 1 1h4'></path>
                      <path d='M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z'></path>
                      <path d='M9 9h1'></path>
                      <path d='M9 13h6'></path>
                      <path d='M9 17h6'></path>
                    </svg>
                    <span>Download as Word</span>
                  </div>
                  <span className='text-muted-foreground text-sm'>
                    Editable document
                  </span>
                </button>

                <button className='hover:bg-accent flex w-full items-center justify-between rounded-md border p-4'>
                  <div className='flex items-center space-x-2'>
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
                      className='text-primary'
                    >
                      <path d='M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3'></path>
                      <path d='M2 15h10'></path>
                      <path d='m9 18 3-3-3-3'></path>
                    </svg>
                    <span>Download as Markdown</span>
                  </div>
                  <span className='text-muted-foreground text-sm'>
                    Plain text format
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
