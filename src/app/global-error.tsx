'use client';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

import NotFoundPage from './not-found';

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <NotFoundPage />;
}
