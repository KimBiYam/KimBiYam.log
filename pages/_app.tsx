import "../lib/styles/globals.css";
import "../lib/styles/code.css";
import type { AppProps } from "next/app";
import Header from "../components/base/Header";
import MainLayout from "../components/base/MainLayout";
import useGoogleAnalyticsPageView from "../hooks/useGoogleAnalyticsPageView";
import { RecoilRoot } from "recoil";

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
    </>
  );
}

export default MyApp;
