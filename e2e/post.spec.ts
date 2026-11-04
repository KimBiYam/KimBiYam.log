import { expect, test } from '@playwright/test';

import { findPostWithFeature } from './support/posts';

import type { Locator, Page } from '@playwright/test';

const FIRST_POST_LINK =
  'section[aria-label="추천 글"] a, ul[aria-label="최근 글"] a';
const POST_CONTENT = 'article .prose';

interface WindowWithOpenCalls extends Window {
  __openCalls: string[];
}

const isDesktop = () => test.info().project.name === 'desktop';

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

/** 홈 목록의 첫 글을 클릭해 글 페이지로 이동하고 경로를 반환한다. */
const openFirstPostFromList = async (page: Page): Promise<string> => {
  await page.goto('/');
  const link = page.locator(FIRST_POST_LINK).first();
  await expect(link).toBeVisible();
  const href = (await link.getAttribute('href')) ?? '';
  expect(href).toMatch(/^\/posts\//);
  await link.click();
  await expect(page).toHaveURL(href);
  await expect(page.locator('h1')).toBeVisible();
  return href;
};

const scrollPageTo = async (page: Page, ratio: number) => {
  await page.evaluate((r) => {
    window.scrollTo(
      0,
      (document.documentElement.scrollHeight - window.innerHeight) * r,
    );
  }, ratio);
};

test('글 페이지에 제목, 본문, 메타, JSON-LD, canonical 이 있다', async ({
  page,
}) => {
  const path = await openFirstPostFromList(page);

  await expect(page.locator('h1')).not.toBeEmpty();
  await expect(page.locator(POST_CONTENT)).not.toBeEmpty();

  const header = page.locator('article header');
  await expect(header.locator('time')).toHaveAttribute(
    'datetime',
    /^\d{4}-\d{2}-\d{2}/,
  );
  await expect(header.getByText(/\d+ min read/)).toBeVisible();

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(JSON.parse(jsonLd ?? '')).toBeTruthy();

  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute('href');
  expect(canonical).toBeTruthy();
  expect(new URL(canonical ?? '').pathname).toBe(path);
});

test('목차 항목을 클릭하면 해당 헤딩으로 이동한다', async ({ page }) => {
  await findPostWithFeature(page, 'heading');

  if (!isDesktop()) {
    // 모바일: 목차를 먼저 연다.
    const details = page.locator('details', { hasText: 'ON THIS PAGE' });
    await waitForHydration(details);
    await details.locator('summary').click();
  }

  const nav = page.getByRole('navigation', { name: '목차' });
  const items = nav.getByRole('button');
  await expect(items.first()).toBeVisible();

  const headings = page.locator(`${POST_CONTENT} :is(h2, h3, h4)`);
  const isOutsideViewport = (locator: Locator) =>
    locator.evaluate((element) => {
      const { top, bottom } = element.getBoundingClientRect();
      return bottom < 0 || top > window.innerHeight;
    });

  // 클릭 전에 뷰포트 밖에 있는 헤딩의 목차 항목을 고른다(없으면 실패).
  const count = await items.count();
  let target: Locator | null = null;
  let heading: Locator | null = null;
  for (let index = count - 1; index >= 0; index -= 1) {
    const item = items.nth(index);
    const title = ((await item.textContent()) ?? '').trim();
    const candidate = headings.filter({ hasText: title }).first();
    if (await isOutsideViewport(candidate)) {
      target = item;
      heading = candidate;
      break;
    }
  }
  if (!target || !heading) {
    throw new Error('뷰포트 밖에 있는 헤딩의 목차 항목이 없음');
  }

  const scrollBefore = await page.evaluate(() => window.scrollY);

  await target.click();

  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .not.toBe(scrollBefore);
  await expect(heading).toBeInViewport();
  if (isDesktop()) {
    await expect(target).toHaveAttribute('aria-current', 'location');
  } else {
    // 모바일 목차는 항목 선택 후 닫힌다.
    await expect(nav).toBeHidden();
  }
});

test('코드 복사 버튼이 클립보드에 코드를 복사한다', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await findPostWithFeature(page, 'codeBlock');

  const figure = page
    .locator(`${POST_CONTENT} figure`)
    .filter({ has: page.locator('pre') })
    .first();
  const copyButton = figure.getByRole('button', { name: 'Copy' });
  await waitForHydration(copyButton);

  const code = (await figure.locator('pre code').textContent()) ?? '';
  expect(code.length).toBeGreaterThan(0);

  await copyButton.click();

  await expect(figure.getByRole('button', { name: 'Copied' })).toBeVisible();
  await expect(figure.getByRole('status')).toHaveText('코드를 복사했습니다.');
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(code);
});

