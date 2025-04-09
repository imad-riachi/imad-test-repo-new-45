import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JobDescriptionForm from './JobDescriptionForm';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) =>
    React.createElement('button', props, children),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) =>
    React.createElement('div', { className: className || '' }, children),
  CardContent: ({ children }: any) =>
    React.createElement('div', null, children),
  CardFooter: ({ children }: any) => React.createElement('div', null, children),
  CardHeader: ({ children }: any) => React.createElement('div', null, children),
  CardTitle: ({ children }: any) => React.createElement('h3', null, children),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => React.createElement('textarea', props),
}));

// Mock other imports
vi.mock('@/lib/cv-parser/cv-parser', () => ({}));
vi.mock('@/lib/cv-rewriter/rewriter', () => ({}));

// Mock sample CV data for testing
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

describe('JobDescriptionForm Simple Test', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes a basic sanity check', () => {
    // This test just checks if the component exists
    expect(JobDescriptionForm).toBeDefined();
  });

  it('renders the form correctly', () => {
    render(<JobDescriptionForm cvData={mockCvData} />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/job description/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/paste the job description here/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /optimize cv for this job/i }),
    ).toBeInTheDocument();
  });
});
