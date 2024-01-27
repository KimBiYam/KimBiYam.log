'use client';

import { PropsWithChildren } from 'react';

import useDetectScroll from '@src/hooks/useDetectScroll';
import useGoogleAnalyticsPageView from '@src/hooks/useGoogleAnalyticsPageView';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useGoogleAnalyticsPageView();
  useDetectScroll();

  return <>{children}</>;
}
