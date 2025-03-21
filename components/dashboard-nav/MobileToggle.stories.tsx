import type { Meta, StoryObj } from '@storybook/react';
import { MobileToggle } from './mobile-toggle';

const meta: Meta<typeof MobileToggle> = {
  title: 'Components/MobileToggle',
  component: MobileToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MobileToggle>;

export const Default: Story = {
  args: {},
};
