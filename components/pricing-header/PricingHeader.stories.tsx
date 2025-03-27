import type { Meta, StoryObj } from '@storybook/react';
import PricingHeader from './PricingHeader';

const meta: Meta<typeof PricingHeader> = {
  title: 'Components/PricingHeader',
  component: PricingHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PricingHeader>;

export const Default: Story = {
  args: {
    title: 'Simple Pricing',
    subtitle: 'Start for free, pay as you grow. No credit card required.',
  },
};

export const WithHighlight: Story = {
  args: {
    title: 'Choose your Pricing',
    subtitle: 'Get unlimited features with our premium plans.',
  },
};
