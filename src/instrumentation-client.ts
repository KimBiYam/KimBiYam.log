// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://51c548caea0de86c38768de5cd950a5e@o4507321481691136.ingest.us.sentry.io/4507321484115968',

  // Automated runs (e2e/CI) set NEXT_PUBLIC_SENTRY_DISABLED=true so they do not report to production Sentry.
  enabled: process.env.NEXT_PUBLIC_SENTRY_DISABLED !== 'true',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  enableLogs: true,
});

// Session Replay is the largest part of the SDK, so it is added from an async
// chunk right after init instead of shipping in every route's First Load JS.
// The sample rates above still apply once the integration is registered.
import('@src/sentryReplay').then(({ createReplayIntegration }) => {
  Sentry.addIntegration(createReplayIntegration());
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
