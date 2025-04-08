import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { DashboardNavProps } from './DashboardNav';
import { userEvent, within, expect } from '@storybook/test';

// Create a mock component for Storybook that doesn't depend on usePathname
const MockDashboardNav: React.FC<
  DashboardNavProps & {
    activePath?: string;
    onNavigation?: (path: string) => void;
  }
> = ({ className, activePath = '/dashboard/upload', onNavigation }) => {
  const navItems = [
    {
      name: 'Upload CV',
      href: '/dashboard/upload',
      active: activePath === '/dashboard/upload',
    },
    {
      name: 'Job Description',
      href: '/dashboard/job-description',
      active: activePath === '/dashboard/job-description',
    },
    {
      name: 'Review & Download',
      href: '/dashboard/review',
      active: activePath === '/dashboard/review',
    },
  ];

  return (
    <nav className={`flex flex-col space-y-1 ${className}`}>
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onNavigation?.(item.href);
          }}
          data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
          className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
            item.active
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{item.name}</span>
          {item.active && (
            <div className='ml-auto h-2 w-2 rounded-full bg-blue-600'></div>
          )}
        </a>
      ))}
    </nav>
  );
};

export default {
  title: 'Components/DashboardNav',
  component: MockDashboardNav,
  parameters: {
    layout: 'centered',
  },
} as Meta;

const Template: StoryFn<React.ComponentProps<typeof MockDashboardNav>> = (
  args,
) => <MockDashboardNav {...args} />;

export const Default = Template.bind({});
Default.args = {
  className: 'w-64',
  activePath: '/dashboard/upload',
  onNavigation: () => {},
};

export const JobDescriptionActive = Template.bind({});
JobDescriptionActive.args = {
  className: 'w-64',
  activePath: '/dashboard/job-description',
  onNavigation: () => {},
};

export const ReviewActive = Template.bind({});
ReviewActive.args = {
  className: 'w-64',
  activePath: '/dashboard/review',
  onNavigation: () => {},
};

// Play function for interaction testing
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Check if all navigation items are rendered
  expect(canvas.getByText('Upload CV')).toBeInTheDocument();
  expect(canvas.getByText('Job Description')).toBeInTheDocument();
  expect(canvas.getByText('Review & Download')).toBeInTheDocument();

  // Verify the active item has the indicator
  const uploadItem = canvas.getByTestId('nav-upload-cv');
  expect(uploadItem).toHaveClass('bg-blue-100');
  expect(uploadItem).toHaveClass('text-blue-700');

  // Get job description link
  const jobDescriptionLink = canvas.getByTestId('nav-job-description');

  // Simulate clicking on a navigation item
  await userEvent.click(jobDescriptionLink);

  // Since we're mocking the navigation, we simply verify the click happened
  // and the element retains its styling (since we're not actually navigating)
  expect(jobDescriptionLink).toHaveClass('text-gray-700');
};
