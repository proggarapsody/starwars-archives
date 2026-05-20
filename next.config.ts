import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [80, 120, 160, 240, 320, 420, 560],
    remotePatterns: [
      { protocol: 'https', hostname: 'vignette.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
    ],
  },
};

export default nextConfig;
