import fs from 'fs';
import path from 'path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getPostImageSizes,
  getPostVideoPosterSrc,
  isPostVideoSrc,
} from '@src/features/post/lib/postImage';

const findPublicPng = () => {
  const publicDir = path.join(process.cwd(), 'public');
  const entry = fs
    .readdirSync(publicDir, { recursive: true, encoding: 'utf-8' })
    .find((file) => file.endsWith('.png'));

  return entry ? `/${entry}` : undefined;
};

describe('isPostVideoSrc', () => {
  it('detects mp4 files', () => {
    expect(isPostVideoSrc('/posts/a/demo.mp4')).toBe(true);
  });

  it('rejects non-video sources', () => {
    expect(isPostVideoSrc('/posts/a/demo.png')).toBe(false);
    expect(isPostVideoSrc('/posts/a/demo.mp4.png')).toBe(false);
    expect(isPostVideoSrc('')).toBe(false);
  });
});

describe('getPostVideoPosterSrc', () => {
  it('replaces the mp4 extension with jpg', () => {
    expect(getPostVideoPosterSrc('/posts/a/demo.mp4')).toBe(
      '/posts/a/demo.jpg',
    );
  });

  it('leaves non-video sources unchanged', () => {
    expect(getPostVideoPosterSrc('/posts/a/demo.png')).toBe(
      '/posts/a/demo.png',
    );
  });
});

describe('getPostImageSizes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an empty object for content without images', () => {
    expect(getPostImageSizes('')).toEqual({});
    expect(getPostImageSizes('plain [link](/x.png) text')).toEqual({});
  });

  it('skips remote images', () => {
    expect(getPostImageSizes('![a](https://example.com/a.png)')).toEqual({});
  });

  it('logs and skips local images that cannot be read', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(getPostImageSizes('![a](/__missing__/nope.png)')).toEqual({});
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('looks up the jpg poster for video sources', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    getPostImageSizes('![v](/__missing__/clip.mp4)');

    expect(errorSpy.mock.calls[0][0]).toContain('/__missing__/clip.jpg');
  });

  it('parses images whose alt text contains a nested link', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    getPostImageSizes('![nested [l](u)](/__missing__/a.png)');

    expect(errorSpy.mock.calls[0][0]).toContain('/__missing__/a.png');
  });

  it('measures real local images under public/', () => {
    const src = findPublicPng();
    if (!src) return;

    const sizes = getPostImageSizes(`![img](${src})`);

    expect(Object.keys(sizes)).toEqual([src]);
    expect(sizes[src].width).toBeGreaterThan(0);
    expect(sizes[src].height).toBeGreaterThan(0);
  });
});
