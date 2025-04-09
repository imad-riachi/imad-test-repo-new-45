import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
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
export const Default: Story = {
  args: {
    cvData: mockCvData,
  },
};

/**
 * Form with validation errors when submitting with empty input
 */
export const ValidationError: Story = {};

/**
 * Form with validation errors when submitting with too few words
 */
export const ShortDescription: Story = {};

/**
 * Form with a valid job description
 */
export const ValidInput: Story = {};

export const WithError: Story = {
  args: {
    cvData: mockCvData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter a short job description (less than 10 words)
    const textarea = canvas.getByLabelText(/job description/i);
    await userEvent.type(textarea, 'This is too short.');

    // Click the submit button
    const submitButton = canvas.getByRole('button', {
      name: /optimize cv for this job/i,
    });
    await userEvent.click(submitButton);

    // Verify error message appears
    const errorMessage = await canvas.findByText(
      /please provide a more detailed job description/i,
    );
    expect(errorMessage).toBeInTheDocument();
  },
};

export const WithValidInput: Story = {
  args: {
    cvData: mockCvData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter a valid job description (more than 10 words)
    const textarea = canvas.getByLabelText(/job description/i);
    await userEvent.type(
      textarea,
      'This is a detailed job description with more than ten words required for validation to pass.',
    );

    // Verify word count is displayed
    const wordCount = canvas.getByText(/\d+ words/);
    expect(wordCount).toBeInTheDocument();
  },
};

export const WithSubmission: Story = {
  args: {
    cvData: mockCvData,
  },
  parameters: {
    mockData: [
      {
        url: '/api/cv/rewrite',
        method: 'POST',
        status: 200,
        delay: 1000,
        response: {
          originalCv: mockCvData,
          rewrittenCv: {
            ...mockCvData,
            skills: [...mockCvData.skills, 'AWS', 'Docker'],
          },
          jobDescription: 'Job description text here',
          matches: { skills: ['JavaScript', 'React'], experience: [] },
          improvements: ['Added cloud skills'],
        },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter a valid job description
    const textarea = canvas.getByLabelText(/job description/i);
    await userEvent.type(
      textarea,
      'We are looking for a skilled software engineer with experience in React, TypeScript, and cloud technologies like AWS and Docker. The candidate should have strong problem-solving abilities.',
    );

    // Click the submit button
    const submitButton = canvas.getByRole('button', {
      name: /optimize cv for this job/i,
    });
    await userEvent.click(submitButton);

    // Check for submitting state
    const submittingText = await canvas.findByText(/optimizing/i);
    expect(submittingText).toBeInTheDocument();
  },
};
