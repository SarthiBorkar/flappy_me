/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Enable experimental features for better Web3 compatibility
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
