import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import MarkdownDownloadButton from './MarkdownDownloadButton';

const meta: Meta<typeof MarkdownDownloadButton> = {
  component: MarkdownDownloadButton,
  title: 'Components/MarkdownDownloadButton',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MarkdownDownloadButton>;

// Sample CV data for testing
const sampleCV = {
  summary: 'Experienced software developer',
  experience: [
    {
      company: 'Tech Co',
      position: 'Senior Developer',
      date: '2020-Present',
      description: ['Led development team', 'Implemented key features'],
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React'],
};

export const Default: Story = {
  args: {
    cv: sampleCV,
    onMarkdownDownload: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the button and check if it's enabled
    const downloadButton = canvas.getByRole('button', {
      name: /Download CV as Markdown/i,
    });
    expect(downloadButton).not.toBeDisabled();

    // Click the button and verify the callback was called
    await userEvent.click(downloadButton);
    expect(args.onMarkdownDownload).toHaveBeenCalledWith({
      cv: sampleCV,
      filename: 'optimized_cv.md',
    });
  },
};

export const DisabledState: Story = {
  args: {
    cv: null,
    onMarkdownDownload: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the button and check if it's disabled
    const downloadButton = canvas.getByRole('button', {
      name: /Download CV as Markdown/i,
    });
    expect(downloadButton).toBeDisabled();

    // Try to click the button (should have no effect)
    await userEvent.click(downloadButton);
    expect(args.onMarkdownDownload).not.toHaveBeenCalled();
  },
};

export const CustomText: Story = {
  args: {
    cv: sampleCV,
    buttonText: 'Get Markdown',
    onMarkdownDownload: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if the button has the custom text
    const downloadButton = canvas.getByRole('button', {
      name: /Download CV as Markdown/i,
    });
    expect(downloadButton).toHaveTextContent('Get Markdown');

    // Click the button and verify the callback was called
    await userEvent.click(downloadButton);
    expect(args.onMarkdownDownload).toHaveBeenCalled();
  },
};
