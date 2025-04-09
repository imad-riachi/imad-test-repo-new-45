import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { vi } from 'vitest';
import PDFDownloadButton from './PDFDownloadButton';

const meta: Meta<typeof PDFDownloadButton> = {
  component: PDFDownloadButton,
  title: 'Components/PDFDownloadButton',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PDFDownloadButton>;

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
    onPDFDownload: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the button
    const button = canvas.getByRole('button', { name: /download cv as pdf/i });

    // Verify button is enabled
    expect(button).not.toBeDisabled();

    // Click the button
    await userEvent.click(button);

    // Verify the onPDFDownload callback was called with correct args
    expect(args.onPDFDownload).toHaveBeenCalledTimes(1);
    expect(args.onPDFDownload).toHaveBeenCalledWith({
      cv: sampleCV,
      filename: 'optimized_cv.pdf',
    });
  },
};

export const DisabledState: Story = {
  args: {
    cv: null,
    onPDFDownload: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the button
    const button = canvas.getByRole('button', { name: /download cv as pdf/i });

    // Verify button is disabled
    expect(button).toBeDisabled();

    // Try to click the button (should have no effect due to disabled state)
    await userEvent.click(button);

    // Verify the callback wasn't called
    expect(args.onPDFDownload).not.toHaveBeenCalled();
  },
};

export const CustomText: Story = {
  args: {
    cv: sampleCV,
    buttonText: 'Export PDF',
    onPDFDownload: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the button with custom text
    const button = canvas.getByRole('button', { name: /download cv as pdf/i });

    // Verify the button has custom text
    expect(button).toHaveTextContent('Export PDF');

    // Click the button
    await userEvent.click(button);

    // Verify the callback was called
    expect(args.onPDFDownload).toHaveBeenCalledTimes(1);
  },
};
