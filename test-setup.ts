import { expect, afterEach, vi } from 'vitest';
import React from 'react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add the jest-dom matchers to Vitest
expect.extend(matchers);

// Import after extending expect
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock the UI components we need
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

// Mock CvData
vi.mock('@/lib/cv-parser/cv-parser', () => ({
  CvData: {},
}));

// Mock RewriteResponse
vi.mock('@/lib/cv-rewriter/rewriter', () => ({
  RewriteResponse: {},
}));
