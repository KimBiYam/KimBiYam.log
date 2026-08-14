import { PropsWithChildren } from 'react';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { PAGE_TITLE_SUFFIX } from '@src/_app';
import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { GOOGLE_ANALYTICS_TRACKING_ID } from '@src/shared/constants/foundation';
import { DOMAIN_URL } from '@src/shared/constants/server';
import { PROFILE } from '@src/shared/constants/profile';

import { generateOpenGraphMetaData } from './metadataBase';
import { theme as tailwindTheme } from '../../tailwind.config';
import ClientRootLayout from '../_app/ui/ClientRootLayout';

import type { Metadata, Viewport } from 'next';

import '../shared/styles/global.css';
import '../shared/styles/tailwind.css';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    template: `%s${PAGE_TITLE_SUFFIX}`,
    default: `KimBiYam.log`,
  },
  description: 'KimBiYam의 개발 블로그 입니다.',
  authors: [{ name: PROFILE.name, url: PROFILE.social.github }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  keywords: 'blog,블로그,kimbiyam,kimbiyam.log,hot9998',
  formatDetection: { telephone: false },
  twitter: {
    card: 'summary_large_image',
    title: 'KimBiYam.log',
    description: 'KimBiYam의 개발 블로그 입니다.',
    images: [ogTagImage.src],
  },
  openGraph: generateOpenGraphMetaData({
    title: {
      template: `%s${PAGE_TITLE_SUFFIX}`,
      default: `KimBiYam.log`,
    },
  }),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_KEY,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_KEY
      ? {
          'naver-site-verification': [
            process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_KEY,
          ],
        }
      : undefined,
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
