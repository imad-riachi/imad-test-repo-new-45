import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { vi } from 'vitest';
import MarkdownDownloadButton from './MarkdownDownloadButton';
import * as markdownConverter from '@/lib/utils/markdown-converter';

// Mock the downloadMarkdown function to prevent actual downloads in tests
const downloadMock = vi
  .spyOn(markdownConverter, 'downloadMarkdown')
  .mockImplementation(() => {});

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
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find the download button
    const downloadButton = canvas.getByRole('button', {
      name: /download cv as markdown/i,
    });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toBeDisabled();

    // Click the button
    await userEvent.click(downloadButton);

    // Verify the conversion and download functions were called
    expect(markdownConverter.downloadMarkdown).toHaveBeenCalled();
  },
};

export const DisabledState: Story = {
  args: {
    cv: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the download button
    const downloadButton = canvas.getByRole('button', {
      name: /download cv as markdown/i,
    });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();
  },
};

export const CustomText: Story = {
  args: {
    cv: sampleCV,
    buttonText: 'Get Markdown',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify custom button text
    const downloadButton = canvas.getByRole('button', {
      name: /download cv as markdown/i,
    });
    expect(downloadButton).toHaveTextContent('Get Markdown');
  },
};
