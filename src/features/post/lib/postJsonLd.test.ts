import { describe, expect, it } from 'vitest';

import { DOMAIN_URL, PROFILE } from '@src/shared/constants';
import { getPostJsonLd, getTagJsonLd } from '@src/features/post/lib/postJsonLd';
import type { PostDetail, PostPreview } from '@src/features/post/types';

const postDetail: PostDetail = {
  id: 'ts/sample',
  title: 'Sample',
  date: '2026-01-02',
  tag: 'ts',
  readingTimeMinutes: 1,
  contentHtml: '',
  description: 'desc',
};

describe('getPostJsonLd', () => {
  it('builds a BlogPosting and breadcrumb graph', () => {
    const jsonLd = getPostJsonLd({ path: '/posts/ts/sample', postDetail });
    const [article, breadcrumb] = jsonLd['@graph'];
    const url = `${DOMAIN_URL}/posts/ts/sample`;

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(article).toMatchObject({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: 'Sample',
      description: 'desc',
      datePublished: '2026-01-02',
      url,
      keywords: ['ts'],
      inLanguage: 'ko-KR',
    });
    expect(article.author.name).toBe(PROFILE.name);
    expect(article.mainEntityOfPage['@id']).toBe(url);
    expect(breadcrumb['@id']).toBe(`${url}#breadcrumb`);
  });

  it('falls back dateModified to date when not updated', () => {
    const [article] = getPostJsonLd({ path: '/posts/a', postDetail })['@graph'];

    expect(article.dateModified).toBe('2026-01-02');
  });

  it('uses updated for dateModified when present', () => {
    const [article] = getPostJsonLd({
      path: '/posts/a',
      postDetail: { ...postDetail, updated: '2026-03-04' },
    })['@graph'];

    expect(article.dateModified).toBe('2026-03-04');
    expect(article.datePublished).toBe('2026-01-02');
  });

  it('defaults the image to the opengraph-image route', () => {
    const [article] = getPostJsonLd({ path: '/posts/a', postDetail })['@graph'];

    expect(article.image).toHaveLength(1);
    expect(article.image[0]).toMatch(/\/posts\/a\/opengraph-image$/);
  });

  it('makes a relative ogImagePath absolute', () => {
    const [article] = getPostJsonLd({
      path: '/posts/a',
      postDetail: { ...postDetail, ogImagePath: 'img/og.png' },
    })['@graph'];

    expect(article.image).toEqual([`${DOMAIN_URL}/img/og.png`]);
  });

  it('keeps an absolute ogImagePath as is', () => {
    const [article] = getPostJsonLd({
      path: '/posts/a',
      postDetail: { ...postDetail, ogImagePath: 'https://cdn.example/og.png' },
    })['@graph'];

    expect(article.image).toEqual(['https://cdn.example/og.png']);
  });

  it('numbers breadcrumb items from the site root to the post', () => {
    const [, breadcrumb] = getPostJsonLd({ path: '/posts/a', postDetail })[
      '@graph'
    ];

    expect(breadcrumb.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'KimBiYam.log',
        item: DOMAIN_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'TS',
        item: `${DOMAIN_URL}/tags/ts`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Sample',
        item: `${DOMAIN_URL}/posts/a`,
      },
    ]);
  });
});

describe('getTagJsonLd', () => {
  const previews: PostPreview[] = [
    { ...postDetail, id: 'ts/a', content: '' },
    { ...postDetail, id: 'ts/b', content: '' },
  ];

  it('builds a CollectionPage listing posts in order', () => {
    const jsonLd = getTagJsonLd({
      tag: 'ts',
      title: 'TS posts',
      description: 'about ts',
      postPreviews: previews,
    });
    const [page] = jsonLd['@graph'];

    expect(page).toMatchObject({
      '@type': 'CollectionPage',
      '@id': `${DOMAIN_URL}/tags/ts`,
      name: 'TS posts',
      description: 'about ts',
    });
    expect(page.mainEntity.numberOfItems).toBe(2);
    expect(page.mainEntity.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, url: `${DOMAIN_URL}/posts/ts/a` },
      { '@type': 'ListItem', position: 2, url: `${DOMAIN_URL}/posts/ts/b` },
    ]);
  });

  it('handles an empty post list', () => {
    const [page] = getTagJsonLd({
      tag: 'ts',
      title: 't',
      description: 'd',
      postPreviews: [],
    })['@graph'];

    expect(page.mainEntity.numberOfItems).toBe(0);
    expect(page.mainEntity.itemListElement).toEqual([]);
  });

  it('url-encodes the tag and uppercases the breadcrumb name', () => {
    const [page, breadcrumb] = getTagJsonLd({
      tag: 'c++ x',
      title: 't',
      description: 'd',
      postPreviews: [],
    })['@graph'];

    expect(page.url).toBe(`${DOMAIN_URL}/tags/c%2B%2B%20x`);
    expect(breadcrumb.itemListElement.map(({ name }) => name)).toEqual([
      'KimBiYam.log',
      'C++ X',
    ]);
  });
});
