import type { Meta, StoryObj } from '@storybook/react';
import CVDownload from './CVDownload';

const meta: Meta<typeof CVDownload> = {
  title: 'Components/CVDownload',
  component: CVDownload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CVDownload>;

const sampleCV = `John Doe
Frontend Developer

Experience
-----------
2020-Present: Senior Developer at Tech Co
2018-2020: Junior Developer at Startup Inc

Skills
-----------
JavaScript, React, TypeScript, Node.js`;

export const Default: Story = {
  args: {
    cvContent: sampleCV,
  },
};

export const Empty: Story = {
  args: {
    cvContent: '',
  },
};

export const WithCustomClass: Story = {
  args: {
    cvContent: sampleCV,
    className: 'mt-8 justify-center',
  },
};
