import { afterEach, describe, expect, it, vi } from 'vitest';

import { DOMAIN_URL, FEED_PATH } from '@src/shared/constants';
import { getPostFeedXml } from '@src/features/post/lib/postFeed';
import { getSortedPostPreviews } from '@src/features/post/lib/postList';

describe('getPostFeedXml', () => {
  it('produces an RSS 2.0 document with channel metadata', async () => {
    const xml = await getPostFeedXml();

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(
      true,
    );
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>KimBiYam.log</title>');
    expect(xml).toContain('<language>ko</language>');
    expect(xml).toContain(`href="${DOMAIN_URL}${FEED_PATH}"`);
    expect(xml.endsWith('</rss>\n')).toBe(true);
  });

  it('has one item per post with a link under /posts/', async () => {
    const [xml, previews] = await Promise.all([
      getPostFeedXml(),
      getSortedPostPreviews(),
    ]);

    expect(previews.length).toBeGreaterThan(0);
    expect(xml.match(/<item>/g)).toHaveLength(previews.length);
    expect(xml.match(/<\/item>/g)).toHaveLength(previews.length);
    for (const { id } of previews) {
      expect(xml).toContain(`<link>${DOMAIN_URL}/posts/${id}</link>`);
    }
  });

  it('orders items newest first and sets lastBuildDate from the newest', async () => {
    const [xml, previews] = await Promise.all([
      getPostFeedXml(),
      getSortedPostPreviews(),
    ]);

    const links = [
      ...xml.matchAll(/<item>\s*<title>[\s\S]*?<link>(.*?)<\/link>/g),
    ];
    expect(links.map(([, link]) => link)).toEqual(
      previews.map(({ id }) => `${DOMAIN_URL}/posts/${id}`),
    );
    const times = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map(([, d]) =>
      new Date(d).getTime(),
    );
    for (let i = 1; i < times.length; i += 1) {
      expect(times[i - 1]).toBeGreaterThanOrEqual(times[i]);
    }
    expect(xml).toContain(
      `<lastBuildDate>${new Date(previews[0].date).toUTCString()}</lastBuildDate>`,
    );
  });

  it('contains no raw XML-unsafe characters in item text', async () => {
    // see also the crafted-posts suite below for exact escaping
    const xml = await getPostFeedXml();
    // eslint-disable-next-line no-control-regex
    const invalidChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

    expect(invalidChars.test(xml)).toBe(false);
    for (const [, text] of xml.matchAll(
      /<(?:title|description|category)>([^<]*)<\//g,
    )) {
      expect(text).not.toMatch(/[<>"']|&(?!(amp|lt|gt|quot|apos);)/);
    }
  });
});

describe('getPostFeedXml with crafted posts', () => {
  afterEach(() => {
    vi.doUnmock('@src/features/post/lib/postList');
    vi.resetModules();
  });

  const loadWith = async (previews: unknown[]) => {
    vi.resetModules();
    vi.doMock('@src/features/post/lib/postList', () => ({
      getSortedPostPreviews: async () => previews,
    }));

    return (await import('@src/features/post/lib/postFeed')).getPostFeedXml();
  };

  it('escapes XML special characters and strips control characters', async () => {
    const xml = await loadWith([
      {
        id: 'a/b',
        title: 'T <&> "q" \'s\u0001',
        date: '2026-01-02',
        tag: 'x&y',
        content: '  <b>hi</b>  ',
      },
    ]);

    expect(xml).toContain(
      '<title>T &lt;&amp;&gt; &quot;q&quot; &apos;s</title>',
    );
    expect(xml).toContain('<category>x&amp;y</category>');
    expect(xml).toContain('<description>&lt;b&gt;hi&lt;/b&gt;</description>');
    expect(xml).toContain('<pubDate>Fri, 02 Jan 2026 00:00:00 GMT</pubDate>');
  });

  it('omits lastBuildDate and items when there are no posts', async () => {
    const xml = await loadWith([]);

    expect(xml).not.toContain('<lastBuildDate>');
    expect(xml).not.toContain('<item>');
    expect(xml).toContain('</channel>');
  });
});
