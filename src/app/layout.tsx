/* eslint-disable @next/next/no-page-custom-font */
import { PropsWithChildren } from 'react';

import Script from 'next/script';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';

import { GOOGLE_ANALYTICS_TRACKING_ID } from '@src/constants/foundation';
import { PAGE_TITLE_SUFFIX } from '@src/constants/metadata';

import { generateOpenGraphMetaData } from './metadataBase';
import { theme as tailwindTheme } from '../../tailwind.config';
import ClientRootLayout from '../components/base/ClientRootLayout';
import MainLayout from '../components/base/MainLayout';
import ThemeProvider from '../components/base/ThemeProvider';

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
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard-dynamic-subset.css"
        />
        <Script src="/setViewportProperty.js" />
        <Script src="/prettyConsole.js" strategy="lazyOnload" />
      </head>
      <body className="main-container main-font-color">
        <ClientRootLayout>
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </ClientRootLayout>
        <Analytics />
      </body>
      <GoogleAnalytics gaId={GOOGLE_ANALYTICS_TRACKING_ID} />
    </html>
  );
}
