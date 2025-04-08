import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import DashboardNav from './DashboardNav';

// Mock the usePathname hook
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/upload',
}));

test('renders DashboardNav with default links', () => {
  render(<DashboardNav />);

  // Check all default links are rendered
  expect(screen.getByText('Upload CV')).toBeInTheDocument();
  expect(screen.getByText('Job Description')).toBeInTheDocument();
  expect(screen.getByText('Review & Download')).toBeInTheDocument();
});

test('renders DashboardNav with custom links', () => {
  const customLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Settings', path: '/dashboard/settings' },
  ];

  render(<DashboardNav links={customLinks} />);

  // Check custom links are rendered
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Settings')).toBeInTheDocument();

  // Check default links are not rendered
  expect(screen.queryByText('Upload CV')).not.toBeInTheDocument();
});
