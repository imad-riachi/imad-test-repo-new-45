import CvUploadForm from '@/components/cv-upload-form';

export default function DashboardPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='space-y-12'>
        {/* Welcome Section */}
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            CV Assistant
          </h1>
          <p className='text-muted-foreground text-lg'>
            Upload your CV and let&apos;s optimize it for job applications.
          </p>
        </div>

        {/* CV Upload Section */}
        <div className='max-w-xl space-y-4'>
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h2 className='mb-4 text-2xl font-semibold'>Upload Your CV</h2>
            <CvUploadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
