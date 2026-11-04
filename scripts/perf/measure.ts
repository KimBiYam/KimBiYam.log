import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

import {
  SCHEMA_VERSION,
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

/** 빌드를 실행하고 걸린 시간(ms)을 반환한다. */
const build = (): number => {
  const startedAt = Date.now();
  const result = spawnSync('pnpm', ['build'], {
    cwd: ROOT,
    stdio: ['ignore', 2, 2],
    env: { ...process.env, ...BUILD_ENV },
  });

  if (result.status !== 0) {
    throw new Error(`pnpm build failed (exit ${result.status})`);
  }

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
  const buildTimeMs = reuse ? null : build();
  const firstLoadJsGzipBytes = measureRouteSizes();

  return {
    schemaVersion: SCHEMA_VERSION,
    firstLoadJsGzipBytes,
    info: { buildTimeMs, routeCount: Object.keys(firstLoadJsGzipBytes).length },
  };
};
