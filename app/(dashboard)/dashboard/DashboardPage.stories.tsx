import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DashboardPage from './page'; // Assuming page.tsx is the component
import { within, userEvent } from '@storybook/test'; // Import testing utilities

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/DashboardPage', // Updated title for clarity
  component: DashboardPage,
  parameters: {
    // Optional: Add layout parameters if needed, e.g., 'fullscreen'
    layout: 'fullscreen',
  },
  tags: ['autodocs'], // Enable auto-documentation
};

export default meta;

type Story = StoryObj<typeof DashboardPage>;

// Basic story rendering the component
export const Default: Story = {
  args: {
    // No props needed for this simple page component yet
  },
};

// Example story with a basic interaction test (if applicable later)
// export const InteractiveExample: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Example: Find an element and interact with it
//     // const button = canvas.getByRole('button', { name: /click me/i });
//     // await userEvent.click(button);
//     // Add assertions here if needed
//   },
// };
