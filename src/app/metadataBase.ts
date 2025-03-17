import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import { DOMAIN_URL } from '@src/shared';

export const generateOpenGraphMetaData = ({
  path = '',
  ogImageTitle,
  ...rest
}: {
  path?: string;
  ogImageTitle?: string;
} & OpenGraph): OpenGraph => {
  const ogImageUrl = new URL(`${DOMAIN_URL}/api/og`);
  if (!!ogImageTitle) {
    ogImageUrl.searchParams.set('title', ogImageTitle);
  }

  return {
    type: 'website',
    url: `${DOMAIN_URL}${path}`,
    images: {
      url: ogImageUrl.toString(),
      width: 1200,
      height: 630,
    },
    ...rest,
  };
};
