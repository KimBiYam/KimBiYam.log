/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-require-imports */

const { codeInspectorPlugin } = require('code-inspector-plugin');

/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const defaultConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1024, 1280],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));

    return config;
  },
  experimental: {
    reactCompiler: true,
  },
};

// eslint-disable-next-line import/order, @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer');

const nextConfig = (() => {
  try {
    if (process.env.ANALYZE && JSON.parse(process.env.ANALYZE) === true) {
      return withBundleAnalyzer(defaultConfig);
    }

    return defaultConfig;
  } catch (e) {
    return defaultConfig;
  }
})();

// Injected content via Sentry wizard below

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'kimbiyam',
  project: 'kimbiyam-log',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
