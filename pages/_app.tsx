import "../lib/styles/globals.css";
import "../lib/styles/code.css";
import type { AppProps } from "next/app";
import Header from "../components/base/Header";
import MainLayout from "../components/base/MainLayout";
import useGoogleAnalyticsPageView from "../hooks/useGoogleAnalyticsPageView";

function MyApp({ Component, pageProps }: AppProps) {
  useGoogleAnalyticsPageView();

  return (
    <>
      <Header />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

export default MyApp;