test('이전/다음 글 링크로 이동하면 URL 과 제목이 바뀐다', async ({ page }) => {
  const startPath = await openFirstPostFromList(page);
  const startTitle = (await page.locator('h1').textContent()) ?? '';

  const nav = page.getByRole('navigation', { name: '게시글 이동' });
  await expect(nav).toBeVisible();
  const link = nav.getByRole('link').first();
  const href = (await link.getAttribute('href')) ?? '';
  expect(href).not.toBe(startPath);

  await link.click();

  await expect(page).toHaveURL(href);
  await expect(page.locator('h1')).not.toHaveText(startTitle);
});

test('공유 버튼이 올바른 호스트로 window.open 을 호출한다', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const calls: string[] = [];
    (window as unknown as WindowWithOpenCalls).__openCalls = calls;
    window.open = (url?: string | URL) => {
      calls.push(String(url));
      return null;
    };
  });
  await openFirstPostFromList(page);

  const buttons = page.getByRole('button', { name: '공유하기' });
  await expect(buttons).toHaveCount(2);
  await waitForHydration(buttons.first());

  const getCalls = () =>
    page.evaluate(() => (window as unknown as WindowWithOpenCalls).__openCalls);

  await buttons.nth(0).click();
  await expect.poll(async () => (await getCalls()).length).toBe(1);
  expect(new URL((await getCalls())[0]).hostname).toBe('www.facebook.com');

  await buttons.nth(1).click();
  await expect.poll(async () => (await getCalls()).length).toBe(2);
  expect(new URL((await getCalls())[1]).hostname).toBe('twitter.com');
});

test('스크롤하면 읽기 진행바와 맨 위로 버튼이 반응한다', async ({ page }) => {
  await openFirstPostFromList(page);

  const bar = page.locator('.reading-progress');
  const readProgress = async () => {
    const transform = await bar.evaluate((el) => el.style.transform);
    const match = /scaleX\(([\d.]+)\)/.exec(transform);
    return match ? Number(match[1]) : -1;
  };

  // 진행바 effect 가 실행되어 scaleX 가 설정될 때까지(하이드레이션 완료).
  await expect.poll(readProgress).toBe(0);

  const scrollTop = page.getByRole('button', { name: 'scroll-to-top-button' });
  await expect(scrollTop).toBeHidden();

  await expect(async () => {
    await scrollPageTo(page, 0.5);
    expect(await readProgress()).toBeGreaterThan(0);
  }).toPass();

  const half = await readProgress();
  await expect(async () => {
    await scrollPageTo(page, 1);
    expect(await readProgress()).toBeGreaterThan(half);
  }).toPass();

  await expect(scrollTop).toBeVisible();
  await expect(scrollTop).toHaveCSS('opacity', '1');

  await scrollTop.click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThanOrEqual(2);
  await expect(scrollTop).toBeHidden();
});

test('이미지를 클릭하면 medium-zoom 으로 확대된다', async ({ page }) => {
  await findPostWithFeature(page, 'image');

  const image = page.locator(`${POST_CONTENT} img`).first();
  await image.scrollIntoViewIfNeeded();
  // medium-zoom 이 attach 되면 `medium-zoom-image` 클래스가 붙는다.
  await expect(image).toHaveClass(/medium-zoom-image/);
  await expect(page.locator('.medium-zoom-overlay')).toHaveCount(0);

  await image.click();

  // 열리면 원본은 `--hidden` 이 되고, 복제된 확대 이미지가 `--opened` 를 갖는다.
  await expect(image).toHaveClass(/medium-zoom-image--hidden/);
  await expect(
    page.locator('img.medium-zoom-image--opened').last(),
  ).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/medium-zoom--opened/);
  await expect(page.locator('.medium-zoom-overlay')).toBeVisible();

  // 확대 이미지가 가운데, 고정 헤더가 위쪽을 덮으므로 오버레이 왼쪽 아래 모서리를 클릭해 닫는다.
  // medium-zoom 은 열림 전환 중의 close 를 무시하므로 전환이 끝날 때까지 재시도한다.
  const viewport = page.viewportSize();
  await expect(async () => {
    await page.mouse.click(5, (viewport?.height ?? 0) - 5);
    await expect(page.locator('body')).not.toHaveClass(/medium-zoom--opened/, {
      timeout: 1000,
    });
  }).toPass();

  await expect(image).not.toHaveClass(/medium-zoom-image--hidden/);
  await expect(page.locator('.medium-zoom-overlay')).toHaveCount(0);
});
