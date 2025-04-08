import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <main className='flex flex-1 flex-col p-4 md:p-6'>
      <h1 className='text-2xl font-semibold'>Dashboard</h1>
      <p className='mt-2 text-gray-600'>Welcome to your dashboard.</p>
      {/* Content area for future components */}
      <div className='mt-4 flex-1 rounded-lg border border-dashed p-4 shadow-sm'>
        {/* Placeholder for dashboard widgets or content */}
        <p className='text-center text-gray-500'>Dashboard content goes here</p>
      </div>
    </main>
  );
};

export default DashboardPage;
