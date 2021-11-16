import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import MainLayout from "../components/MainLayout";

function MyApp({ Component, pageProps }: AppProps) {
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
