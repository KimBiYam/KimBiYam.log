/* eslint-disable @next/next/no-page-custom-font */
import { PropsWithChildren } from 'react';

import Script from 'next/script';

import Header from '../components/base/Header';
import MainLayout from '../components/base/MainLayout';
import GoogleAnalytics from '../components/scripts/GoogleAnalytics';

import '../lib/styles/code.css';
import '../lib/styles/global.css';
import '../lib/styles/tailwind.css';

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
        <Script src="/theme.js" />
        <Script src="/setViewportProperty.js" />
        <Script src="/prettyConsole.js" strategy="lazyOnload" />
        <GoogleAnalytics />
      </head>
      <body className="main-container main-font-color">
        <Header />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
