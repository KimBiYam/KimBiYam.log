/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

import { getPostVideoPosterSrc, isPostVideoSrc } from '../lib/postImage';
import { PostImageSize } from '../types';

const IMAGE_SIZES = '(min-width: 768px) 704px, calc(100vw - 48px)';

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

  // Animated GIFs are served as muted looping videos to cut transfer size.
  if (isPostVideoSrc(src)) {
    return (
      <video
        src={src}
        poster={getPostVideoPosterSrc(src)}
        width={imageSize?.width}
        height={imageSize?.height}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return imageSize ? (
    <Image
      src={src}
      alt={alt ?? ''}
      width={imageSize?.width ?? 700}
      height={imageSize?.height ?? 400}
      sizes={IMAGE_SIZES}
      decoding="async"
    />
  ) : (
    <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
  );
};

export default MarkdownImage;
