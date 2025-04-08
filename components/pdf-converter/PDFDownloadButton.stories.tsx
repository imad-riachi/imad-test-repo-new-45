import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { vi } from 'vitest';
import PDFDownloadButton from './PDFDownloadButton';
import * as pdfGenerator from '@/lib/utils/pdf-generator';

// Mock the PDF generation and download functions
const generateMock = vi
  .spyOn(pdfGenerator, 'generatePDFFromCV')
  .mockImplementation(() => new Blob([]));
const downloadMock = vi
  .spyOn(pdfGenerator, 'downloadPDF')
  .mockImplementation(() => {});

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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the download button
    const downloadButton = canvas.getByRole('button', {
      name: /download cv as pdf/i,
    });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toBeDisabled();

    // Click the button
    await userEvent.click(downloadButton);

    // Verify the PDF generation and download functions were called
    expect(pdfGenerator.generatePDFFromCV).toHaveBeenCalled();
    expect(pdfGenerator.downloadPDF).toHaveBeenCalled();
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
      name: /download cv as pdf/i,
    });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();
  },
};

export const CustomText: Story = {
  args: {
    cv: sampleCV,
    buttonText: 'Export PDF',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify custom button text
    const downloadButton = canvas.getByRole('button', {
      name: /download cv as pdf/i,
    });
    expect(downloadButton).toHaveTextContent('Export PDF');
  },
};
