import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import DashboardPage from './page';

test('renders DashboardPage without errors', () => {
  render(<DashboardPage />);

  // Check for main heading
  expect(screen.getByText('CV Rewriting Service')).toBeInTheDocument();

  // Check for steps overview
  expect(screen.getByText('1. Upload CV')).toBeInTheDocument();
  expect(screen.getByText('2. Job Description')).toBeInTheDocument();
  expect(screen.getByText('3. Review & Download')).toBeInTheDocument();

  // Check for the get started button
  expect(screen.getByText('Get Started')).toBeInTheDocument();
});
