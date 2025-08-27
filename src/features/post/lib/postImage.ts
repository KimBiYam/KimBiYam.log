import { join } from 'path';

import * as Sentry from '@sentry/nextjs';
import sizeOf from 'image-size';

import { PostImageSize } from '../types';

export const getPostImageSizes = (postContentHtml: string) => {
  const imageSizes: Record<string, PostImageSize> = {};

  // A regular expression to iterate on all images in the post
  const matches = postContentHtml.matchAll(/\!\[.*]\((.*)\)/g);

  for (const match of matches) {
    const [, src] = match;
    const filePath = join(process.cwd(), 'public', src);

    try {
      const { width, height } = sizeOf(filePath);
      if (width !== undefined && height !== undefined) {
        imageSizes[src] = { width, height };
      }
    } catch (err) {
      Sentry.captureException(err, {
        contexts: {
          imageProcessing: {
            filePath,
            src,
          },
        },
        tags: {
          operation: 'getImageDimensions',
        },
      });
    }
  }

  return imageSizes;
};
