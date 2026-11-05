import { execFileSync, spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { chromium } from '@playwright/test';
import sharp from 'sharp';

import { keepNextEnvClean } from '../nextEnv.ts';
import {
  THEMES,
  VIEWPORTS,
  buildSummary,
  diffImages,
  formatConsoleTable,
  parseCompareArgs,
  parseSitemapPaths,
  remoteOfRef,
  sampleRoutes,
  screenshotName,
} from './lib.ts';
import { renderMarkdown } from './markdown.ts';

import type { ChildProcess } from 'node:child_process';
import type { Browser } from '@playwright/test';
import type { EntryInput, LayoutMetrics, RawImage } from './lib.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUTPUT_ROOT = path.join(ROOT, '.visual');

/** e2e/CI 와 같은 환경: 운영 Sentry/GA 로 아무것도 보내지 않는다. */
const APP_ENV = {
  NEXT_PUBLIC_SENTRY_DISABLED: 'true',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: '',
};

const READY_TIMEOUT_MS = 60_000;
const SERVER_POLL_MS = 250;
/** layout-shift 가 이 시간 동안 없으면 레이아웃이 안정된 것으로 본다. */
const CLS_QUIET_MS = 1000;
/** 끝없이 시프트하는 페이지에서도 대기가 끝나도록 하는 상한. */
const CLS_SETTLE_MAX_MS = 8000;
const THEME_STORAGE_KEY = 'theme';

const log = (message: string) => console.error(`[visual] ${message}`);

const git = (args: string[], cwd = ROOT) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

/** base ref 를 sha 로 해석한다. 원격 추적 ref 면 먼저 그 remote 를 fetch 해 최신으로 맞춘다. */
const resolveBase = (base: string): string => {
  const remote = remoteOfRef(base, git(['remote']).split('\n'));
  if (remote) {
    log(`fetching ${remote} so ${base} is current`);
    try {
      git(['fetch', '--quiet', remote]);
    } catch (error) {
      throw new Error(
        `could not fetch ${remote} to resolve --base ${base}: ${String(error)}`,
      );
    }
  }
  try {
    return git(['rev-parse', '--verify', '--quiet', `${base}^{commit}`]);
  } catch {
    throw new Error(
      `--base ${base} does not resolve to a commit. Pass a branch, tag, sha or remote ref (default: origin/main).`,
    );
  }
};

const freePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
  });

const run = (command: string, args: string[], cwd: string) => {
  const result = spawnSync(command, args, {
    cwd,
    stdio: ['ignore', 2, 2],
    env: { ...process.env, ...APP_ENV },
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed in ${cwd}`);
  }
};

const waitForServer = async (url: string, child: ChildProcess) => {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`server exited early: ${url}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // 아직 뜨는 중이다.
    }
    await new Promise((resolve) => setTimeout(resolve, SERVER_POLL_MS));
  }
  throw new Error(`server did not become ready: ${url}`);
};

interface Side {
  name: 'before' | 'after';
  dir: string;
}

const startServer = async (dir: string, port: number) => {
  // pnpm 래퍼 없이 next 를 직접 띄워야 kill 이 서버까지 닿는다.
  const nextBin = path.join(dir, 'node_modules/next/dist/bin/next');
  const child = spawn(
    process.execPath,
    [nextBin, 'start', '-p', String(port), '-H', '127.0.0.1'],
    {
      cwd: dir,
      stdio: ['ignore', 'ignore', 'inherit'],
      env: { ...process.env, ...APP_ENV },
    },
  );
  await waitForServer(`http://127.0.0.1:${port}/sitemap.xml`, child);
  return child;
};

/** 애니메이션/전환/캐럿을 끈다. */
const FREEZE_CSS = `*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
  scroll-behavior: auto !important;
}`;

