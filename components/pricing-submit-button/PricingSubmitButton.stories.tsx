import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import PricingSubmitButton from './PricingSubmitButton';

const meta: Meta<typeof PricingSubmitButton> = {
  title: 'Components/PricingSubmitButton',
  component: PricingSubmitButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PricingSubmitButton>;

export const Primary: Story = {
  args: {
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-500',
    hoverFrom: 'from-blue-600',
    hoverTo: 'to-purple-600',
    label: 'Get Started',
  },
};

export const Secondary: Story = {
  args: {
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-pink-500',
    hoverFrom: 'from-orange-600',
    hoverTo: 'to-pink-600',
    label: 'Subscribe Now',
  },
};
