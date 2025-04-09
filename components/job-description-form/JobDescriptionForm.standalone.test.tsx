import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import JobDescriptionForm from './JobDescriptionForm';

// Mock all external dependencies used by the component
vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: (props: any) => <div data-testid='card'>{props.children}</div>,
  CardContent: (props: any) => (
    <div data-testid='card-content'>{props.children}</div>
  ),
  CardFooter: (props: any) => (
    <div data-testid='card-footer'>{props.children}</div>
  ),
  CardHeader: (props: any) => (
    <div data-testid='card-header'>{props.children}</div>
  ),
  CardTitle: (props: any) => <h3 data-testid='card-title'>{props.children}</h3>,
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea data-testid='textarea' {...props} />,
}));

vi.mock('@/lib/cv-parser/cv-parser', () => ({}));
vi.mock('@/lib/cv-rewriter/rewriter', () => ({}));

// Very simple test
describe('JobDescriptionForm Basic Test', () => {
  it('should be defined', () => {
    expect(JobDescriptionForm).toBeDefined();
  });
});
