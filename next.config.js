/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    deviceSizes: [480, 768, 1024, 1280],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer');

module.exports = (() => {
  try {
    if (process.env.ANALYZE && JSON.parse(process.env.ANALYZE) === true) {
      return withBundleAnalyzer(nextConfig);
    }

    return nextConfig;
  } catch (e) {
    return nextConfig;
  }
})();
