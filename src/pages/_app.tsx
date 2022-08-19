import type { AppProps } from 'next/app';
import smoothscroll from 'smoothscroll-polyfill';
import { AnimatePresence, domAnimation, LazyMotion } from 'framer-motion';
import Header from '../components/base/Header';
import MainLayout from '../components/base/MainLayout';
import useGoogleAnalyticsPageView from '../hooks/useGoogleAnalyticsPageView';
import * as sentryUtil from '../lib/utils/sentry.util';
import Footer from '../components/base/Footer';
import { IS_BROWSER, IS_PRODUCTION } from '../constants';
import ScrollToTopButton from '../components/base/ScrollToTopButton';
import { usePreserveScroll } from '../hooks/usePreserveScroll';

import '../lib/styles/global.css';
import '../lib/styles/code.css';
import '../lib/styles/tailwind.css';
import PageHead from '../components/base/PageHead';

if (IS_PRODUCTION) sentryUtil.init();
if (IS_BROWSER) smoothscroll.polyfill();

const App = ({ Component, pageProps }: AppProps) => {
  useGoogleAnalyticsPageView();
  usePreserveScroll();

  return (
    <>
      <PageHead />
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
