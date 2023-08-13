'use client';

import { PropsWithChildren } from 'react';

import useDetectScroll from '../../hooks/useDetectScroll';
import useGoogleAnalyticsPageView from '../../hooks/useGoogleAnalyticsPageView';
import { usePreserveScroll } from '../../hooks/usePreserveScroll';

export default function ClientRootLayout({ children }: PropsWithChildren) {
  useGoogleAnalyticsPageView();
  usePreserveScroll();
  useDetectScroll();

  return <>{children}</>;
}
