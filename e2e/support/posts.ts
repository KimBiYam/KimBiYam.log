import type { APIRequestContext, Locator, Page } from '@playwright/test';

export type PostFeature = 'heading' | 'codeBlock' | 'image';

const POST_CONTENT_SELECTOR = 'article .prose';

const FEATURE_SELECTORS: Record<PostFeature, string> = {
  heading: `${POST_CONTENT_SELECTOR} :is(h2, h3, h4)`,
  codeBlock: `${POST_CONTENT_SELECTOR} pre`,
  image: `${POST_CONTENT_SELECTOR} img`,
};

/** sitemap.xml 에서 `/posts/` 글 경로(pathname) 목록을 가져온다. */
export const getPostUrls = async (
  request: APIRequestContext,
): Promise<string[]> => {
  const response = await request.get('/sitemap.xml');
  const xml = await response.text();

  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, loc]) => new URL(loc.trim()).pathname)
    .filter((pathname) => pathname.startsWith('/posts/'));

  return [...new Set(paths)];
};

/** 글을 순회해 해당 요소를 가진 첫 글의 경로를 반환한다. 없으면 실패한다. */
export const findPostWithFeature = async (
  page: Page,
  feature: PostFeature,
): Promise<string> => {
  const urls = await getPostUrls(page.request);

  for (const url of urls) {
    await page.goto(url);
    await page.locator(POST_CONTENT_SELECTOR).first().waitFor();

    if ((await page.locator(FEATURE_SELECTORS[feature]).count()) > 0) {
      return url;
    }
  }

  throw new Error(`조건에 맞는 글 없음: ${feature}`);
};

/** 태그 필터 그룹 안의 태그 버튼(링크)들. */
export const getTagButtons = (page: Page): Locator =>
  page.getByRole('group', { name: '태그 필터' }).getByRole('link');
