import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  webpack: (config) => {
    // This is required for the buffer package to work in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };
    return config;
  },
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
