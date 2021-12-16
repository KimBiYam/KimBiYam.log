import Head from "next/head";
import Favicon from "./Favicon";
import favicon192 from "../../assets/favicon/favicon-192x192.png";
import { DOMAIN_URL, Theme } from "../../constants";
import useThemeStorage from "../../hooks/useThemeStorage";
import colors from "../../lib/styles/colors";

export type PageHeadProps = {
  description: string;
  title: string;
  url?: string;
};

const PageHead = ({ title, description, url }: PageHeadProps) => {
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
        content={theme === Theme.dark ? colors.trueGray800 : colors.white}
      />
      <meta name="color-scheme" content="light dark" />
      <meta
        name="keywords"
        content="blog,블로그,kimbiyam,kimbiyam.log,hot9998"
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="twitter:site" content="KimBiYam.log" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:card" content={favicon192.src} />
      <meta name="twitter:url" content={`${DOMAIN_URL}${url}`} />
      <meta property="og:url" content={`${DOMAIN_URL}${url}`} />
      <meta property="og:image" content={favicon192.src} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="description" content={description} />
      <meta
        name="google-site-verification"
        content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_KEY}
      />
    </Head>
  );
};

export default PageHead;
