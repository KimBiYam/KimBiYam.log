import Head from 'next/head';
import Favicon from './Favicon';
import ogTagImage from '../../assets/favicon/og_tag_image.png';
import { DOMAIN_URL } from '../../constants';
import colors from '../../lib/styles/colors';

export type PageHeadProps = {
  description: string;
  title: string;
  url?: string;
};

const PageHead = ({ title, description, url }: PageHeadProps) => (
  <Head>
    <Favicon />
    <title>{title}</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
    />
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="theme-color" content={colors.trueGray800} />
    <meta name="keywords" content="blog,블로그,kimbiyam,kimbiyam.log,hot9998" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="twitter:card" content="summary" />
    <meta property="og:url" content={`${DOMAIN_URL}${url}`} />
    <meta property="og:image" content={`${DOMAIN_URL}${ogTagImage.src}`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="description" content={description} />
    <meta
      name="google-site-verification"
      content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_KEY}
    />
  </Head>
);

export default PageHead;
