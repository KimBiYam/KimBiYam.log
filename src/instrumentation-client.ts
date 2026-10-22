// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://51c548caea0de86c38768de5cd950a5e@o4507321481691136.ingest.us.sentry.io/4507321484115968',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  enableLogs: true,
});

// Session Replay (rrweb) is loaded after the page becomes idle so it stays out of the initial bundle.
// The replay sample rates above are applied when the integration is added.
const loadReplayIntegration = async () => {
  try {
    const { replayIntegration } = await import('@sentry/nextjs');

    Sentry.addIntegration(
      replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    );
  } catch {
    // Replay is optional; failing to load it must not affect the page.
    Sentry.addBreadcrumb({
      category: 'sentry.replay',
      level: 'warning',
      message: 'Failed to lazy load Session Replay integration',
    });
  }
};

const scheduleReplayIntegration = () => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => void loadReplayIntegration(), {
      timeout: 3000,
    });
  } else {
    setTimeout(() => void loadReplayIntegration(), 1);
  }
};

if (document.readyState === 'complete') {
  scheduleReplayIntegration();
} else {
  window.addEventListener('load', scheduleReplayIntegration, { once: true });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
