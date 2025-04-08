import { Meta, StoryObj } from '@storybook/react';
import DashboardLayout from './DashboardLayout';

const meta: Meta<typeof DashboardLayout> = {
  title: 'Components/DashboardLayout',
  component: DashboardLayout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {
  args: {
    children: <div className='rounded border p-4'>Content goes here</div>,
    showNavigation: true,
  },
};

export const WithTitleAndDescription: Story = {
  args: {
    title: 'Dashboard Title',
    description: 'This is a description of the dashboard page',
    children: <div className='rounded border p-4'>Content goes here</div>,
    showNavigation: true,
  },
};

export const WithoutNavigation: Story = {
  args: {
    title: 'Page Title',
    description: 'This is a page without navigation',
    children: <div className='rounded border p-4'>Content goes here</div>,
    showNavigation: false,
  },
};
