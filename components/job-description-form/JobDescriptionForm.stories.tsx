import type { Meta, StoryObj } from '@storybook/react';
import JobDescriptionForm from './JobDescriptionForm';

const meta: Meta<typeof JobDescriptionForm> = {
  title: 'Components/JobDescriptionForm',
  component: JobDescriptionForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRewriteComplete: { action: 'CV rewritten' },
    onRewriteError: { action: 'error occurred' },
  },
};

export default meta;
type Story = StoryObj<typeof JobDescriptionForm>;

// Sample CV data for the stories
const sampleCvData = {
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
        'Developed scalable web applications using React and Node.js',
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
        'Collaborated with designers to implement pixel-perfect interfaces',
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
};

// Default story
export const Default: Story = {
  args: {
    cvData: sampleCvData,
    className: 'max-w-lg',
  },
};

// Empty state
export const Empty: Story = {
  args: {
    cvData: {
      name: '',
      contactInfo: {},
      summary: '',
      workExperience: [],
      education: [],
      skills: [],
    },
    className: 'max-w-lg',
  },
};

// Submitting state
export const Submitting: Story = {
  args: {
    cvData: sampleCvData,
    className: 'max-w-lg',
  },
  render: (args) => {
    return (
      <div className='max-w-lg'>
        <JobDescriptionForm {...args} />
        <div className='bg-muted mt-4 rounded border p-4'>
          <p className='text-sm'>
            This story simulates the form in its submitting state. In the actual
            component, this state would be triggered when clicking the submit
            button.
          </p>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // A mock job description for the story
    const jobDescription = `
      We are looking for a skilled Frontend Developer with expertise in React and TypeScript.
      The ideal candidate will have 3+ years of experience with modern JavaScript frameworks
      and a solid understanding of web performance optimization. Knowledge of Node.js is a plus.
    `;

    // Find the textarea and button elements
    const textarea = canvasElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    const button = canvasElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    // Set the textarea value
    if (textarea) {
      textarea.value = jobDescription;
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Disable the button to simulate the submitting state
    if (button) {
      button.disabled = true;
      button.textContent = 'Optimizing CV...';
    }
  },
};
