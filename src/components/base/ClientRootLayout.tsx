'use client';

import { PropsWithChildren } from 'react';

import useDetectScroll from '@src/hooks/useDetectScroll';
import useGoogleAnalyticsPageView from '@src/hooks/useGoogleAnalyticsPageView';
import { usePreserveScroll } from '@src/hooks/usePreserveScroll';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useGoogleAnalyticsPageView();
  usePreserveScroll();
  useDetectScroll();

  return <>{children}</>;
}
