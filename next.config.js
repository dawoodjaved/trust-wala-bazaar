/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // PWA configuration will be added later
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

module.exports = nextConfig;

