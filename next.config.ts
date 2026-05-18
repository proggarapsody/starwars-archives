import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'vignette.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
    ],
  },
};

export default nextConfig;
