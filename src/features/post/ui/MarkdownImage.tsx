/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

import { PostImageSize } from '../types';

interface MarkdownImageProps {
  src?: string;
  alt?: string;
  imageSizes?: Record<string, PostImageSize>;
}

const MarkdownImage = ({
  src,
  alt,
  imageSizes,
}: MarkdownImageProps) => {
  if (!src) return null;
  const imageSize = imageSizes?.[src];

  return imageSize ? (
    <Image
      src={src}
      alt={alt ?? ''}
      width={imageSize?.width ?? 700}
      height={imageSize?.height ?? 400}
      decoding="async"
    />
  ) : (
    <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
  );
};

export default MarkdownImage;
