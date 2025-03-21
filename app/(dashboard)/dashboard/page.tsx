export default function DashboardPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='space-y-12'>
        {/* Welcome Section */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            CV Rewriting Service
          </h1>
          <p className='text-muted-foreground text-lg'>
            Optimize your resume for job applications using our AI-powered CV
            rewriting tool.
          </p>
          <p className='text-muted-foreground'>
            Upload your CV, provide a job description, and get a tailored resume
            that highlights your relevant skills and experience.
          </p>
        </div>

        {/* Features Section */}
        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg border p-6'>
            <h3 className='text-xl font-semibold'>Upload CV</h3>
            <p className='text-muted-foreground mt-2'>
              Upload your existing CV in Word or Google Doc format.
            </p>
          </div>
          <div className='rounded-lg border p-6'>
            <h3 className='text-xl font-semibold'>Add Job Description</h3>
            <p className='text-muted-foreground mt-2'>
              Provide the job description you&apos;re applying for.
            </p>
          </div>
          <div className='rounded-lg border p-6'>
            <h3 className='text-xl font-semibold'>Get Optimized CV</h3>
            <p className='text-muted-foreground mt-2'>
              Download your tailored CV in Markdown or PDF format.
            </p>
          </div>
        </div>

        {/* Get Started Section */}
        <div className='bg-muted rounded-lg p-8'>
          <h2 className='text-2xl font-bold'>Ready to optimize your CV?</h2>
          <p className='text-muted-foreground mt-2 mb-4'>
            Get started by navigating through the dashboard to upload your CV.
          </p>
        </div>
      </div>
    </div>
  );
}
