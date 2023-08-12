import { Metadata } from 'next';

import ogTagImage from '../assets/favicon/og_tag_image.png';
import { DOMAIN_URL, PAGE_TITLE_SUFFIX } from '../constants';

export const openGraphBase: Metadata['openGraph'] = {
  type: 'website',
  url: `${DOMAIN_URL}`,
  images: {
    url: DOMAIN_URL + ogTagImage,
    width: 1200,
    height: 630,
  },
};

export const generateTitle = (title: string) => `${title}${PAGE_TITLE_SUFFIX}`;

export const generateOpenGraphMetaData = ({
  title,
  description,
  path = '',
  ogImagePath = ogTagImage.src,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImagePath?: string;
}): Metadata['openGraph'] => {
  return {
    title,
    description,
    type: 'website',
    url: `${DOMAIN_URL}${path}`,
    images: {
      url: DOMAIN_URL + ogImagePath,
      width: 1200,
      height: 630,
    },
  };
};
