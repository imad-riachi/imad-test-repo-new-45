import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import DashboardNav from './DashboardNav';

const meta: Meta<typeof DashboardNav> = {
  title: 'Components/DashboardNav',
  component: DashboardNav,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DashboardNav>;

export const Default: Story = {
  args: {},
};

export const Navigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find all navigation links
    const links = canvas.getAllByRole('link');

    // Click the second link (Job Description)
    if (links.length > 1) {
      await userEvent.click(links[1]);
    }
  },
};
