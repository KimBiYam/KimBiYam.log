/* eslint-disable @next/next/no-page-custom-font */
import { PropsWithChildren } from 'react';

import Script from 'next/script';

import { PAGE_TITLE_SUFFIX } from '@src/constants/metadata';

import Pretendard from './fonts/Prtendard/Pretendard';
import { generateOpenGraphMetaData } from './metadataBase';
import { theme as tailwindTheme } from '../../tailwind.config';
import ClientRootLayout from '../components/base/ClientRootLayout';
import MainLayout from '../components/base/MainLayout';
import ThemeProvider from '../components/base/ThemeProvider';
import GoogleAnalytics from '../components/scripts/GoogleAnalytics';

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
    <html lang="ko" className={Pretendard.className}>
      <head>
        <Script src="/setViewportProperty.js" />
        <Script src="/prettyConsole.js" strategy="lazyOnload" />
        <GoogleAnalytics />
      </head>
      <body className="main-container main-font-color">
        <ClientRootLayout>
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </ClientRootLayout>
      </body>
    </html>
  );
}
