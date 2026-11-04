import { expect, test } from '@playwright/test';

import { getPostUrls, getTagButtons } from './support/posts';

const getLocation = (headers: Record<string, string>) =>
  new URL(headers['location'] ?? '', 'http://localhost');

test.describe('proxy 리다이렉트', () => {
  test('/?tag=<tag> 는 /tags/<tag> 로 308 리다이렉트된다', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const href = await getTagButtons(page).nth(1).getAttribute('href');
    expect(href).toMatch(/^\/tags\//);

    const encodedTag = (href ?? '').replace('/tags/', '');
    const response = await request.get(`/?tag=${encodedTag}`, {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(308);
    const location = getLocation(response.headers());
    expect(location.pathname).toBe(`/tags/${encodedTag}`);
    expect(location.search).toBe('');
  });

  test('/?tag=all 은 / 로 308 리다이렉트된다', async ({ request }) => {
    const response = await request.get('/?tag=all', { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    const location = getLocation(response.headers());
    expect(location.pathname).toBe('/');
    expect(location.search).toBe('');
  });

  test('존재하지 않는 태그는 /tags/<tag> 로 리다이렉트된 뒤 404 가 된다', async ({
    request,
  }) => {
    const redirect = await request.get('/?tag=no-such-tag', {
      maxRedirects: 0,
    });

    expect(redirect.status()).toBe(308);
    expect(getLocation(redirect.headers()).pathname).toBe('/tags/no-such-tag');

    const target = await request.get('/tags/no-such-tag', { maxRedirects: 0 });
    expect(target.status()).toBe(404);
  });
});

test.describe('404', () => {
  for (const path of ['/no-such-page', '/posts/no-dir/no-post']) {
    test(`${path} 는 404 상태와 not-found UI 를 보여준다`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

      const recent = page.locator(
        'section[aria-labelledby="not-found-recent-posts"]',
      );
      await expect(recent).toBeVisible();
      await expect(recent.getByRole('link').first()).toHaveAttribute(
        'href',
        /^\/posts\//,
      );
    });
  }
});

test.describe('SEO 엔드포인트', () => {
  const endpoints = [
    { path: '/feed.xml', contentType: /xml/ },
    { path: '/sitemap.xml', contentType: /xml/ },
    { path: '/robots.txt', contentType: /text\/plain/ },
  ];

  for (const { path, contentType } of endpoints) {
    test(`${path} 는 200 과 비어 있지 않은 본문을 반환한다`, async ({
      request,
    }) => {
      const response = await request.get(path);

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(contentType);
      expect((await response.text()).trim().length).toBeGreaterThan(0);
    });
  }

  test('sitemap 에 /posts/ URL 이 포함된다', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    expect(await response.text()).toMatch(/<loc>[^<]*\/posts\/[^<]+<\/loc>/);
  });

  test('글의 opengraph-image 는 비어 있지 않은 PNG 를 반환한다', async ({
    request,
  }) => {
    const [postPath] = await getPostUrls(request);
    expect(postPath).toBeTruthy();

    const response = await request.get(`${postPath}/opengraph-image`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/image\/png/);
    const body = await response.body();
    // PNG 시그니처: 0x89 'P' 'N' 'G'
    expect([...body.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    expect(body.length).toBeGreaterThan(1000);
  });
});
