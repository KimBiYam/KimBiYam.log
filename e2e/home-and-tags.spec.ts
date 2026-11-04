import { expect, test } from '@playwright/test';

import { getPostUrls, getTagButtons } from './support/posts';

import type { Page } from '@playwright/test';

const POST_HREF_PATTERN = /^\/posts\/[^/]+\/[^/]+$/;
const FEATURED_PREFIX = /^FEATURED\s*·\s*/;

const getPostLinks = (page: Page) =>
  page.locator('section[aria-label="추천 글"] a, ul[aria-label="최근 글"] a');

/** 목록 항목(추천 글 포함)에 표시된 태그 문구들. */
const getListedTags = async (page: Page): Promise<string[]> => {
  const texts = await getPostLinks(page).evaluateAll((links) =>
    links.map((link) => link.querySelector('span')?.textContent ?? ''),
  );

  return texts.map((text) => text.replace(FEATURED_PREFIX, '').trim());
};

test('홈에 글 목록이 보이고 글 링크가 /posts/<subdir>/<id> 형식이다', async ({
  page,
}) => {
  await page.goto('/');

  const links = getPostLinks(page);
  await expect(links.first()).toBeVisible();

  const hrefs = await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href') ?? ''),
  );

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href).toMatch(POST_HREF_PATTERN);
  }
});

test('태그를 선택하면 해당 태그 글만 보이고 전체로 돌아올 수 있다', async ({
  page,
}) => {
  await page.goto('/');

  const tagButtons = getTagButtons(page);
  const allButton = tagButtons.first();
  await expect(allButton).toHaveAttribute('aria-current', 'page');
  expect(await tagButtons.count()).toBeGreaterThan(1);

  const tagButton = tagButtons.nth(1);
  const tagHref = await tagButton.getAttribute('href');
  expect(tagHref).toMatch(/^\/tags\/[^/]+$/);

  const encodedTag = (tagHref ?? '').replace('/tags/', '');
  const tag = decodeURIComponent(encodedTag);

  await tagButton.click();

  await expect(page).toHaveURL(new RegExp(`/tags/${encodedTag}$`));
  await expect(tagButton).toHaveAttribute('aria-current', 'page');
  await expect(allButton).not.toHaveAttribute('aria-current', 'page');

  await expect(getPostLinks(page).first()).toBeVisible();
  const listedTags = await getListedTags(page);
  expect(listedTags.length).toBeGreaterThan(0);
  for (const listedTag of listedTags) {
    expect(listedTag.toLowerCase()).toBe(tag.toLowerCase());
  }

  await allButton.click();

  await expect(page).toHaveURL(/\/$/);
  await expect(allButton).toHaveAttribute('aria-current', 'page');
  await expect(tagButton).not.toHaveAttribute('aria-current', 'page');
});

test('목록 끝까지 스크롤하면 다음 글들이 추가로 로드된다', async ({
  page,
  request,
}) => {
  const totalPosts = (await getPostUrls(request)).length;

  await page.goto('/');
  const links = getPostLinks(page);
  await expect(links.first()).toBeVisible();

  const initialCount = await links.count();
  // 사전 조건: 첫 페이지에 전체 글이 다 들어가지 않는다(콘텐츠가 충분해야 함).
  expect(initialCount).toBeLessThan(totalPosts);

  await expect(async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(await links.count()).toBeGreaterThan(initialCount);
  }).toPass();
});
