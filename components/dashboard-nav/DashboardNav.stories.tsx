import type { Meta, StoryObj } from '@storybook/react';
import { DashboardNav } from './index';

const meta: Meta<typeof DashboardNav> = {
  title: 'Components/DashboardNav',
  component: DashboardNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DashboardNav>;

export const Default: Story = {
  args: {},
};
