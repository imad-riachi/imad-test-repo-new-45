import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import CVDisplay, { CVDisplayProps } from './CVDisplay';

const meta: Meta<typeof CVDisplay> = {
  component: CVDisplay,
  title: 'Components/CVDisplay',
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CVDisplay>;

const sampleCVData = {
  summary:
    'Experienced software engineer with expertise in building modern web applications using TypeScript, React, and Next.js.',
  experience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      date: 'Jan 2020 - Present',
      description: [
        'Led development of mission-critical web applications using React and TypeScript',
        'Mentored junior developers and conducted code reviews',
        'Implemented CI/CD pipelines to improve deployment efficiency',
      ],
      achievements: [
        'Reduced load times by 40% through optimization techniques',
        'Successfully delivered 5 major features ahead of schedule',
      ],
    },
    {
      company: 'Digital Innovations',
      position: 'Frontend Developer',
      date: 'Jun 2018 - Dec 2019',
      description: [
        'Developed responsive web interfaces using React and CSS frameworks',
        'Collaborated with UI/UX designers to implement design systems',
      ],
    },
  ],
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'GraphQL',
    'CSS/Tailwind',
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      date: '2014 - 2018',
      description: 'Graduated with honors. Specialized in web technologies.',
    },
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      description:
        'Developed a full-stack e-commerce solution with Next.js, Stripe integration, and PostgreSQL.',
      technologies: ['Next.js', 'PostgreSQL', 'Stripe API', 'Tailwind CSS'],
    },
  ],
};

export const Default: Story = {
  args: {
    cv: sampleCVData,
    isLoading: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Verify summary section exists
    const summaryHeading = canvas.getByText('Professional Summary');
    expect(summaryHeading).toBeInTheDocument();

    // Verify experience section
    const experienceHeading = canvas.getByText('Experience');
    expect(experienceHeading).toBeInTheDocument();

    // Check for specific experience content
    expect(
      canvas.getByText('Senior Developer at Tech Solutions Inc.'),
    ).toBeInTheDocument();

    // Verify skills section
    const skillsHeading = canvas.getByText('Skills');
    expect(skillsHeading).toBeInTheDocument();

    // Check for specific skill
    expect(canvas.getByText('TypeScript')).toBeInTheDocument();

    // Verify education section
    const educationHeading = canvas.getByText('Education');
    expect(educationHeading).toBeInTheDocument();

    // Verify projects section
    const projectsHeading = canvas.getByText('Projects');
    expect(projectsHeading).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    cv: null,
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify loading message is displayed
    const loadingMessage = canvas.getByText('Loading your optimized CV...');
    expect(loadingMessage).toBeInTheDocument();
  },
};

export const EmptyState: Story = {
  args: {
    cv: null,
    isLoading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify empty state message is displayed
    const emptyMessage = canvas.getByText('No CV data available');
    expect(emptyMessage).toBeInTheDocument();
  },
};
