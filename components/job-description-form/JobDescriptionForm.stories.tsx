import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import JobDescriptionForm from './JobDescriptionForm';

// Sample CV data for testing
const mockCvData = {
  name: 'John Doe',
  contactInfo: {
    email: 'john.doe@example.com',
    phone: '555-123-4567',
  },
  summary:
    'Experienced software developer with skills in JavaScript and React.',
  workExperience: [
    {
      company: 'Tech Company',
      position: 'Frontend Developer',
      period: '2020-Present',
      responsibilities: [
        'Developed web applications using React',
        'Worked with a team of 5 developers',
        'Improved website performance',
      ],
    },
  ],
  education: [
    {
      institution: 'University',
      degree: 'Computer Science',
      year: '2019',
    },
  ],
  skills: [{ name: 'JavaScript' }, { name: 'React' }, { name: 'HTML/CSS' }],
};

/**
 * JobDescriptionForm component allows users to enter a job description
 * that will be used to optimize their CV for a specific job application
 */
const meta: Meta<typeof JobDescriptionForm> = {
  title: 'Components/JobDescriptionForm',
  component: JobDescriptionForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    cvData: mockCvData,
    onRewriteComplete: (data) => console.log('CV rewritten:', data),
    onRewriteError: (message) => console.error('Error:', message),
  },
  argTypes: {
    onRewriteComplete: { action: 'rewriteComplete' },
    onRewriteError: { action: 'rewriteError' },
  },
};

export default meta;
type Story = StoryObj<typeof JobDescriptionForm>;

/**
 * Default state of the JobDescriptionForm
 */
export const Default: Story = {};

/**
 * Form with validation errors when submitting with empty input
 */
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the submit button
    const submitButton = canvas.getByRole('button', { name: /optimize/i });
    await userEvent.click(submitButton);

    // Check if error message appears
    const errorMessage = await canvas.findByText(
      /please enter a job description/i,
    );
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * Form with validation errors when submitting with too few words
 */
export const ShortDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Type a short description
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, 'This is too short.');

    // Click the submit button
    const submitButton = canvas.getByRole('button', { name: /optimize/i });
    await userEvent.click(submitButton);

    // Check if error message appears
    const errorMessage = await canvas.findByText(
      /more detailed job description/i,
    );
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * Form with a valid job description
 */
export const ValidInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Type a valid job description
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(
      textarea,
      'We are looking for a skilled frontend developer with expertise in React, TypeScript, and modern JavaScript frameworks. The ideal candidate will have experience building responsive web applications and working with REST APIs.',
    );

    // Check if word count is displayed
    const wordCount = await canvas.findByText(/\d+ words/);
    expect(wordCount).toBeInTheDocument();

    // Submit button should be enabled
    const submitButton = canvas.getByRole('button', { name: /optimize/i });
    expect(submitButton).not.toBeDisabled();
  },
};
