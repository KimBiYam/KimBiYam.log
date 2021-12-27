import "../lib/styles/global.css";
import "../lib/styles/code.css";
import type { AppProps } from "next/app";
import Header from "../components/base/Header";
import MainLayout from "../components/base/MainLayout";
import useGoogleAnalyticsPageView from "../hooks/useGoogleAnalyticsPageView";
import { RecoilRoot } from "recoil";
import * as sentryUtil from "../lib/utils/sentry.util";
import Footer from "../components/base/Footer";

const isProduction = process.env.NODE_ENV === "production";

isProduction && sentryUtil.init();

function MyApp({ Component, pageProps }: AppProps) {
  useGoogleAnalyticsPageView();

  return (
    <>
      <Header />
      <MainLayout>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </MainLayout>
      <Footer />
    </>
  );
}

export default MyApp;
