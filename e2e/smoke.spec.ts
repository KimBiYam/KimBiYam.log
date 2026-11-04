import { expect, test } from '@playwright/test';

import { findPostWithFeature, getPostUrls } from './support/posts';

test('홈이 열리고 h1 이 노출된다', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('KimBiYam.log');
});

test('sitemap 에서 글 경로를 가져온다', async ({ request }) => {
  const urls = await getPostUrls(request);

  expect(urls.length).toBeGreaterThan(0);
});

test('이미지가 있는 글을 찾는다', async ({ page }) => {
  const url = await findPostWithFeature(page, 'image');

  expect(url).toMatch(/^\/posts\//);
});
