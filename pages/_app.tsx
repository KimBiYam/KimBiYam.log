import "../lib/styles/globals.css";
import "../lib/styles/code.css";
import type { AppProps } from "next/app";
import Header from "../components/base/Header";
import MainLayout from "../components/base/MainLayout";
import Meta from "../components/base/Meta";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Meta />
      <Header />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

export default MyApp;
