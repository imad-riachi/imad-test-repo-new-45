import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import CvUploadForm from './CvUploadForm';

const meta: Meta<typeof CvUploadForm> = {
  title: 'Components/CvUploadForm',
  component: CvUploadForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onUploadComplete: { action: 'uploadComplete' },
    onUploadError: { action: 'uploadError' },
  },
};

export default meta;
type Story = StoryObj<typeof CvUploadForm>;

export const Default: Story = {
  args: {
    maxSizeMB: 5,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the dropzone area
    const dropzone = canvas.getByText(/Drag & drop your CV/i).closest('div');
    expect(dropzone).toBeTruthy();

    if (dropzone) {
      // Find the file input
      const fileInput = dropzone.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput).toBeTruthy();

      // Create an invalid file (image) and trigger the change event
      const file = new File(['invalid file content'], 'test.png', {
        type: 'image/png',
      });

      // Simulate file selection
      await userEvent.upload(fileInput, file);
    }

    // Verify error message appears
    const errorMessage = await canvas.findByText(/Invalid file type/i);
    expect(errorMessage).toBeInTheDocument();
  },
};

export const WithUpload: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the dropzone area
    const dropzone = canvas.getByText(/Drag & drop your CV/i).closest('div');
    expect(dropzone).toBeTruthy();

    if (dropzone) {
      // Find the file input
      const fileInput = dropzone.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput).toBeTruthy();

      // Create a valid PDF file
      const file = new File(['dummy content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      // Simulate file selection
      await userEvent.upload(fileInput, file);
    }

    // Check if the file name appears in the UI
    const fileName = await canvas.findByText('resume.pdf');
    expect(fileName).toBeInTheDocument();

    // Check if the upload button appears
    const uploadButton = await canvas.findByText('Upload CV');
    expect(uploadButton).toBeInTheDocument();
  },
};

// Test upload process with mock API
export const UploadProcess: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: [
      {
        url: '/api/cv/upload',
        method: 'POST',
        status: 200,
        delay: 1000,
        response: {
          url: '/mock-url/resume.pdf',
          name: 'resume.pdf',
          size: 1024 * 1024, // 1MB
        },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the dropzone area
    const dropzone = canvas.getByText(/Drag & drop your CV/i).closest('div');
    expect(dropzone).toBeTruthy();

    if (dropzone) {
      // Find the file input
      const fileInput = dropzone.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput).toBeTruthy();

      // Create a valid PDF file
      const file = new File(['dummy content'], 'resume.pdf', {
        type: 'application/pdf',
      });

      // Simulate file selection
      await userEvent.upload(fileInput, file);
    }

    // Check if the file name appears in the UI
    const fileName = await canvas.findByText('resume.pdf');
    expect(fileName).toBeInTheDocument();

    // Click the upload button
    const uploadButton = await canvas.findByText('Upload CV');
    await userEvent.click(uploadButton);

    // Check for uploading indicator
    const uploadingText = await canvas.findByText(/Uploading/i);
    expect(uploadingText).toBeInTheDocument();
  },
};
