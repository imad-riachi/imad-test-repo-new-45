import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import DashboardLayout from './DashboardLayout';

// Mock the DashboardNav component
vi.mock('@/components/dashboard-nav', () => ({
  default: () => <div data-testid='dashboard-nav'>Dashboard Nav</div>,
}));

test('renders DashboardLayout with children', () => {
  render(
    <DashboardLayout>
      <div>Test Content</div>
    </DashboardLayout>,
  );

  // Check the navigation is rendered
  expect(screen.getByTestId('dashboard-nav')).toBeInTheDocument();

  // Check the children are rendered
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});

test('renders DashboardLayout with title and description', () => {
  render(
    <DashboardLayout title='Test Title' description='Test Description'>
      <div>Test Content</div>
    </DashboardLayout>,
  );

  // Check title and description are rendered
  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByText('Test Description')).toBeInTheDocument();
});

test('renders DashboardLayout without navigation when showNavigation is false', () => {
  render(
    <DashboardLayout showNavigation={false}>
      <div>Test Content</div>
    </DashboardLayout>,
  );

  // Check the navigation is not rendered
  expect(screen.queryByTestId('dashboard-nav')).not.toBeInTheDocument();
});
