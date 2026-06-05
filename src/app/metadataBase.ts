import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { DOMAIN_URL } from '@src/shared';

export const generateOpenGraphMetaData = ({
  imagePath,
  path = '',
  ...rest
}: {
  imagePath?: string;
  path?: string;
} & OpenGraph): OpenGraph => {
  const images = imagePath
    ? { url: `${DOMAIN_URL}${imagePath}` }
    : {
        url: `${DOMAIN_URL}${ogTagImage.src}`,
        width: ogTagImage.width,
        height: ogTagImage.height,
      };

  return {
    type: 'website',
    url: `${DOMAIN_URL}${path}`,
    images,
    ...rest,
  };
};
