import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { DOMAIN_URL, PROFILE } from '@src/shared/constants';

import { PostDetail } from '../types';

interface JsonLdPerson {
  '@type': 'Person';
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
  dateModified: string;
  author: JsonLdPerson;
  url: string;
  mainEntityOfPage: JsonLdWebPage;
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
  const imageUrl = toAbsoluteUrl(ogImagePath ?? ogTagImage.src);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: PROFILE.name,
      url: PROFILE.social.github,
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: [imageUrl],
    keywords: [tag],
  };
};
