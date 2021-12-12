import Head from "next/head";
import Favicon from "./Favicon";
import favicon192 from "../../assets/favicon/favicon-192x192.png";
import useThemeStorage from "../../hooks/useThemeStorage";
import { Theme } from "../../constants";

export type PageHeadProps = {
  description: string;
  title: string;
};

const PageHead = ({ title, description }: PageHeadProps) => {
  const { theme } = useThemeStorage();

  return (
    <Head>
      <Favicon />
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
      />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
      <meta
        name="theme-color"
        content={theme === Theme.dark ? "#262626" : "#ffffff"}
      />
      <meta
        name="keywords"
        content="blog,블로그,kimbiyam,kimbiyam.log,hot9998"
      />
      <meta name="format-detection" content="telephone=no" />
      {/* TODO : change to real domain */}
      <meta name="twitter:site" content="KimBiYam.log" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:card" content={favicon192.src} />
      {/* TODO : change to real domain */}
      <meta name="twitter:url" content="https://kimbiyam.log" />
      <meta property="og:url" content="https://kimbiyam.log" />
      <meta property="og:image" content={favicon192.src} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="description" content={description} />
    </Head>
  );
};

export default PageHead;