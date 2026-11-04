import { describe, expect, it } from 'vitest';

import {
  getPostMetaDescription,
  getPostPreviewDescription,
} from '@src/features/post/lib/postDescription';

describe('getPostPreviewDescription', () => {
  it('returns an empty string for empty input', () => {
    expect(getPostPreviewDescription('')).toBe('');
  });

  it('returns short text as is without ellipsis', () => {
    expect(getPostPreviewDescription('hello world')).toBe('hello world');
  });

  it('strips markdown formatting', () => {
    expect(getPostPreviewDescription('**bold** and [link](http://a.b)')).toBe(
      'bold and link',
    );
  });

  it('removes fenced code blocks', () => {
    const result = getPostPreviewDescription(
      'before\n```ts\nconst secret = 1;\n```\nafter',
    );

    expect(result).not.toContain('secret');
    expect(result).toContain('before');
    expect(result).toContain('after');
  });

  it('removes tilde code blocks', () => {
    const result = getPostPreviewDescription('a\n~~~\nsecret\n~~~\nb');

    expect(result).not.toContain('secret');
  });

  it('removes the first heading line', () => {
    const result = getPostPreviewDescription('# Heading\nbody text');

    expect(result).not.toContain('Heading');
    expect(result).toContain('body text');
  });

  it('truncates to 200 characters plus ellipsis', () => {
    expect(getPostPreviewDescription('a'.repeat(300))).toBe(
      `${'a'.repeat(200)}...`,
    );
  });

  it('adds the ellipsis when content length equals the limit', () => {
    expect(getPostPreviewDescription('a'.repeat(200))).toBe(
      `${'a'.repeat(200)}...`,
    );
  });

  it('has no ellipsis just under the limit', () => {
    expect(getPostPreviewDescription('a'.repeat(199))).toBe('a'.repeat(199));
  });
});

describe('getPostMetaDescription', () => {
  it('returns an empty string for empty input', () => {
    expect(getPostMetaDescription('')).toBe('');
  });

  it('trims surrounding whitespace', () => {
    expect(getPostMetaDescription('  hello  ')).toBe('hello');
  });

  it('truncates to 87 characters plus ellipsis (90 total)', () => {
    const result = getPostMetaDescription('a'.repeat(200));

    expect(result).toBe(`${'a'.repeat(87)}...`);
    expect(result).toHaveLength(90);
  });

  it('adds the ellipsis when content length equals the limit', () => {
    expect(getPostMetaDescription('a'.repeat(90))).toBe(`${'a'.repeat(87)}...`);
  });

  it('has no ellipsis just under the limit', () => {
    expect(getPostMetaDescription('a'.repeat(89))).toBe('a'.repeat(87));
  });

  it('removes code blocks and markdown', () => {
    const result = getPostMetaDescription('**hi**\n```\nzzz\n```\nthere');

    expect(result).not.toContain('zzz');
    expect(result).toContain('hi');
    expect(result).toContain('there');
  });
});
