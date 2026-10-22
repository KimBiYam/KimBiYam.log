/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

import { PostImageSize } from '@src/features/post/types';

interface MarkdownImageProps {
  src?: string;
  alt?: string;
  imageSizes?: Record<string, PostImageSize>;
}

const MarkdownImage = ({ src, alt, imageSizes }: MarkdownImageProps) => {
  if (!src) return null;
  const imageSize = imageSizes?.[src];
  const priority = imageSize?.priority === true;

  return imageSize ? (
    <Image
      src={src}
      alt={alt ?? ''}
      width={imageSize.width}
      height={imageSize.height}
      sizes="(max-width: 767px) calc(100vw - 48px), 704px"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  ) : (
    <img
      src={src}
      alt={alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
};

export default MarkdownImage;
