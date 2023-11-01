/* eslint-disable @next/next/no-page-custom-font */
import { PropsWithChildren } from 'react';

import Script from 'next/script';

import { PAGE_TITLE_SUFFIX } from '@src/constants/metadata';

import { theme as tailwindTheme } from '../../tailwind.config';
import ClientRootLayout from '../components/base/ClientRootLayout';
import ClientHackleProvider from '../components/base/HackleProvider';
import MainLayout from '../components/base/MainLayout';
import ThemeProvider from '../components/base/ThemeProvider';
import GoogleAnalytics from '../components/scripts/GoogleAnalytics';
import { generateOpenGraphMetaData } from './metadataBase';

import type { Metadata } from 'next';

import '../lib/styles/code.css';
import '../lib/styles/global.css';
import '../lib/styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    template: `%s${PAGE_TITLE_SUFFIX}`,
    default: `KimBiYam.log`,
  },
  description: 'KimBiYam의 개발 블로그 입니다.',
  viewport:
    'width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover',
  keywords: 'blog,블로그,kimbiyam,kimbiyam.log,hot9998',
  formatDetection: { telephone: false },
  twitter: { card: 'summary' },
  themeColor: tailwindTheme.colors.neutral[900],
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

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard-dynamic-subset.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap"
          rel="stylesheet"
        />
        <Script src="/setViewportProperty.js" />
        <Script src="/prettyConsole.js" strategy="lazyOnload" />
        <GoogleAnalytics />
      </head>
      <body className="main-container main-font-color">
        <ClientHackleProvider>
          <ClientRootLayout>
            <ThemeProvider>
              <MainLayout>{children}</MainLayout>
            </ThemeProvider>
          </ClientRootLayout>
        </ClientHackleProvider>
      </body>
    </html>
  );
}
