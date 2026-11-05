import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

import { keepNextEnvClean } from '../nextEnv.ts';
import {
  BUILD_MARKER_FILE,
  SCHEMA_VERSION,
  checkBuildMarker,
  createBuildMarker,
  extractScriptSrcs,
  parseSitemapPaths,
  routeToHtmlPath,
} from './lib.ts';

import type { PerfMetrics, RouteSizes } from './lib.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const NEXT_DIR = path.join(ROOT, '.next');
const APP_DIR = path.join(NEXT_DIR, 'server/app');

/** 번들 크기는 Sentry/GA 설정에 따라 달라지므로, 측정 빌드는 e2e/CI 와 같은 환경으로 고정한다. */
const BUILD_ENV = {
  NEXT_PUBLIC_SENTRY_DISABLED: 'true',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: '',
};

const MARKER_PATH = path.join(NEXT_DIR, BUILD_MARKER_FILE);

const gitHead = (): string | null => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  } catch {
    return null;
  }
};

/** 이 프로세스가 빌드할 때 쓰는 환경(BUILD_ENV 포함)과 현재 HEAD 로 표식을 만든다. */
const currentMarker = (env: Record<string, string | undefined>) =>
  createBuildMarker({ ...env, ...BUILD_ENV }, gitHead());

/** `--reuse` 전에 `.next` 가 `pnpm perf` 로 같은 조건에서 빌드됐는지 확인한다. */
const assertReusable = () => {
  const actual: unknown = existsSync(MARKER_PATH)
    ? JSON.parse(readFileSync(MARKER_PATH, 'utf8'))
    : undefined;
  const problems = checkBuildMarker(
    actual,
    // 재사용할 빌드는 ANALYZE 없이 만든 것이어야 한다.
    currentMarker({ ...process.env, ANALYZE: undefined }),
  );

  if (problems.length > 0) {
    throw new Error(
      `--reuse refused: .next does not match this perf build.\n${problems.map((p) => `  - ${p}`).join('\n')}\nRun \`pnpm perf\` without --reuse to rebuild.`,
    );
  }
};

/** 빌드를 실행하고 걸린 시간(ms)을 반환한다. */
const build = (): number => {
  const startedAt = Date.now();
  const result = keepNextEnvClean(ROOT, () =>
    spawnSync('pnpm', ['build'], {
      cwd: ROOT,
      stdio: ['ignore', 2, 2],
      env: { ...process.env, ...BUILD_ENV },
    }),
  );

  if (result.status !== 0) {
    throw new Error(`pnpm build failed (exit ${result.status})`);
  }

  writeFileSync(
    MARKER_PATH,
    `${JSON.stringify(currentMarker(process.env), null, 2)}\n`,
  );

  return Date.now() - startedAt;
};

const gzipSize = (file: string): number =>
  gzipSync(readFileSync(file), { level: 9 }).length;

/** 빌드 결과(.next)에서 sitemap 으로 찾은 경로별 gzip First Load JS 를 합산한다. */
const measureRouteSizes = (): RouteSizes => {
  const sitemap = readFileSync(path.join(APP_DIR, 'sitemap.xml.body'), 'utf8');
  const sizeCache = new Map<string, number>();

  return Object.fromEntries(
    parseSitemapPaths(sitemap).map((route) => {
      const html = readFileSync(
        path.join(APP_DIR, routeToHtmlPath(route)),
        'utf8',
      );
      const total = extractScriptSrcs(html).reduce((sum, src) => {
        const file = path.join(NEXT_DIR, src.replace('/_next/', ''));
        if (!sizeCache.has(file)) sizeCache.set(file, gzipSize(file));
        return sum + (sizeCache.get(file) as number);
      }, 0);

      return [route, total];
    }),
  );
};

/** `reuse` 면 기존 `.next` 를 그대로 쓰고 빌드 시간은 null 이다. */
export const measure = ({ reuse }: { reuse: boolean }): PerfMetrics => {
  if (reuse) assertReusable();
  const buildTimeMs = reuse ? null : build();
  const firstLoadJsGzipBytes = measureRouteSizes();

  return {
    schemaVersion: SCHEMA_VERSION,
    firstLoadJsGzipBytes,
    info: { buildTimeMs, routeCount: Object.keys(firstLoadJsGzipBytes).length },
  };
};
