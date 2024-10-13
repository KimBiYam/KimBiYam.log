import { join } from 'path';

import sizeOf from 'image-size';

import { PostImageSize } from '@src/types/post.types';

export const getPostImageSizes = (postContentHtml: string) => {
  const imageSizes: Record<string, PostImageSize> = {};

  // A regular expression to iterate on all images in the post
  const matches = postContentHtml.matchAll(/\!\[.*]\((.*)\)/g);

  for (const match of matches) {
    const [, src] = match;
    try {
      const { width, height } = sizeOf(join('public', src));
      if (width !== undefined && height !== undefined) {
        imageSizes[src] = { width, height };
      }
    } catch (err) {
      console.error(`Can’t get dimensions for ${src}:`, err);
    }
  }

  return imageSizes;
};
