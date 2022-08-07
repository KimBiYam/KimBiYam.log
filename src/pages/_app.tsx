import type { AppProps } from 'next/app';
import smoothscroll from 'smoothscroll-polyfill';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import NextNProgress from 'nextjs-progressbar';
import Header from '../components/base/Header';
import MainLayout from '../components/base/MainLayout';
import useGoogleAnalyticsPageView from '../hooks/useGoogleAnalyticsPageView';
import * as sentryUtil from '../lib/utils/sentry.util';
import Footer from '../components/base/Footer';
import { IS_PRODUCTION } from '../constants';
import ScrollToTopButton from '../components/base/ScrollToTopButton';
import { usePreserveScroll } from '../hooks/usePreserveScroll';
import { theme as tailwindTheme } from '../../tailwind.config';

import '../lib/styles/global.css';
import '../lib/styles/code.css';
import '../lib/styles/tailwind.css';
import PageHead from '../components/base/PageHead';

if (IS_PRODUCTION) sentryUtil.init();

const App = ({ Component, pageProps }: AppProps) => {
  useGoogleAnalyticsPageView();
  usePreserveScroll();

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <>
      <PageHead />
      <NextNProgress
        color={tailwindTheme.colors.blue[300]}
        options={{ showSpinner: false }}
        showOnShallow={false}
      />
      <Header />
      <MainLayout>
        <AnimatePresence>
          <Component {...pageProps} />
        </AnimatePresence>
      </MainLayout>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default App;
