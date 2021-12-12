import Head from "next/head";
import Favicon from "./Favicon";
import favicon192 from "../../assets/favicon/favicon-192x192.png";

export type MetaProps = {};

const Meta = () => {
  return (
    <Head>
      <Favicon />
      <meta name="viewport" content="width=device-width" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="twitter:site" content="KimBiYam.log" />
      <meta name="twitter:card" content={favicon192.src} />
      {/* TODO : change to real domain */}
      <meta name="twitter:url" content="https://kimbiyam.log" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        name="keywords"
        content="blog,블로그,kimbiyam,kimbiyam.log,hot9998"
      />
      <meta name="format-detection" content="telephone=no" />
      {/* TODO : change to real domain */}
      <meta property="og:url" content="https://kimbiyam.log" />
      <meta property="og:image" content={favicon192.src} />
      <meta property="og:title" content="KimBiYam.log" />
      <meta
        property="og:description"
        content="KimBiYam의 개발 블로그 입니다."
      />
      <meta name="og:description" content="KimBiYam의 개발 블로그 입니다." />
    </Head>
  );
};

export default Meta;
