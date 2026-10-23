import 'server-only';

import { join } from 'path';

import sizeOf from 'image-size';

import { PostImageSize } from '../types';

const POST_VIDEO_EXTENSION_REG_EXP = /\.mp4$/;

export const isPostVideoSrc = (src: string) =>
  POST_VIDEO_EXTENSION_REG_EXP.test(src);

// Each post video ships with a same-named .jpg first-frame poster.
export const getPostVideoPosterSrc = (src: string) =>
  src.replace(POST_VIDEO_EXTENSION_REG_EXP, '.jpg');

export const getPostImageSizes = (postContentHtml: string) => {
  const imageSizes: Record<string, PostImageSize> = {};

  // Alt text may contain nested markdown links, e.g. ![[label](url)](src)
  const matches = postContentHtml.matchAll(
    /!\[(?:[^[\]]|\[[^\]]*])*]\(([^)\s]+)/g,
  );

  for (const match of matches) {
    const [, src] = match;
    if (!src.startsWith('/')) continue;

    const sizeSrc = isPostVideoSrc(src) ? getPostVideoPosterSrc(src) : src;
    const filePath = join(process.cwd(), 'public', sizeSrc);

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
