/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { MediumZoom } from '@src/shared';
import { PostImageSize } from '../types';

interface MarkdownImageProps {
  src?: string;
  alt?: string;
  imageSizes?: Record<string, PostImageSize>;
  mediumZoomBackground: string;
}

const MarkdownImage = ({
  src,
  alt,
  imageSizes,
  mediumZoomBackground,
}: MarkdownImageProps) => {
  if (!src) return null;
  const imageSize = imageSizes?.[src];

  return imageSize ? (
    <MediumZoom margin={24} background={mediumZoomBackground}>
      <Image
        src={src}
        alt={alt ?? ''}
        width={imageSize?.width ?? 700}
        height={imageSize?.height ?? 400}
        /**
         * set loading strategy to "eager" to temporally fix safari flickering issue
         * https://github.com/vercel/next.js/discussions/20991
         */
        loading="eager"
      />
    </MediumZoom>
  ) : (
    <MediumZoom margin={24} background={mediumZoomBackground}>
      <img src={src} alt={alt} />
    </MediumZoom>
  );
};

export default MarkdownImage;
