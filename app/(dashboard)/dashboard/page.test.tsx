import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import DashboardPage from './page';

test('renders dashboard page correctly', () => {
  render(<DashboardPage />);

  // Check if the main heading is rendered
  const headingElement = screen.getByRole('heading', { name: /dashboard/i });
  expect(headingElement).toBeInTheDocument();

  // Check if the welcome message is rendered
  const welcomeMessage = screen.getByText(/welcome to your dashboard/i);
  expect(welcomeMessage).toBeInTheDocument();

  // Check if the content placeholder is rendered
  const placeholder = screen.getByText(/dashboard content goes here/i);
  expect(placeholder).toBeInTheDocument();
});
