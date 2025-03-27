import type { Meta, StoryObj } from '@storybook/react';
import PricingFeature from './PricingFeature';

const meta: Meta<typeof PricingFeature> = {
  title: 'Components/PricingFeature',
  component: PricingFeature,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PricingFeature>;

export const Default: Story = {
  args: {
    feature: 'Unlimited users',
    index: 0,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-500',
    highlight: false,
    delay: 0.1,
  },
};

export const Highlighted: Story = {
  args: {
    feature: 'AI powered CV optimization',
    index: 1,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-500',
    highlight: true,
    delay: 0.2,
  },
};