const capture = async (
  browser: Browser,
  origin: string,
  route: string,
  viewport: keyof typeof VIEWPORTS,
  theme: (typeof THEMES)[number],
): Promise<{ png: Buffer; metrics: LayoutMetrics }> => {
  const context = await browser.newContext({
    viewport: VIEWPORTS[viewport],
    deviceScaleFactor: 1,
    colorScheme: theme,
    reducedMotion: 'reduce',
    locale: 'en-US',
    timezoneId: 'UTC',
    isMobile: viewport === 'mobile',
    hasTouch: viewport === 'mobile',
  });

  try {
    await context.addInitScript(
      ([key, value]) => {
        localStorage.setItem(key, value);
        // 레이아웃 시프트는 문서가 만들어지는 순간부터 모은다.
        const shifts = { value: 0, lastAt: performance.now() };
        Object.assign(window, { __visualCls: shifts });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            };
            if (!shift.hadRecentInput) {
              shifts.value += shift.value;
              shifts.lastAt = performance.now();
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      },
      [THEME_STORAGE_KEY, theme],
    );

    const page = await context.newPage();
    await page.goto(new URL(route, origin).toString(), {
      waitUntil: 'load',
    });
    await page.addStyleTag({ content: FREEZE_CSS });

    // 하이드레이션, 테마 클래스, 폰트, 이미지를 조건으로 기다린다.
    await page.waitForFunction((expectDark) => {
      const hydrated = [
        ...document.body.querySelectorAll('h1, header, main, article'),
      ].some((el) =>
        Object.keys(el).some((key) => key.startsWith('__reactProps$')),
      );
      const themed =
        document.documentElement.classList.contains('dark') === expectDark;
      return hydrated && themed && document.fonts.status === 'loaded';
    }, theme === 'dark');
    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = [...document.images];
      images.forEach((img) => {
        img.loading = 'eager';
      });
      await Promise.all(
        images.map((img) => img.decode().catch(() => undefined)),
      );
      // 레이아웃이 안정되도록 두 프레임을 기다린다.
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    });

    // 하이드레이션 뒤에 늦게 일어나는 시프트까지 잡도록, 조용해질 때까지 조건으로 기다린다.
    await page.evaluate(
      ([quietMs, maxMs]) =>
        new Promise<void>((resolve) => {
          const shifts = (
            window as unknown as { __visualCls: { lastAt: number } }
          ).__visualCls;
          const startedAt = performance.now();
          const check = () => {
            const now = performance.now();
            if (
              now - Math.max(shifts.lastAt, startedAt) >= quietMs ||
              now - startedAt >= maxMs
            ) {
              resolve();
            } else {
              requestAnimationFrame(check);
            }
          };
          check();
        }),
      [CLS_QUIET_MS, CLS_SETTLE_MAX_MS],
    );

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const cls = (window as unknown as { __visualCls: { value: number } })
        .__visualCls.value;
      return {
        scrollHeight: doc.scrollHeight,
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        horizontalOverflow: doc.scrollWidth > doc.clientWidth,
        cls: Math.round(cls * 1e6) / 1e6,
      };
    });

    const png = await page.screenshot({
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      mask: [page.locator('[data-visual-mask]')],
    });

    return { png, metrics };
  } finally {
    await context.close();
  }
};

const toRaw = async (png: Buffer): Promise<RawImage> => {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
};

const writeRaw = (image: RawImage, file: string) =>
  sharp(Buffer.from(image.data), {
    raw: { width: image.width, height: image.height, channels: 4 },
  })
    .png()
    .toFile(file);

