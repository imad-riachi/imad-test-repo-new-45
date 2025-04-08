import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard-nav';

export const metadata: Metadata = {
  title: 'Job Description',
  description: 'Enter the job description to tailor your CV',
};

export default function JobDescriptionPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='space-y-12'>
        {/* Page Header */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight'>
            Add Job Description
          </h1>
          <p className='text-muted-foreground text-lg'>
            Enter the job description for the position you&apos;re applying to.
          </p>
        </div>

        {/* Dashboard Navigation */}
        <DashboardNav />

        {/* Job Description Form */}
        <div className='bg-card rounded-lg border p-8 shadow-sm'>
          <div className='space-y-6'>
            <div>
              <label
                htmlFor='jobDescription'
                className='mb-2 block text-sm font-medium'
              >
                Job Description
              </label>
              <textarea
                id='jobDescription'
                rows={10}
                className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border p-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                placeholder='Paste the job description here...'
              />
              <p className='text-muted-foreground mt-2 text-sm'>
                For best results, include the full job description with
                requirements, responsibilities, and qualifications.
              </p>
            </div>

            <div className='mt-6 flex justify-end'>
              <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-medium'>
                Continue to Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
