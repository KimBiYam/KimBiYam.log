import type { AppProps } from 'next/app';
import smoothscroll from 'smoothscroll-polyfill';
import { useEffect } from 'react';
import Header from '../components/base/Header';
import MainLayout from '../components/base/MainLayout';
import useGoogleAnalyticsPageView from '../hooks/useGoogleAnalyticsPageView';
import * as sentryUtil from '../lib/utils/sentry.util';
import Footer from '../components/base/Footer';
import { IS_PRODUCTION } from '../constants';
import ScrollToTopButton from '../components/base/ScrollToTopButton';
import { usePreserveScroll } from '../hooks/usePreserveScroll';

import '../lib/styles/global.css';
import '../lib/styles/code.css';
import '../lib/styles/tailwind.css';

if (IS_PRODUCTION) sentryUtil.init();

const App = ({ Component, pageProps }: AppProps) => {
  useGoogleAnalyticsPageView();
  usePreserveScroll();

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <>
      <Header />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default App;
