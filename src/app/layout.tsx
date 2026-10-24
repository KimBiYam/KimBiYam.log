import { PropsWithChildren } from 'react';
import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { PAGE_TITLE_SUFFIX } from '@src/_app';
import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { GOOGLE_ANALYTICS_TRACKING_ID } from '@src/shared/constants/foundation';
import { FEED_ALTERNATE_TYPES } from '@src/shared/constants/metadata';
import { DOMAIN_URL } from '@src/shared/constants/server';
import { PROFILE } from '@src/shared/constants/profile';
import { THEME_COLOR } from '@src/shared/constants/theme';

import { generateOpenGraphMetaData } from './metadataBase';
import ClientRootLayout from '../_app/ui/ClientRootLayout';

import type { Metadata, Viewport } from 'next';

import '../shared/styles/global.css';
import '../shared/styles/tailwind.css';

// Single-file Pretendard subset (wght 400-800) built from the glyphs used in
// contents/ and src/. Regenerate with `python3 scripts/pretendard-subset.py`.
const sansFont = localFont({
  src: '../shared/assets/fonts/PretendardVariable.subset.woff2',
  weight: '400 800',
  display: 'swap',
  variable: '--font-sans',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

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
  alternates: { types: FEED_ALTERNATE_TYPES },
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLOR.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLOR.dark },
  ],
};

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html
      lang="ko"
      className={`${sansFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
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
