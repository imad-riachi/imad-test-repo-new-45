import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CVUpload } from './index';

const meta: Meta<typeof CVUpload> = {
  title: 'Components/CVUpload',
  component: CVUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onFileAccepted: { action: 'File accepted' },
  },
};

export default meta;
type Story = StoryObj<typeof CVUpload>;

export const Default: Story = {
  args: {
    onFileAccepted: fn(),
  },
  play: async ({ canvasElement }) => {
    // Add interaction tests here if needed
  },
};
