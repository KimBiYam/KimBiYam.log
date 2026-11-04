import { expect, test } from '@playwright/test';

import { findPostWithFeature, getPostUrls } from './support/posts';

test('홈이 열리고 h1 이 노출된다', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('KimBiYam.log');
});

test('운영 Sentry 로 요청을 보내지 않는다', async ({ page }) => {
  const sentryRequests: string[] = [];
  page.on('request', (request) => {
    const { hostname } = new URL(request.url());
    // tunnelRoute 는 빌드마다 무작위 경로를 쓰므로 경로 대신 SDK 식별자가 든 본문으로 판별한다.
    const isTunneledEnvelope =
      request.method() === 'POST' &&
      (request.postData() ?? '').includes('sentry.javascript');

    if (hostname.endsWith('sentry.io') || isTunneledEnvelope) {
      sentryRequests.push(request.url());
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  // Sentry 는 로드 후 지연되어 전송하므로, 없음을 확인하기 위해 관찰 시간을 둔다.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 4000)));

  expect(sentryRequests).toEqual([]);
});

test('sitemap 에서 글 경로를 가져온다', async ({ request }) => {
  const urls = await getPostUrls(request);

  expect(urls.length).toBeGreaterThan(0);
});

test('이미지가 있는 글을 찾는다', async ({ page }) => {
  const url = await findPostWithFeature(page, 'image');

  expect(url).toMatch(/^\/posts\//);
});
