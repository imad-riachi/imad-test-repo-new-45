import DashboardLayout from '@/components/dashboard-layout';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title='CV Rewriting Service'
      description='Tailor your CV to any job description and increase your chances of landing an interview.'
    >
      <div className='space-y-12'>
        <p className='text-muted-foreground'>
          Upload your CV, add a job description, and our AI will rewrite your CV
          to match the job requirements.
        </p>

        {/* Steps Overview */}
        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg border p-6'>
            <h2 className='mb-3 text-xl font-semibold'>1. Upload CV</h2>
            <p className='text-muted-foreground'>
              Upload your existing CV in Word or Google Doc format.
            </p>
          </div>
          <div className='rounded-lg border p-6'>
            <h2 className='mb-3 text-xl font-semibold'>2. Job Description</h2>
            <p className='text-muted-foreground'>
              Paste the job description you&apos;re applying for.
            </p>
          </div>
          <div className='rounded-lg border p-6'>
            <h2 className='mb-3 text-xl font-semibold'>3. Review & Download</h2>
            <p className='text-muted-foreground'>
              Review your tailored CV and download in your preferred format.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className='flex justify-center'>
          <a
            href='/dashboard/upload'
            className='bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-8 py-3 text-base font-medium text-white shadow-md transition-colors'
          >
            Get Started
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
