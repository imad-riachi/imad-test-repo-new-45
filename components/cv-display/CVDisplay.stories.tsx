import { Meta, StoryObj } from '@storybook/react';
import CVDisplay from './CVDisplay';

const meta: Meta<typeof CVDisplay> = {
  title: 'Components/CVDisplay',
  component: CVDisplay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CVDisplay>;

export const Default: Story = {
  args: {
    cvContent: `# John Doe
Frontend Developer

## Summary
Experienced Frontend Developer with 5 years of expertise in React, TypeScript, and Next.js.

## Experience
### Senior Frontend Developer
XYZ Company | Jan 2020 - Present
- Developed responsive web applications using React and TypeScript
- Implemented state management with Redux and Context API
- Collaborated with UX/UI designers to create pixel-perfect interfaces

### Junior Frontend Developer
ABC Agency | Mar 2018 - Dec 2019
- Built and maintained client websites using HTML, CSS, and JavaScript
- Assisted senior developers with code reviews and bug fixes
- Participated in daily stand-up meetings and sprint planning

## Skills
- React, Next.js, TypeScript
- HTML5, CSS3, SASS
- Git, GitHub, GitLab
- Jest, React Testing Library
`,
  },
};

export const Loading: Story = {
  args: {
    cvContent: '',
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    cvContent: '',
    error: 'Failed to load CV content. Please try again later.',
  },
};

export const Empty: Story = {
  args: {
    cvContent: '',
  },
};
