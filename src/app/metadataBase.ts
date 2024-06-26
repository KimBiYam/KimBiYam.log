import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import { DOMAIN_URL } from '@src/constants/server';

export const generateOpenGraphMetaData = ({
  title,
  description,
  path = '',
  ogImageTitle,
}: {
  path?: string;
  ogImageTitle?: string;
} & OpenGraph): OpenGraph => {
  const ogImageUrl = new URL(`${DOMAIN_URL}/api/og`);
  if (!!ogImageTitle) {
    ogImageUrl.searchParams.set('title', ogImageTitle);
  }

  return {
    title,
    description,
    url: `${DOMAIN_URL}${path}`,
    images: {
      url: ogImageUrl.toString(),
      width: 1200,
      height: 630,
    },
  };
};
