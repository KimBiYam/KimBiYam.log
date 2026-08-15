import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { DOMAIN_URL } from '@src/shared';

export const generateOpenGraphMetaData = ({
  imagePath,
  imageAlt,
  path = '',
  ...rest
}: {
  imagePath?: string;
  imageAlt?: string;
  path?: string;
} & OpenGraph): OpenGraph => {
  const imageUrl =
    imagePath?.startsWith('http://') || imagePath?.startsWith('https://')
      ? imagePath
      : `${DOMAIN_URL}${imagePath}`;
  const images = imagePath
    ? { url: imageUrl, alt: imageAlt }
    : {
        url: `${DOMAIN_URL}${ogTagImage.src}`,
        width: ogTagImage.width,
        height: ogTagImage.height,
        alt: imageAlt ?? 'KimBiYam.log',
      };

  return {
    type: 'website',
    url: `${DOMAIN_URL}${path}`,
    siteName: 'KimBiYam.log',
    locale: 'ko_KR',
    images,
    ...rest,
  };
};
