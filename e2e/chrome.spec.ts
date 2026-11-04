import { expect, test } from '@playwright/test';

import { getPostUrls, getTagButtons } from './support/posts';

import type { Locator, Page } from '@playwright/test';

const FEED_PATH = '/feed.xml';
const THEME_STORAGE_KEY = 'theme';
const DARK_CLASS = /(^|\s)dark(\s|$)/;

type ProjectName = 'desktop' | 'mobile';

const getProjectName = (): ProjectName => {
  const { name } = test.info().project;
  if (name !== 'desktop' && name !== 'mobile') {
    throw new Error(`알 수 없는 프로젝트: ${name}`);
  }
  return name;
};

/** React 가 요소에 props 를 붙일 때까지(하이드레이션 완료) 기다린다. */
const waitForHydration = async (locator: Locator) => {
  await locator.waitFor();
  await locator.evaluate(
    (element) =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (
            Object.keys(element).some((key) => key.startsWith('__reactProps$'))
          )
            resolve();
          else requestAnimationFrame(check);
        };
        check();
      }),
  );
};

const readStoredTheme = (page: Page) =>
  page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY);

/** 홈에서 첫 태그 링크의 경로를 런타임에 구한다. */
const getFirstTagPath = async (page: Page): Promise<string> => {
  await page.goto('/');
  // 첫 항목은 "전체"(/)이므로 두 번째 항목을 쓴다.
  const tag = getTagButtons(page).nth(1);
  await expect(tag).toBeVisible();
  const href = (await tag.getAttribute('href')) ?? '';
  expect(href).toMatch(/^\/tags\//);
  return href;
};

const mainNav = (page: Page) =>
  page.getByRole('navigation', { name: '주요 메뉴' });
const mobileNav = (page: Page) =>
  page.getByRole('navigation', { name: '모바일 메뉴' });
const menuButton = (page: Page) =>
  page.getByRole('button', { name: '메뉴', exact: true });

test.describe('다크 모드', () => {
  // 시스템 설정이 초기 테마에 영향을 주지 않도록 고정한다.
  test.use({ colorScheme: 'light' });

  test('토글하면 html 클래스와 localStorage 가 바뀌고 새로고침 후에도 유지된다', async ({
    page,
  }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toDark = page.getByRole('button', { name: '다크 모드로 전환' });
    await waitForHydration(toDark);

    // 사전 조건: 라이트 테마, 저장된 값 없음.
    await expect(html).not.toHaveClass(DARK_CLASS);
    expect(await readStoredTheme(page)).toBeNull();

    await toDark.click();

    await expect(html).toHaveClass(DARK_CLASS);
    await expect.poll(() => readStoredTheme(page)).toBe('dark');

    await page.reload();

    await expect(html).toHaveClass(DARK_CLASS);
    const toLight = page.getByRole('button', { name: '라이트 모드로 전환' });
    await waitForHydration(toLight);
    expect(await readStoredTheme(page)).toBe('dark');

    // 다시 토글하면 라이트로 돌아간다.
    await toLight.click();
    await expect(html).not.toHaveClass(DARK_CLASS);
    await expect.poll(() => readStoredTheme(page)).toBe('light');
  });
});

test('모바일 메뉴 버튼은 모바일에서만 보이고 메뉴로 이동할 수 있다', async ({
  page,
}) => {
  const project = getProjectName();
  const tagPath = await getFirstTagPath(page);
  await page.goto(tagPath);

  const button = menuButton(page);

  if (project === 'desktop') {
    await expect(button).toBeHidden();
    await expect(mobileNav(page)).toBeHidden();
    return;
  }

  await waitForHydration(button);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(mobileNav(page)).toBeHidden();

  await button.click();

  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(mobileNav(page)).toBeVisible();

  await mobileNav(page).getByRole('link', { name: 'Posts' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(mobileNav(page)).toBeHidden();
});

test('헤더 내비의 Posts 는 홈과 태그 페이지에서만 활성화된다', async ({
  page,
}) => {
  const project = getProjectName();
  const tagPath = await getFirstTagPath(page);
  const [postPath] = await getPostUrls(page.request);
  expect(postPath).toBeTruthy();

  // 데스크톱은 주요 메뉴, 모바일은 모바일 메뉴(펼친 상태)의 링크를 반환한다.
  const getPostsLink = async (): Promise<Locator> => {
    if (project === 'desktop') {
      await expect(mobileNav(page)).toBeHidden();
      const link = mainNav(page).getByRole('link', { name: 'Posts' });
      await expect(link).toBeVisible();
      return link;
    }
    await expect(mainNav(page)).toBeHidden();
    const button = menuButton(page);
    await waitForHydration(button);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const link = mobileNav(page).getByRole('link', { name: 'Posts' });
    await expect(link).toBeVisible();
    return link;
  };

  await page.goto('/');
  await expect(await getPostsLink()).toHaveAttribute('aria-current', 'page');

  await page.goto(tagPath);
  await expect(await getPostsLink()).toHaveAttribute('aria-current', 'page');

  await page.goto(postPath);
  await expect(page.locator('h1')).toBeVisible();
  await expect(await getPostsLink()).not.toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('RSS 링크가 피드 경로를 가리킨다', async ({ page }) => {
  const project = getProjectName();
  await page.goto('/');

  let rss: Locator;
  if (project === 'desktop') {
    rss = mainNav(page).getByRole('link', { name: 'RSS' });
  } else {
    const button = menuButton(page);
    await waitForHydration(button);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    rss = mobileNav(page).getByRole('link', { name: 'RSS' });
  }

  await expect(rss).toBeVisible();
  const href = (await rss.getAttribute('href')) ?? '';
  expect(href.endsWith(FEED_PATH)).toBe(true);
});
