import "../lib/styles/globals.css";
import "../lib/styles/code.css";
import type { AppProps } from "next/app";
import Header from "../components/base/Header";
import MainLayout from "../components/base/MainLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as ga from "../lib/ga";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

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
