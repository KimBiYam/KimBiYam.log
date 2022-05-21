import '../lib/styles/global.css';
import '../lib/styles/code.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { AnimatePresence } from 'framer-motion';
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

  const { isPop, currentScrollPosition } = usePreserveScroll();

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  const handleAnimateExitComplete = () => {
    if (isPop && currentScrollPosition !== 0) {
      window.scrollTo({ top: 0 });
      window.scrollTo({ top: currentScrollPosition, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <RecoilRoot>
      <Header />
      <MainLayout>
        <AnimatePresence
          exitBeforeEnter
          onExitComplete={handleAnimateExitComplete}
        >
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </MainLayout>
      <Footer />
      <ScrollToTopButton />
    </RecoilRoot>
  );
};

export default App;
