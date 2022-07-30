import Head from 'next/head';
import Favicon from './Favicon';
import ogTagImage from '../../assets/favicon/og_tag_image.png';
import { DOMAIN_URL } from '../../constants';
import { theme as tailwindTheme } from '../../../tailwind.config';

interface PageHeadProps {
  description?: string;
  title?: string;
  url?: string;
  ogImagePath?: string;
}

const PAGE_TITLE_SUFFIX = ' | KimBiYam.log';

const PageHead = ({
  title,
  description = 'KimBiYam의 개발 블로그 입니다.',
  url = '',
  ogImagePath = ogTagImage.src,
}: PageHeadProps) => (
  <Head>
    <Favicon />
    <title>{title ? title + PAGE_TITLE_SUFFIX : 'KimBiyam.log'}</title>
    <link rel="canonical" href={`${DOMAIN_URL}${url}`} />
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
    <meta property="og:url" content={`${DOMAIN_URL}${url}`} />
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
