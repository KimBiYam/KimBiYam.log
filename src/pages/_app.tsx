import '../lib/styles/global.css';
import '../lib/styles/code.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
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

if (IS_PRODUCTION) sentryUtil.init();

const App = ({ Component, pageProps, router }: AppProps) => {
  useGoogleAnalyticsPageView();
  usePreserveScroll();

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <RecoilRoot>
      <Header />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <Footer />
      <ScrollToTopButton />
    </RecoilRoot>
  );
};

export default App;