const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const main = async (): Promise<number> => {
  const options = parseCompareArgs(process.argv.slice(2));
  const baseSha = resolveBase(options.base);
  const headSha = git(['rev-parse', 'HEAD']);
  const headDirty = git(['status', '--porcelain']) !== '';

  const outDir = path.join(OUTPUT_ROOT, timestamp());
  for (const dir of ['before', 'after', 'diff']) {
    mkdirSync(path.join(outDir, dir), { recursive: true });
  }

  // 사용자의 체크아웃은 건드리지 않고, base 는 OS 임시 디렉터리의 worktree 에서 빌드한다.
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'visual-compare-'));
  const baseDir = path.join(tempRoot, 'base');
  const servers: ChildProcess[] = [];
  let browser: Browser | null = null;
  let worktreeAdded = false;

  try {
    log(`creating worktree for ${options.base} (${baseSha.slice(0, 7)})`);
    git(['worktree', 'add', '--detach', baseDir, baseSha]);
    worktreeAdded = true;

    log('installing dependencies for base');
    run('pnpm', ['install', '--frozen-lockfile'], baseDir);

    const sides: Side[] = [
      { name: 'before', dir: baseDir },
      { name: 'after', dir: ROOT },
    ];
    for (const side of sides) {
      log(`building ${side.name} (${side.dir})`);
      keepNextEnvClean(side.dir, () => run('pnpm', ['build'], side.dir));
    }

    const ports = [await freePort(), await freePort()];
    for (const [i, side] of sides.entries()) {
      servers.push(await startServer(side.dir, ports[i]));
    }
    const origins = {
      before: `http://127.0.0.1:${ports[0]}`,
      after: `http://127.0.0.1:${ports[1]}`,
    };

    const sitemap = await (await fetch(`${origins.after}/sitemap.xml`)).text();
    const routes =
      options.routes ??
      sampleRoutes(parseSitemapPaths(sitemap), options.maxRoutes);
    log(`routes: ${routes.join(', ')}`);

    browser = await chromium.launch();
    const inputs: EntryInput[] = [];

    for (const route of routes) {
      for (const viewport of Object.keys(
        VIEWPORTS,
      ) as (keyof typeof VIEWPORTS)[]) {
        for (const theme of THEMES) {
          const name = screenshotName(route, viewport, theme);
          const before = await capture(
            browser,
            origins.before,
            route,
            viewport,
            theme,
          );
          const after = await capture(
            browser,
            origins.after,
            route,
            viewport,
            theme,
          );
          writeFileSync(path.join(outDir, 'before', name), before.png);
          writeFileSync(path.join(outDir, 'after', name), after.png);

          const { stats, image } = diffImages(
            await toRaw(before.png),
            await toRaw(after.png),
            options.pixelThreshold,
          );
          await writeRaw(image, path.join(outDir, 'diff', name));

          inputs.push({
            route,
            viewport,
            theme,
            before: before.metrics,
            after: after.metrics,
            diff: stats,
          });
          log(`captured ${name}`);
        }
      }
    }

    const summary = buildSummary(
      {
        base: options.base,
        baseSha,
        headSha,
        headDirty,
        createdAt: new Date().toISOString(),
      },
      inputs,
      options.expectChanged,
      { diffRatio: options.diffTolerance, cls: options.clsTolerance },
    );

    writeFileSync(
      path.join(outDir, 'summary.json'),
      `${JSON.stringify(summary, null, 2)}\n`,
    );
    writeFileSync(path.join(outDir, 'comment.md'), renderMarkdown(summary));

    console.log(formatConsoleTable(summary));
    console.log(`\nverdict: ${summary.passed ? 'PASS' : 'FAIL'}`);
    if (summary.expectedButUnchanged.length > 0) {
      console.log(
        `warning: expected to change but nothing differed: ${summary.expectedButUnchanged.join(', ')}`,
      );
    }
    console.log(`output: ${outDir}`);
    console.log(`summary: ${path.join(outDir, 'summary.json')}`);
    console.log(`markdown: ${path.join(outDir, 'comment.md')}`);

    return summary.passed ? 0 : 1;
  } finally {
    await browser?.close();
    for (const server of servers) server.kill();
    if (worktreeAdded) {
      try {
        git(['worktree', 'remove', '--force', baseDir]);
      } catch (error) {
        log(`could not remove worktree ${baseDir}: ${String(error)}`);
      }
    }
    if (existsSync(tempRoot))
      rmSync(tempRoot, { recursive: true, force: true });
  }
};

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(error);
    process.exitCode = 2;
  },
);
