import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, waitFor, expect } from '@storybook/test';
import JobDescriptionInput from './JobDescriptionInput';

const meta: Meta<typeof JobDescriptionInput> = {
  title: 'Components/JobDescriptionInput',
  component: JobDescriptionInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    isLoading: { control: 'boolean' },
    minLength: { control: { type: 'number', min: 10, max: 500 } },
    maxLength: { control: { type: 'number', min: 500, max: 10000 } },
  },
};

export default meta;
type Story = StoryObj<typeof JobDescriptionInput>;

export const Default: Story = {
  args: {
    onSubmit: async () => {},
    isLoading: false,
    minLength: 50,
    maxLength: 5000,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: async () => {},
    isLoading: true,
    minLength: 50,
    maxLength: 5000,
  },
};

export const WithValidInput: Story = {
  args: {
    onSubmit: async () => {},
    isLoading: false,
    minLength: 50,
    maxLength: 5000,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Get the textarea
    const textareaElement = canvas.getByLabelText('Job Description', {
      selector: 'textarea',
    });

    // Type a valid job description
    const validJobDescription =
      'This is a sample job description that meets the minimum length requirements. ' +
      'We are looking for a skilled developer with experience in React, TypeScript, and Next.js. ' +
      'The ideal candidate will have strong problem-solving skills and a passion for creating great user experiences.';

    await userEvent.type(textareaElement, validJobDescription, {
      delay: 10,
    });

    // Check that the textarea contains the text
    expect(textareaElement).toHaveValue(validJobDescription);

    // Get submit button and check if it's enabled
    const submitButton = canvas.getByRole('button', {
      name: /Optimize My CV/i,
    });
    expect(submitButton).not.toBeDisabled();

    // Click the submit button
    await userEvent.click(submitButton);

    // Verify the onSubmit function was called with the job description
    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith(validJobDescription);
    });
  },
};

export const WithInvalidInput: Story = {
  args: {
    onSubmit: async () => {},
    isLoading: false,
    minLength: 50,
    maxLength: 5000,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the textarea
    const textareaElement = canvas.getByLabelText('Job Description', {
      selector: 'textarea',
    });

    // Type a short job description that doesn't meet the minimum length
    const shortJobDescription = 'Too short job description';

    await userEvent.type(textareaElement, shortJobDescription, {
      delay: 10,
    });

    // Check that the textarea contains the text
    expect(textareaElement).toHaveValue(shortJobDescription);

    // Get submit button and check if it's disabled
    const submitButton = canvas.getByRole('button', {
      name: /Optimize My CV/i,
    });
    expect(submitButton).toBeDisabled();

    // Verify that character count message shows minimum characters required
    const characterInfo = canvas.getByText(
      /characters \(minimum 50 characters required\)/i,
    );
    expect(characterInfo).toBeInTheDocument();
  },
};

export const ErrorHandling: Story = {
  args: {
    onSubmit: async () => {
      throw new Error('Mock API error');
    },
    isLoading: false,
    minLength: 50,
    maxLength: 5000,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the textarea
    const textareaElement = canvas.getByLabelText('Job Description', {
      selector: 'textarea',
    });

    // Type a valid job description
    const validJobDescription =
      'This is a sample job description that meets the minimum length requirements. ' +
      'We are looking for a skilled developer with experience in React, TypeScript, and Next.js. ' +
      'The ideal candidate will have strong problem-solving skills and a passion for creating great user experiences.';

    await userEvent.type(textareaElement, validJobDescription, {
      delay: 5,
    });

    // Get submit button
    const submitButton = canvas.getByRole('button', {
      name: /Optimize My CV/i,
    });

    // Click the submit button
    await userEvent.click(submitButton);

    // Wait for and verify error message appears
    await waitFor(() => {
      const errorMessage = canvas.getByText(
        /An error occurred while processing your job description/i,
      );
      expect(errorMessage).toBeInTheDocument();
    });
  },
};
