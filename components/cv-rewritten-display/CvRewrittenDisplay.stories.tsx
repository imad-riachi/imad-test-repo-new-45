import type { Meta, StoryObj } from '@storybook/react';
import CvRewrittenDisplay from './CvRewrittenDisplay';
import { RewriteResponse } from '@/lib/cv-rewriter/rewriter';

const meta: Meta<typeof CvRewrittenDisplay> = {
  title: 'Components/CvRewrittenDisplay',
  component: CvRewrittenDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CvRewrittenDisplay>;

// Sample CV data and rewrite response for the stories
const sampleRewriteResponse: RewriteResponse = {
  originalCv: {
    name: 'John Doe',
    contactInfo: {
      email: 'john.doe@example.com',
      phone: '+1 123-456-7890',
      linkedin: 'linkedin.com/in/johndoe',
    },
    summary:
      'Experienced software engineer with 5+ years of expertise in web development and cloud technologies.',
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Developer',
        period: '2020-Present',
        responsibilities: [
          'Developed web applications using React and Node.js',
          'Led a team of 5 developers for multiple projects',
          'Improved application performance by 40%',
        ],
      },
      {
        company: 'WebDev Company',
        position: 'Frontend Developer',
        period: '2018-2020',
        responsibilities: [
          'Built responsive UIs using modern JavaScript frameworks',
          'Collaborated with designers to implement user interfaces',
          'Participated in code reviews and mentored junior developers',
        ],
      },
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        year: '2018',
      },
    ],
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'HTML/CSS', level: 'Expert' },
    ],
    languages: ['English', 'Spanish'],
  },

  rewrittenCv: {
    name: 'John Doe',
    contactInfo: {
      email: 'john.doe@example.com',
      phone: '+1 123-456-7890',
      linkedin: 'linkedin.com/in/johndoe',
    },
    summary:
      'Experienced software engineer with 5+ years of expertise in web development and cloud technologies. Particularly skilled in React Native, mobile app development, and user experience design, with a proven track record of delivering results aligned with business objectives.',
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Developer',
        period: '2020-Present',
        responsibilities: [
          'Developed scalable mobile applications using React Native and Node.js',
          'Led a team of 5 developers to deliver cross-platform mobile solutions for multiple clients',
          'Improved application performance by 40% through code optimization and architecture improvements',
        ],
      },
      {
        company: 'WebDev Company',
        position: 'Frontend Developer',
        period: '2018-2020',
        responsibilities: [
          'Implemented responsive UIs using modern JavaScript frameworks including React Native',
          'Collaborated with designers to implement pixel-perfect mobile interfaces',
          'Participated in code reviews and mentored junior developers on mobile development best practices',
        ],
      },
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        year: '2018',
      },
    ],
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React', level: 'Advanced' },
      { name: 'React Native', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'HTML/CSS', level: 'Expert' },
      { name: 'Mobile App Development', level: 'Advanced' },
    ],
    languages: ['English', 'Spanish'],
  },

  jobDescription: `
    Senior Mobile Developer (React Native)
    
    ABC Mobile Technologies is looking for an experienced Senior Mobile Developer with strong React Native skills to join our team. The ideal candidate will have a proven track record of building high-quality, performant mobile applications for both iOS and Android platforms.
    
    Key Requirements:
    - 3+ years of experience with React Native development
    - Strong understanding of mobile UX/UI principles
    - Experience with state management in complex applications
    - Knowledge of native modules integration
    - Ability to optimize application performance
    - Experience leading development teams is a plus
    
    We offer competitive compensation, flexible working arrangements, and opportunities for professional growth.
  `,

  matches: {
    skills: [
      'React',
      'JavaScript',
      'Node.js',
      'React Native',
      'Mobile App Development',
    ],
    experience: [
      'Senior Developer at Tech Solutions Inc.: Developed scalable mobile applications using React Native and Node.js',
      'Senior Developer at Tech Solutions Inc.: Led a team of 5 developers to deliver cross-platform mobile solutions for multiple clients',
      'Frontend Developer at WebDev Company: Implemented responsive UIs using modern JavaScript frameworks including React Native',
    ],
  },

  improvements: [
    'Enhanced professional summary to better align with job requirements',
    'Highlighted mobile development experience throughout work history',
    'Added more relevant skills like React Native and Mobile App Development',
    'Emphasized team leadership experience which is listed as a plus in the job posting',
  ],
};

// Default story
export const Default: Story = {
  args: {
    rewriteResponse: sampleRewriteResponse,
    className: 'max-w-screen-xl',
  },
};

// Minimal Matches
export const MinimalMatches: Story = {
  args: {
    rewriteResponse: {
      ...sampleRewriteResponse,
      matches: {
        skills: ['JavaScript'],
        experience: [],
      },
      improvements: [
        'Add more skills mentioned in the job description such as React Native',
        'Include examples of mobile development experience in your work history',
        'Consider mentioning any experience with native module integration',
      ],
    },
    className: 'max-w-screen-xl',
  },
};
