import DashboardNav from '@/components/dashboard-nav';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
            Tailor your CV to match your dream job with our AI-powered CV
            rewriting service.
          </p>
        </div>

        {/* Dashboard Navigation */}
        <DashboardNav />

        {/* Steps Overview */}
        <div className='grid gap-8 md:grid-cols-3'>
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h3 className='text-xl font-semibold'>1. Upload CV</h3>
            <p className='text-muted-foreground mt-2'>
              Upload your existing CV in Word or Google Doc format.
            </p>
          </div>
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h3 className='text-xl font-semibold'>2. Add Job Description</h3>
            <p className='text-muted-foreground mt-2'>
              Enter the job description for the position you&apos;re applying
              to.
            </p>
          </div>
          <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <h3 className='text-xl font-semibold'>3. Review & Download</h3>
            <p className='text-muted-foreground mt-2'>
              Review your tailored CV and download it in your preferred format.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className='mt-8 flex justify-center'>
          <Button asChild className='px-6 py-3 text-lg'>
            <Link href='/dashboard/upload-cv'>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
