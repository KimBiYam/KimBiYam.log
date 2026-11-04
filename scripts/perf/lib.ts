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

/** `pnpm perf` 가 빌드 후 `.next/perf-build.json` 에 남기는 표식. `--reuse` 가 낯선 빌드를 읽지 않게 한다. */
export interface BuildMarker {
  schemaVersion: number;
  sentryDisabled: string | null;
  gaIdEmpty: boolean;
  analyze: boolean;
  headSha: string | null;
}

export const BUILD_MARKER_FILE = 'perf-build.json';

/** 환경 변수와 git HEAD 에서 이 빌드가 가져야 할 표식을 만든다. */
export const createBuildMarker = (
  env: Record<string, string | undefined>,
  headSha: string | null,
): BuildMarker => ({
  schemaVersion: SCHEMA_VERSION,
  sentryDisabled: env.NEXT_PUBLIC_SENTRY_DISABLED ?? null,
  gaIdEmpty: (env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID ?? '') === '',
  analyze: Boolean(env.ANALYZE) && env.ANALYZE !== 'false',
  headSha,
});

export const isBuildMarker = (value: unknown): value is BuildMarker => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;

  return (
    v.schemaVersion === SCHEMA_VERSION &&
    (v.sentryDisabled === null || typeof v.sentryDisabled === 'string') &&
    typeof v.gaIdEmpty === 'boolean' &&
    typeof v.analyze === 'boolean' &&
    (v.headSha === null || typeof v.headSha === 'string')
  );
};

/**
 * 기존 `.next` 를 재사용해도 되는지 검사한다. 표식이 없거나 기대값과 다르면
 * 사람이 읽을 수 있는 사유 목록을 반환하고, 통과하면 빈 배열이다.
 */
export const checkBuildMarker = (
  actual: unknown,
  expected: BuildMarker,
): string[] => {
  if (actual === undefined || actual === null) {
    return [
      `${BUILD_MARKER_FILE} is missing (.next was not built by \`pnpm perf\`)`,
    ];
  }
  if (!isBuildMarker(actual)) {
    return [`${BUILD_MARKER_FILE} is malformed or from another schema version`];
  }

  const mismatches: string[] = [];
  const compare = (name: string, got: unknown, want: unknown) => {
    if (got !== want) {
      mismatches.push(
        `${name}: built with ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`,
      );
    }
  };
  compare(
    'NEXT_PUBLIC_SENTRY_DISABLED',
    actual.sentryDisabled,
    expected.sentryDisabled,
  );
  compare('GA tracking id empty', actual.gaIdEmpty, expected.gaIdEmpty);
  compare('ANALYZE', actual.analyze, expected.analyze);
  compare('git HEAD', actual.headSha, expected.headSha);

  return mismatches;
};

/**
 * regressed: 허용 오차를 넘어 커짐 / improved: 허용 오차를 넘어 줄어듦(ratchet 대상) /
 * within-tolerance: 변했지만 허용 오차 이내 / unchanged: 동일.
 */
export type DiffStatus =
  | 'unchanged'
  | 'within-tolerance'
  | 'improved'
  | 'regressed'
  | 'new'
  | 'removed';

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

/** 허용 오차(`tolerance`) 경계: 정확히 오차만큼 변한 것은 아직 오차 이내다. */
export const classifyDelta = (delta: number, tolerance: number): DiffStatus => {
  if (delta > tolerance) return 'regressed';
  if (delta < -tolerance) return 'improved';
  return delta === 0 ? 'unchanged' : 'within-tolerance';
};

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
    return {
      route,
      baseline: base,
      current: cur,
      delta,
      status: classifyDelta(delta, getTolerance(base)),
    };
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
  const changed = result.rows.filter((row) => row.status !== 'unchanged');
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
  const summary = `${result.rows.length} routes: ${count('regressed')} regressed, ${count('improved')} improved (beyond tolerance), ${count('within-tolerance')} within tolerance, ${count('new')} new, ${count('removed')} removed, ${count('unchanged')} unchanged`;
  const hint =
    count('improved') > 0
      ? 'Improved beyond tolerance: keep the change and run `pnpm perf:update` to ratchet the baseline.'
      : count('within-tolerance') > 0 && count('regressed') === 0
        ? 'Changes are within tolerance (1% / min 256 B): not a measurable improvement, so there is nothing to ratchet.'
        : null;

  return changed.length === 0
    ? summary
    : [...lines, '', summary, ...(hint ? [hint] : [])].join('\n');
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
