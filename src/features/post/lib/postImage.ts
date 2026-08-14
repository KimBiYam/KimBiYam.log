import { join } from 'path';

import sizeOf from 'image-size';

import { PostImageSize } from '../types';

export const getPostImageSizes = (postContentHtml: string) => {
  const imageSizes: Record<string, PostImageSize> = {};

  const matches = postContentHtml.matchAll(/!\[[^\]]*]\(([^)\s]+)/g);

  for (const match of matches) {
    const [, src] = match;
    if (!src.startsWith('/')) continue;

    const filePath = join(process.cwd(), 'public', src);

    try {
      const { width, height } = sizeOf(filePath);
      if (width !== undefined && height !== undefined) {
        imageSizes[src] = { width, height };
      }
    } catch (err) {
      console.error(`Can’t get dimensions for ${filePath}:`, err);
    }
  }

  return imageSizes;
};
