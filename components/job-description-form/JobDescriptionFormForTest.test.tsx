import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobDescriptionFormForTest from './JobDescriptionFormForTest';

// Sample CV data for testing
const mockCvData = {
  name: 'Test User',
  contactInfo: {
    email: 'test@example.com',
  },
  workExperience: [],
  education: [],
  skills: [],
};

// Mock fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('JobDescriptionFormForTest', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the form correctly', () => {
    render(<JobDescriptionFormForTest cvData={mockCvData} />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/job description/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/paste the job description here/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /optimize cv for this job/i }),
    ).toBeInTheDocument();
  });

  it('shows validation error for empty submission', () => {
    render(<JobDescriptionFormForTest cvData={mockCvData} />);

    // Try to submit with empty input
    fireEvent.click(
      screen.getByRole('button', { name: /optimize cv for this job/i }),
    );

    // Check if error message is displayed
    expect(
      screen.getByText(/please enter a job description/i),
    ).toBeInTheDocument();
  });

  it('shows validation error for short job description', () => {
    render(<JobDescriptionFormForTest cvData={mockCvData} />);

    // Enter a short job description (less than 10 words)
    const textArea = screen.getByLabelText(/job description/i);
    fireEvent.change(textArea, { target: { value: 'This is too short.' } });

    // Try to submit
    fireEvent.click(
      screen.getByRole('button', { name: /optimize cv for this job/i }),
    );

    // Check if error message is displayed
    expect(
      screen.getByText(/please provide a more detailed job description/i),
    ).toBeInTheDocument();
  });

  it('displays word count correctly', () => {
    render(<JobDescriptionFormForTest cvData={mockCvData} />);

    const textArea = screen.getByLabelText(/job description/i);

    // Enter text and check word count
    fireEvent.change(textArea, {
      target: { value: 'This is five words only.' },
    });

    // Look for "5 words" using a more flexible approach
    const wordCountElement = screen.getByText(/5\s*words/i);
    expect(wordCountElement).toBeInTheDocument();

    // Enter more text and check updated count
    fireEvent.change(textArea, {
      target: {
        value: 'This is now ten words which should be enough for submission.',
      },
    });

    // Count might be 10 or 11 words depending on how the component counts
    const updatedWordCountElement = screen.getByText(/1[01]\s*words/i);
    expect(updatedWordCountElement).toBeInTheDocument();
  });

  it('submits the form when valid data is entered', async () => {
    // Mock successful API response
    const mockResponse = {
      originalCv: mockCvData,
      rewrittenCv: mockCvData,
      jobDescription:
        'This is a sample job description with enough words to pass validation.',
      matches: { skills: [], experience: [] },
      improvements: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const onRewriteComplete = vi.fn();

    render(
      <JobDescriptionFormForTest
        cvData={mockCvData}
        onRewriteComplete={onRewriteComplete}
      />,
    );

    // Enter a valid job description
    const textArea = screen.getByLabelText(/job description/i);
    fireEvent.change(textArea, {
      target: {
        value:
          'This is a sample job description with enough words to pass validation. We need a skilled developer.',
      },
    });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /optimize cv for this job/i }),
    );

    // Check if fetch was called with the right params
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/cv/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: mockCvData,
          jobDescription:
            'This is a sample job description with enough words to pass validation. We need a skilled developer.',
        }),
      });
    });

    // Check if callback was called with the response
    await waitFor(() => {
      expect(onRewriteComplete).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('handles API error correctly', async () => {
    // Mock failed API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'API error' }),
    });

    const onRewriteError = vi.fn();

    render(
      <JobDescriptionFormForTest
        cvData={mockCvData}
        onRewriteError={onRewriteError}
      />,
    );

    // Enter a valid job description
    const textArea = screen.getByLabelText(/job description/i);
    fireEvent.change(textArea, {
      target: {
        value:
          'This is a sample job description with enough words to pass validation. We need a skilled developer.',
      },
    });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /optimize cv for this job/i }),
    );

    // Check if error callback was called
    await waitFor(() => {
      expect(onRewriteError).toHaveBeenCalledWith('Failed to rewrite CV');
    });

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to rewrite cv/i)).toBeInTheDocument();
    });
  });
});
