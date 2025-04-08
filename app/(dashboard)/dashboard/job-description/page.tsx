import DashboardLayout from '@/components/dashboard-layout';

export default function JobDescriptionPage() {
  return (
    <DashboardLayout
      title='Job Description'
      description='Paste the job description to tailor your CV.'
    >
      <div className='rounded-lg border p-6'>
        <p className='mb-4'>Job description input coming soon</p>
      </div>
    </DashboardLayout>
  );
}
