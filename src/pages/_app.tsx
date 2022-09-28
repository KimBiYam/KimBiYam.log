import type { AppProps } from 'next/app';
import Script from 'next/script';

import { AnimatePresence, domAnimation, LazyMotion } from 'framer-motion';
import smoothscroll from 'smoothscroll-polyfill';

import Footer from '../components/base/Footer';
import Header from '../components/base/Header';
import MainLayout from '../components/base/MainLayout';
import ScrollToTopButton from '../components/base/ScrollToTopButton';
import GoogleAnalytics from '../components/scripts/GoogleAnalytics';
import { IS_BROWSER, IS_PRODUCTION } from '../constants';
import useDetectScroll from '../hooks/useDetectScroll';
import useGoogleAnalyticsPageView from '../hooks/useGoogleAnalyticsPageView';
import { usePreserveScroll } from '../hooks/usePreserveScroll';
import * as sentryUtil from '../lib/utils/sentry.util';

import '../lib/styles/code.css';
import '../lib/styles/global.css';
import '../lib/styles/tailwind.css';

if (IS_PRODUCTION) sentryUtil.init();
if (IS_BROWSER) smoothscroll.polyfill();

const App = ({ Component, pageProps }: AppProps) => {
  useGoogleAnalyticsPageView();
  usePreserveScroll();
  useDetectScroll();

  return (
    <>
      <Script src="/prettyConsole.js" strategy="lazyOnload" />
      <GoogleAnalytics />
      <LazyMotion strict features={domAnimation}>
        <Header />
        <MainLayout>
          <AnimatePresence>
            <Component {...pageProps} />
          </AnimatePresence>
        </MainLayout>
        <Footer />
        <ScrollToTopButton />
      </LazyMotion>
    </>
  );
};

export default App;
