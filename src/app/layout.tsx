/* eslint-disable @next/next/no-page-custom-font */
import { PropsWithChildren } from 'react';

import Script from 'next/script';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { GOOGLE_ANALYTICS_TRACKING_ID } from '@src/constants/foundation';
import { PAGE_TITLE_SUFFIX } from '@src/constants/metadata';

import { generateOpenGraphMetaData } from './metadataBase';
import { theme as tailwindTheme } from '../../tailwind.config';
import ClientRootLayout from '../components/base/ClientRootLayout';

import type { Metadata, Viewport } from 'next';

import '../lib/styles/global.css';
import '../lib/styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    template: `%s${PAGE_TITLE_SUFFIX}`,
    default: `KimBiYam.log`,
  },
  description: 'KimBiYam의 개발 블로그 입니다.',
  keywords: 'blog,블로그,kimbiyam,kimbiyam.log,hot9998',
  formatDetection: { telephone: false },
  twitter: { card: 'summary' },
  openGraph: generateOpenGraphMetaData({
    title: {
      template: `%s${PAGE_TITLE_SUFFIX}`,
      default: `KimBiYam.log`,
    },
  }),
  other: {
    ['google-site-verification']: String(
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_KEY,
    ),
    ['naver-site-verification']: String(
      process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_KEY,
    ),
  },
};

export const viewport: Viewport = {
  themeColor: tailwindTheme.colors.neutral[900],
};

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet preload"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="main-container main-font-color">
        <ClientRootLayout>{children}</ClientRootLayout>
        <Script src="/setViewportProperty.js" strategy="lazyOnload" />
        <Script src="/prettyConsole.js" strategy="lazyOnload" />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_TRACKING_ID} />
      </body>
    </html>
  );
}
