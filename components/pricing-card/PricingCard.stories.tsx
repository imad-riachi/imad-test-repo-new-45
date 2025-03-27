import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PricingCardProps } from './PricingCard';
import React from 'react';

// Create a mock component that won't depend on the ServerActions
const MockPricingCard = (props: PricingCardProps) => {
  const {
    name,
    price,
    interval,
    trialDays,
    features,
    gradientFrom,
    gradientTo,
    hoverFrom,
    hoverTo,
    hoverBorderColor,
    hoverShadowColor,
    featured,
    highlightFeatureIndex,
    priceId,
  } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mock checkout for:', priceId);
  };

  // Import these components directly to avoid the Stripe dependency
  const MockPricingFeature = ({
    feature,
    index,
    gradientFrom,
    gradientTo,
    highlight = false,
    delay,
  }: {
    feature: string;
    index: number;
    gradientFrom: string;
    gradientTo: string;
    highlight?: boolean;
    delay: number;
  }) => (
    <li className='flex items-start'>
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}
      >
        <span>✓</span>
      </div>
      <span className='ml-3 text-lg text-gray-700'>{feature}</span>
      {highlight && (
        <div className='ml-2 flex items-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700'>
          <span className='mr-1'>⭐</span> New
        </div>
      )}
    </li>
  );

  const MockPricingSubmitButton = ({
    gradientFrom,
    gradientTo,
    hoverFrom,
    hoverTo,
    label = 'Get Started',
  }: {
    gradientFrom: string;
    gradientTo: string;
    hoverFrom: string;
    hoverTo: string;
    label?: string;
  }) => (
    <button
      className={`group relative w-full overflow-hidden rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} px-8 py-4 font-medium text-white shadow-md`}
    >
      <span className='relative z-10 flex items-center justify-center'>
        {label}
        <span className='ml-2'>→</span>
      </span>
    </button>
  );

  return (
    <div className='relative'>
      <div
        className={`relative overflow-hidden rounded-3xl border-2 border-transparent bg-white p-8 shadow-lg transition-all duration-300 ${
          featured ? `${hoverBorderColor} shadow-xl ${hoverShadowColor}` : ''
        }`}
      >
        <div className='relative'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>{name}</h2>
            <p className='mt-2 text-gray-600'>
              with {trialDays} day free trial
            </p>
          </div>

          <div className='mb-8'>
            <div className='flex items-baseline'>
              <span className='text-5xl font-bold text-gray-900'>
                ${price / 100}
              </span>
              <span className='ml-2 text-lg text-gray-600'>
                per user / {interval}
              </span>
            </div>
          </div>

          <ul className='mb-8 space-y-5'>
            {features.map((feature, index) => (
              <MockPricingFeature
                key={index}
                feature={feature}
                index={index}
                gradientFrom={gradientFrom}
                gradientTo={gradientTo}
                highlight={index === highlightFeatureIndex}
                delay={featured ? 0.3 + index * 0.1 : 0.2 + index * 0.1}
              />
            ))}
          </ul>
          <form onSubmit={handleSubmit}>
            <input type='hidden' name='priceId' value={priceId} />
            <MockPricingSubmitButton
              label='Get Started'
              gradientFrom={gradientFrom}
              gradientTo={gradientTo}
              hoverFrom={hoverFrom}
              hoverTo={hoverTo}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockPricingCard> = {
  title: 'Components/PricingCard',
  component: MockPricingCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockPricingCard>;

export const Basic: Story = {
  args: {
    name: 'Basic',
    price: 1000,
    interval: 'month',
    trialDays: 14,
    features: [
      'Up to 10 users',
      'Basic analytics',
      'Email support',
      '5GB storage',
    ],
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-blue-600',
    hoverFrom: 'from-blue-500',
    hoverTo: 'to-blue-700',
    hoverBorderColor: 'border-blue-400',
    hoverShadowColor: 'shadow-blue-100',
    featured: false,
    priceId: 'price_basic',
  },
};

export const Premium: Story = {
  args: {
    name: 'Premium',
    price: 4900,
    interval: 'month',
    trialDays: 14,
    features: [
      'Unlimited users',
      'Advanced analytics',
      'Priority support',
      'Unlimited storage',
      'Custom integrations',
      'API access',
    ],
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-pink-500',
    hoverFrom: 'from-orange-500',
    hoverTo: 'to-pink-600',
    hoverBorderColor: 'border-pink-400',
    hoverShadowColor: 'shadow-pink-100',
    featured: true,
    highlightFeatureIndex: 4,
    priceId: 'price_premium',
  },
};
