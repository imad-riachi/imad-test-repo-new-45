import type { Meta, StoryObj } from '@storybook/react';
import CvRewrittenDisplay from './CvRewrittenDisplay';

// Sample CV data for testing
const originalCv = {
  name: 'John Doe',
  contactInfo: {
    email: 'john.doe@example.com',
    phone: '555-123-4567',
  },
  summary:
    'Experienced software developer with skills in JavaScript and React.',
  workExperience: [
    {
      company: 'Tech Company',
      position: 'Frontend Developer',
      period: '2020-Present',
      responsibilities: [
        'Developed web applications using React',
        'Worked with a team of 5 developers',
        'Improved website performance',
      ],
    },
  ],
  education: [
    {
      institution: 'University',
      degree: 'Computer Science',
      year: '2019',
    },
  ],
  skills: [{ name: 'JavaScript' }, { name: 'React' }, { name: 'HTML/CSS' }],
};

// Sample rewritten CV with enhancements
const rewrittenCv = {
  name: 'John Doe',
  contactInfo: {
    email: 'john.doe@example.com',
    phone: '555-123-4567',
  },
  summary:
    'Experienced software developer with skills in JavaScript and React seeking a Frontend Developer role where skills in React, TypeScript, and JavaScript can be utilized.',
  workExperience: [
    {
      company: 'Tech Company',
      position: 'Frontend Developer',
      period: '2020-Present',
      responsibilities: [
        'Developed web applications using React (key skill for this role)',
        'Collaborated with a team of 5 developers to deliver projects on time and within budget',
        'Improved website performance by 40% through code optimization',
      ],
    },
  ],
  education: [
    {
      institution: 'University',
      degree: 'Computer Science',
      year: '2019',
    },
  ],
  skills: [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'React', level: 'Advanced' },
    { name: 'HTML/CSS', level: 'Intermediate' },
    { name: 'TypeScript', level: 'Intermediate' },
  ],
};

// Sample matching skills
const matchingSkills = ['React', 'JavaScript'];

// Sample improvement suggestions
const improvements = [
  'Consider adding more TypeScript examples to your work experience',
  'Add quantifiable achievements to demonstrate your impact',
  'Include specific examples of projects related to React, JavaScript, TypeScript',
];

/**
 * CvRewrittenDisplay component shows the optimized version of a CV
 * after it has been processed for a specific job description
 */
const meta: Meta<typeof CvRewrittenDisplay> = {
  title: 'Components/CvRewrittenDisplay',
  component: CvRewrittenDisplay,
  parameters: {
    layout: 'padded',
  },
  args: {
    originalCv,
    rewrittenCv,
    matchingSkills,
    improvements,
  },
};

export default meta;
type Story = StoryObj<typeof CvRewrittenDisplay>;

/**
 * Default display with a rewritten CV and matches
 */
export const Default: Story = {};

/**
 * Display with no matching skills
 */
export const NoMatches: Story = {
  args: {
    matchingSkills: [],
  },
};

/**
 * Display with no improvement suggestions
 */
export const NoImprovements: Story = {
  args: {
    improvements: [],
  },
};

/**
 * Display with minimal CV data
 */
export const MinimalCv: Story = {
  args: {
    originalCv: {
      name: 'John Smith',
      contactInfo: {
        email: 'john.smith@example.com',
      },
      workExperience: [],
      education: [],
      skills: [{ name: 'JavaScript' }],
    },
    rewrittenCv: {
      name: 'John Smith',
      contactInfo: {
        email: 'john.smith@example.com',
      },
      summary: 'Beginner developer with interest in JavaScript development.',
      workExperience: [],
      education: [],
      skills: [{ name: 'JavaScript', level: 'Beginner' }],
    },
    matchingSkills: ['JavaScript'],
    improvements: [
      'Add work experience and education details',
      'Consider adding more skills relevant to the job description',
    ],
  },
};
