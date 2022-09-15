import Head from 'next/head';

import { theme as tailwindTheme } from '../../../tailwind.config';
import ogTagImage from '../../assets/favicon/og_tag_image.png';
import { DOMAIN_URL } from '../../constants';
import Favicon from './Favicon';

interface PageHeadProps {
  title: string;
  description?: string;
  path?: string;
  ogImagePath?: string;
}

const PAGE_TITLE_SUFFIX = ' | KimBiYam.log';

const PageHead = ({
  title,
  description = 'KimBiYam의 개발 블로그 입니다.',
  path = '',
  ogImagePath = ogTagImage.src,
}: PageHeadProps) => (
  <Head>
    <Favicon />
    <title>{title + PAGE_TITLE_SUFFIX}</title>
    <link rel="canonical" href={`${DOMAIN_URL}${path}`} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
    />
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="robots" content="index,follow" />
    <meta name="theme-color" content={tailwindTheme.colors.neutral[900]} />
    <meta name="keywords" content="blog,블로그,kimbiyam,kimbiyam.log,hot9998" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="twitter:card" content="summary" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`${DOMAIN_URL}${path}`} />
    <meta property="og:image" content={DOMAIN_URL + ogImagePath} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="description" content={description} />
    <meta
      name="google-site-verification"
      content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_KEY}
    />
    <meta
      name="naver-site-verification"
      content={process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_KEY}
    />
  </Head>
);

export default PageHead;
