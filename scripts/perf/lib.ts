export const SCHEMA_VERSION = 1;

/** 허용 오차: 기준값의 1% 와 최소 256B 중 큰 값. 측정이 결정적이라 작게 둔다. */
export const TOLERANCE_RATIO = 0.01;
export const TOLERANCE_MIN_BYTES = 256;

/** 경로(pathname) → gzip 된 First Load JS 바이트. */
export type RouteSizes = Record<string, number>;

/** 게이트 대상 지표만 담는다. 커밋되는 `perf-baseline.json` 의 모양이다. */
export interface PerfBaseline {
  schemaVersion: number;
  firstLoadJsGzipBytes: RouteSizes;
}

/** `pnpm perf` 출력. 게이트 대상 지표 + 참고용 정보. */
export interface PerfMetrics extends PerfBaseline {
  info: {
    buildTimeMs: number | null;
    routeCount: number;
  };
}

export type DiffStatus = 'ok' | 'improved' | 'regressed' | 'new' | 'removed';

export interface DiffRow {
  route: string;
  baseline: number | null;
  current: number | null;
  delta: number | null;
  status: DiffStatus;
}

export interface CompareResult {
  rows: DiffRow[];
  passed: boolean;
}

/** sitemap.xml 에서 중복 없는 pathname 목록을 뽑는다. */
export const parseSitemapPaths = (xml: string): string[] => {
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => {
    const { pathname } = new URL(loc.trim());
    return pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  });

  return [...new Set(paths)].sort();
};

/** 프리렌더된 HTML 이 위치한 `.next/server/app` 기준 상대 경로. */
export const routeToHtmlPath = (pathname: string): string =>
  pathname === '/'
    ? 'index.html'
    : `${decodeURIComponent(pathname).slice(1)}.html`;

/** HTML 의 `<script src>` 가 가리키는 `/_next/static/` 파일 경로(중복 제거)를 반환한다. */
export const extractScriptSrcs = (html: string): string[] => {
  const srcs = [...html.matchAll(/<script\b[^>]*?\bsrc="([^"]+)"/g)]
    .map(([, src]) => src.split('?')[0])
    .filter((src) => src.startsWith('/_next/static/'))
    .map((src) => decodeURIComponent(src));

  return [...new Set(srcs)].sort();
};

export const getTolerance = (baseline: number): number =>
  Math.max(Math.ceil(baseline * TOLERANCE_RATIO), TOLERANCE_MIN_BYTES);

/**
 * 현재 지표를 기준값과 비교한다. 기준값보다 허용 오차 넘게 커진 경로가 있으면 실패한다.
 * 기준값에 없던 경로(new)와 사라진 경로(removed)는 게이트하지 않는다.
 */
export const compareMetrics = (
  baseline: RouteSizes,
  current: RouteSizes,
): CompareResult => {
  const routes = [
    ...new Set([...Object.keys(baseline), ...Object.keys(current)]),
  ].sort();

  const rows = routes.map((route): DiffRow => {
    const base = baseline[route] ?? null;
    const cur = current[route] ?? null;

    if (base === null) {
      return {
        route,
        baseline: null,
        current: cur,
        delta: null,
        status: 'new',
      };
    }
    if (cur === null) {
      return {
        route,
        baseline: base,
        current: null,
        delta: null,
        status: 'removed',
      };
    }

    const delta = cur - base;
    const status: DiffStatus =
      delta > getTolerance(base) ? 'regressed' : delta < 0 ? 'improved' : 'ok';

    return { route, baseline: base, current: cur, delta, status };
  });

  return { rows, passed: rows.every((row) => row.status !== 'regressed') };
};

/**
 * 개선된 값만 반영한 새 기준값을 만든다. 값은 낮아지기만 하고(악화·동일은 기준 유지),
 * 새 경로는 추가, 사라진 경로는 제거한다.
 */
export const ratchetBaseline = (
  baseline: RouteSizes,
  current: RouteSizes,
): RouteSizes =>
  Object.fromEntries(
    Object.keys(current)
      .sort()
      .map((route) => [
        route,
        Math.min(baseline[route] ?? Infinity, current[route]),
      ]),
  );

const formatBytes = (bytes: number | null): string =>
  bytes === null ? '-' : `${bytes}`;

const formatDelta = (delta: number | null): string =>
  delta === null ? '-' : `${delta > 0 ? '+' : ''}${delta}`;

/** 변화가 있는 행(+ 항상 요약)을 정렬된 텍스트 표로 만든다. */
export const formatDiffTable = (result: CompareResult): string => {
  const changed = result.rows.filter((row) => row.status !== 'ok');
  const header = ['route', 'baseline(B)', 'current(B)', 'delta(B)', 'status'];
  const body = changed.map((row) => [
    row.route,
    formatBytes(row.baseline),
    formatBytes(row.current),
    formatDelta(row.delta),
    row.status,
  ]);
  const table = [header, ...body];
  const widths = header.map((_, i) =>
    Math.max(...table.map((r) => r[i].length)),
  );
  const lines = table.map((r) =>
    r.map((cell, i) => cell.padEnd(widths[i])).join('  '),
  );

  const count = (status: DiffStatus) =>
    result.rows.filter((row) => row.status === status).length;
  const summary = `${result.rows.length} routes: ${count('regressed')} regressed, ${count('improved')} improved, ${count('new')} new, ${count('removed')} removed, ${count('ok')} unchanged`;

  return changed.length === 0 ? summary : [...lines, '', summary].join('\n');
};

export const isPerfBaseline = (value: unknown): value is PerfBaseline => {
  if (typeof value !== 'object' || value === null) return false;
  const { schemaVersion, firstLoadJsGzipBytes } = value as Record<
    string,
    unknown
  >;

  return (
    schemaVersion === SCHEMA_VERSION &&
    typeof firstLoadJsGzipBytes === 'object' &&
    firstLoadJsGzipBytes !== null &&
    Object.values(firstLoadJsGzipBytes).every((v) => typeof v === 'number')
  );
};
