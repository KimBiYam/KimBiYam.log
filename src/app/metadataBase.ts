import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { DOMAIN_URL } from '@src/shared';

export const generateOpenGraphMetaData = ({
  path = '',
  ...rest
}: {
  path?: string;
} & OpenGraph): OpenGraph => {
  return {
    type: 'website',
    url: `${DOMAIN_URL}${path}`,
    images: {
      url: `${DOMAIN_URL}${ogTagImage.src}`,
      width: ogTagImage.width,
      height: ogTagImage.height,
    },
    ...rest,
  };
};
