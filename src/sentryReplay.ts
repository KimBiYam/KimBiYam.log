import * as Sentry from '@sentry/nextjs';

// Kept in its own module so webpack emits Session Replay as an async chunk;
// see instrumentation-client.ts.
export const createReplayIntegration = () =>
  Sentry.replayIntegration({
    maskAllText: true,
    blockAllMedia: true,
  });
