import type { Meta, StoryObj } from '@storybook/react';
import JobDescriptionInput from './JobDescriptionInput';

const meta: Meta<typeof JobDescriptionInput> = {
  title: 'Components/JobDescriptionInput',
  component: JobDescriptionInput,
  tags: ['autodocs'],
  argTypes: {
    onJobDescriptionSubmit: { action: 'job description submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof JobDescriptionInput>;

export const Default: Story = {
  args: {
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const WithInitialData: Story = {
  render: (args) => (
    <div className='mx-auto max-w-2xl p-4'>
      <JobDescriptionInput {...args} />
    </div>
  ),
  args: {
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value =
        'This is a sample job description for a software engineer position. The ideal candidate will have 5+ years of experience with React, TypeScript, and Node.js. Responsibilities include developing and maintaining web applications, collaborating with cross-functional teams, and ensuring code quality through rigorous testing.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

export const WithLongText: Story = {
  render: (args) => (
    <div className='mx-auto max-w-2xl p-4'>
      <JobDescriptionInput {...args} />
    </div>
  ),
  args: {
    isSubmitting: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value =
        'This is a very long job description that exceeds the maximum character limit. '.repeat(
          100,
        );
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};
