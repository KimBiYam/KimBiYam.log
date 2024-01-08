import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import { DOMAIN_URL } from '@src/constants/server';

import ogTagImage from '../assets/favicon/og_tag_image.png';

export const generateOpenGraphMetaData = ({
  title,
  description,
  path = '',
  ogImagePath = ogTagImage.src,
}: {
  path?: string;
  ogImagePath?: string;
} & OpenGraph): OpenGraph => {
  return {
    title,
    description,
    url: `${DOMAIN_URL}${path}`,
    images: {
      url: DOMAIN_URL + ogImagePath,
      width: 1200,
      height: 630,
    },
  };
};
