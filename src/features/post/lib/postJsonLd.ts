import { DEPLOYMENT_URL, DOMAIN_URL, PROFILE } from '@src/shared/constants';

import { PostDetail } from '../types';

interface JsonLdPerson {
  '@type': 'Person';
  '@id': string;
  name: string;
  url: string;
}

interface JsonLdWebPage {
  '@type': 'WebPage';
  '@id': string;
}

interface PostJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  inLanguage: 'ko-KR';
  author: JsonLdPerson;
  publisher: {
    '@id': string;
  };
  url: string;
  mainEntityOfPage: JsonLdWebPage;
  isPartOf: {
    '@id': string;
  };
  image: string[];
  keywords: string[];
}

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;

  return `${DOMAIN_URL}${path}`;
};

export const getPostJsonLd = ({
  path,
  postDetail,
}: {
  path: string;
  postDetail: PostDetail;
}): PostJsonLd => {
  const { date, description, ogImagePath, tag, title } = postDetail;
  const url = toAbsoluteUrl(path);
  const imageUrl = ogImagePath
    ? toAbsoluteUrl(ogImagePath)
    : `${DEPLOYMENT_URL}${path}/opengraph-image`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date,
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Person',
      '@id': `${DOMAIN_URL}/#person`,
      name: PROFILE.name,
      url: PROFILE.social.github,
    },
    publisher: {
      '@id': `${DOMAIN_URL}/#person`,
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    isPartOf: {
      '@id': `${DOMAIN_URL}/#website`,
    },
    image: [imageUrl],
    keywords: [tag],
  };
};
