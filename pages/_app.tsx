import '../lib/styles/global.css';
import '../lib/styles/code.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import Header from '../components/base/Header';
import MainLayout from '../components/base/MainLayout';
import useGoogleAnalyticsPageView from '../hooks/useGoogleAnalyticsPageView';
import * as sentryUtil from '../lib/utils/sentry.util';
import Footer from '../components/base/Footer';
import { IS_PRODUCTION } from '../constants';

if (IS_PRODUCTION) sentryUtil.init();

function MyApp({ Component, pageProps }: AppProps) {
  useGoogleAnalyticsPageView();

  return (
    <RecoilRoot>
      <Header />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <Footer />
    </RecoilRoot>
  );
}

export default MyApp;
