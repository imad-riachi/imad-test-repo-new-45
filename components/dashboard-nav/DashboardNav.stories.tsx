import { Meta, StoryObj } from '@storybook/react';
import DashboardNav from './DashboardNav';

const meta: Meta<typeof DashboardNav> = {
  title: 'Components/DashboardNav',
  component: DashboardNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DashboardNav>;

export const Default: Story = {
  args: {
    links: [
      { name: 'Upload CV', path: '/dashboard/upload' },
      { name: 'Job Description', path: '/dashboard/job-description' },
      { name: 'Review & Download', path: '/dashboard/review' },
    ],
  },
};

export const CustomLinks: Story = {
  args: {
    links: [
      { name: 'Home', path: '/dashboard' },
      { name: 'Settings', path: '/dashboard/settings' },
      { name: 'Profile', path: '/dashboard/profile' },
    ],
  },
};
