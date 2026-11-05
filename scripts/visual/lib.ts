export const SCHEMA_VERSION = 1;

/** 변경 없음으로 보는 diff 픽셀 비율(0~1) 기본 허용치. 같은 머신·같은 브라우저에서는 0 이어야 한다. */
export const DEFAULT_DIFF_TOLERANCE = 0.0001;
/** 채널(0~255) 하나가 이 값을 넘게 달라야 다른 픽셀로 센다. 반올림 노이즈(±1)를 무시한다. */
export const DEFAULT_PIXEL_THRESHOLD = 1;
/** CLS 증가 허용치. */
export const DEFAULT_CLS_TOLERANCE = 0.001;
export const DEFAULT_MAX_ROUTES = 5;
/** 로컬 main 은 오래될 수 있어서, 기본 base 는 가져온 원격 main 이다. */
export const DEFAULT_BASE = 'origin/main';

export const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 412, height: 915 },
} as const;
export const THEMES = ['light', 'dark'] as const;

export type ViewportName = keyof typeof VIEWPORTS;
export type ThemeName = (typeof THEMES)[number];

export type EntryStatus =
  | 'UNCHANGED'
  | 'CHANGED'
  | 'UNEXPECTED_CHANGE'
  | 'REGRESSION';

/** 한 화면(라우트×뷰포트×테마)을 DOM 에서 잰 값. */
export interface LayoutMetrics {
  scrollHeight: number;
  scrollWidth: number;
  clientWidth: number;
  horizontalOverflow: boolean;
  /** 측정하지 못했거나 너무 불안정하면 null. */
  cls: number | null;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DiffStats {
  changedPixels: number;
  totalPixels: number;
  /** changedPixels / totalPixels */
  ratio: number;
  /** 변경된 픽셀이 없으면 null. */
  boundingBox: BoundingBox | null;
}

export interface RawImage {
  /** RGBA, 픽셀당 4바이트. */
  data: Uint8Array;
  width: number;
  height: number;
}

export interface EntryInput {
  route: string;
  viewport: ViewportName;
  theme: ThemeName;
  before: LayoutMetrics;
  after: LayoutMetrics;
  diff: DiffStats;
}

export interface Entry extends EntryInput {
  heightDelta: number;
  widthDelta: number;
  clsDelta: number | null;
  status: EntryStatus;
  /** 상태의 근거. 사람이 읽는다. */
  reasons: string[];
}

export interface Tolerances {
  diffRatio: number;
  cls: number;
}

export interface Summary {
  schemaVersion: number;
  base: string;
  baseSha: string;
  headSha: string;
  /** 현재 작업 트리에 커밋되지 않은 변경이 있는지. */
  headDirty: boolean;
  /** 사람이 읽는 라벨: base 는 해석된 짧은 sha, 현재는 짧은 sha 와 (있다면) `+dirty`. */
  baseLabel: string;
  headLabel: string;
  createdAt: string;
  passed: boolean;
  tolerances: Tolerances;
  expectChanged: string[];
  /** 지정했지만 아무 변화도 관찰되지 않은 라우트. */
  expectedButUnchanged: string[];
  entries: Entry[];
}

/** 짧은 sha 라벨. 커밋되지 않은 변경이 있으면 `+dirty` 를 붙인다. */
export const formatShaLabel = (sha: string, dirty = false): string =>
  `${sha.slice(0, 7)}${dirty ? '+dirty' : ''}`;

/** sitemap.xml 에서 중복 없는 pathname 목록을 뽑는다. */
export const parseSitemapPaths = (xml: string): string[] => {
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => {
    const { pathname } = new URL(loc.trim());
    return pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  });

  return [...new Set(paths)].sort();
};

/**
 * 대표 라우트를 고른다: 홈, 태그 하나, 글 둘(처음/마지막), 그 밖의 경로.
 * 글/태그 이름은 하드코딩하지 않고 정렬된 목록에서 위치로만 고른다.
 */
export const sampleRoutes = (
  paths: string[],
  max = DEFAULT_MAX_ROUTES,
): string[] => {
  const sorted = [...new Set(paths)].sort();
  const posts = sorted.filter((p) => p.startsWith('/posts/'));
  const tags = sorted.filter((p) => p.startsWith('/tags/'));
  const others = sorted.filter(
    (p) => p !== '/' && !p.startsWith('/posts/') && !p.startsWith('/tags/'),
  );

  const picked = [
    sorted.includes('/') ? '/' : undefined,
    tags[0],
    posts[0],
    others[0],
    posts.length > 1 ? posts[posts.length - 1] : undefined,
    ...others.slice(1),
  ].filter((p): p is string => p !== undefined);

  return [...new Set(picked)].slice(0, max);
};

/**
 * base ref 가 원격 추적 ref(`origin/main`, `refs/remotes/origin/main`)이면 그 remote 이름을,
 * 아니면 null 을 돌려준다. 로컬 브랜치, 태그, sha 는 fetch 대상이 아니다.
 */
export const remoteOfRef = (ref: string, remotes: string[]): string | null => {
  const name = ref.startsWith('refs/remotes/')
    ? ref.slice('refs/remotes/'.length)
    : ref;
  const slash = name.indexOf('/');
  if (slash <= 0 || slash === name.length - 1) return null;
  const remote = name.slice(0, slash);
  return remotes.includes(remote) ? remote : null;
};

/** `--routes /a,/b` 같은 값을 정규화한다. 슬래시로 시작하지 않으면 붙인다. */
export const parseRouteList = (value: string): string[] => [
  ...new Set(
    value
      .split(',')
      .map((route) => route.trim())
      .filter(Boolean)
      .map((route) => (route.startsWith('/') ? route : `/${route}`)),
  ),
];

export interface CliOptions {
  base: string;
  routes: string[] | null;
  expectChanged: string[];
  diffTolerance: number;
  clsTolerance: number;
  pixelThreshold: number;
  maxRoutes: number;
}

const readNumber = (flag: string, value: string | undefined): number => {
  const parsed = Number(value);
  if (value === undefined || !Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${flag} needs a non-negative number (got "${value}")`);
  }
  return parsed;
};

/** `pnpm visual:compare` 인자를 파싱한다. `--flag value` 와 `--flag=value` 모두 허용한다. */
export const parseCompareArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    base: DEFAULT_BASE,
    routes: null,
    expectChanged: [],
    diffTolerance: DEFAULT_DIFF_TOLERANCE,
    clsTolerance: DEFAULT_CLS_TOLERANCE,
    pixelThreshold: DEFAULT_PIXEL_THRESHOLD,
    maxRoutes: DEFAULT_MAX_ROUTES,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const eq = argv[i].indexOf('=');
    const flag = eq === -1 ? argv[i] : argv[i].slice(0, eq);
    const inline = eq === -1 ? undefined : argv[i].slice(eq + 1);
    const value = inline ?? argv[i + 1];
    const consume = () => {
      if (inline === undefined) i += 1;
      return value;
    };

    switch (flag) {
      case '--base':
        options.base = consume();
        break;
      case '--routes':
        options.routes = parseRouteList(consume());
        break;
      case '--expect-changed':
        options.expectChanged = parseRouteList(consume());
        break;
      case '--tolerance':
        options.diffTolerance = readNumber(flag, consume());
        break;
      case '--cls-tolerance':
        options.clsTolerance = readNumber(flag, consume());
        break;
      case '--pixel-threshold':
        options.pixelThreshold = readNumber(flag, consume());
        break;
      case '--max-routes':
        options.maxRoutes = readNumber(flag, consume());
        break;
      default:
        throw new Error(`Unknown option: ${argv[i]}`);
    }
    if (value === undefined) throw new Error(`${flag} needs a value`);
  }

  return options;
};

/** 라우트를 파일 이름에 쓸 수 있는 slug 로 바꾼다. */
export const routeToSlug = (route: string): string => {
  if (route === '/') return 'home';
  let decoded = route;
  try {
    decoded = decodeURIComponent(route);
  } catch {
    // 잘못된 인코딩은 원문 그대로 쓴다.
  }
  return decoded
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^\w.\u00C0-\uFFFF-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const screenshotName = (
  route: string,
  viewport: ViewportName,
  theme: ThemeName,
): string => `${routeToSlug(route)}__${viewport}__${theme}.png`;

/**
 * 같은 크기로 맞춘(작은 쪽은 투명 패딩) 두 RGBA 이미지를 픽셀 단위로 비교한다.
 * 한쪽에만 있는 영역은 모두 다른 픽셀로 센다. diff 는 변경 픽셀을 빨강으로 칠한
 * 흐린 원본 위 이미지(RGBA)다.
 */
export const diffImages = (
  a: RawImage,
  b: RawImage,
  pixelThreshold = DEFAULT_PIXEL_THRESHOLD,
): { stats: DiffStats; image: RawImage } => {
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const out = new Uint8Array(width * height * 4);
  let changedPixels = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  const inside = (img: RawImage, x: number, y: number) =>
    x < img.width && y < img.height;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const o = (y * width + x) * 4;
      const inA = inside(a, x, y);
      const inB = inside(b, x, y);
      let changed = inA !== inB;

      if (inA && inB) {
        const ia = (y * a.width + x) * 4;
        const ib = (y * b.width + x) * 4;
        for (let c = 0; c < 4 && !changed; c += 1) {
          changed = Math.abs(a.data[ia + c] - b.data[ib + c]) > pixelThreshold;
        }
      }

      if (changed) {
        changedPixels += 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        out[o] = 255;
        out[o + 1] = 0;
        out[o + 2] = 0;
        out[o + 3] = 255;
      } else if (inB) {
        // 변경 없는 곳은 원본을 흐리게 깔아 위치를 가늠하게 한다.
        const ib = (y * b.width + x) * 4;
        for (let c = 0; c < 3; c += 1) {
          out[o + c] = 255 - Math.round((255 - b.data[ib + c]) * 0.25);
        }
        out[o + 3] = 255;
      }
    }
  }

  const totalPixels = width * height;

  return {
    stats: {
      changedPixels,
      totalPixels,
      ratio: totalPixels === 0 ? 0 : changedPixels / totalPixels,
      boundingBox:
        changedPixels === 0
          ? null
          : {
              x: minX,
              y: minY,
              width: maxX - minX + 1,
              height: maxY - minY + 1,
            },
    },
    image: { data: out, width, height },
  };
};

export const formatPercent = (ratio: number): string =>
  `${(ratio * 100).toFixed(4)}%`;

export const formatSigned = (value: number): string =>
  value > 0 ? `+${value}` : String(value);

const round = (value: number, digits = 4) => Number(value.toFixed(digits));

/** 레이아웃 지표 차이를 계산한다. */
export const layoutDeltas = (before: LayoutMetrics, after: LayoutMetrics) => ({
  heightDelta: after.scrollHeight - before.scrollHeight,
  widthDelta: after.scrollWidth - before.scrollWidth,
  clsDelta:
    before.cls === null || after.cls === null
      ? null
      : round(after.cls - before.cls, 6),
});

/**
 * 한 화면의 판정.
 * - 기대하지 않은 라우트: diff 비율이 허용치 이내이고 레이아웃(높이·너비·오버플로·CLS) 변화가 없어야 UNCHANGED.
 * - 변경을 기대한 라우트: 바뀌어도 CHANGED(참고용)이지만 새 가로 오버플로나 CLS 증가는 REGRESSION.
 */
export const judgeEntry = (
  input: EntryInput,
  expectedChanged: boolean,
  tolerances: Tolerances,
): Entry => {
  const { before, after, diff } = input;
  const { heightDelta, widthDelta, clsDelta } = layoutDeltas(before, after);
  const reasons: string[] = [];
  const newOverflow = after.horizontalOverflow && !before.horizontalOverflow;
  const overflowChanged =
    after.horizontalOverflow !== before.horizontalOverflow;
  const clsIncreased = clsDelta !== null && clsDelta > tolerances.cls;
  const clsChanged = clsDelta !== null && Math.abs(clsDelta) > tolerances.cls;

  let status: EntryStatus;

  if (expectedChanged) {
    if (newOverflow) reasons.push('introduces horizontal overflow');
    if (clsIncreased) reasons.push(`CLS increased by ${clsDelta}`);
    if (reasons.length > 0) status = 'REGRESSION';
    else if (diff.ratio > tolerances.diffRatio || heightDelta || widthDelta) {
      status = 'CHANGED';
    } else status = 'UNCHANGED';
  } else {
    if (diff.ratio > tolerances.diffRatio) {
      reasons.push(
        `diff ratio ${formatPercent(diff.ratio)} > ${formatPercent(tolerances.diffRatio)}`,
      );
    }
    if (heightDelta)
      reasons.push(`scroll height ${formatSigned(heightDelta)}px`);
    if (widthDelta) reasons.push(`scroll width ${formatSigned(widthDelta)}px`);
    if (overflowChanged) {
      reasons.push(
        `horizontal overflow ${before.horizontalOverflow} → ${after.horizontalOverflow}`,
      );
    }
    if (clsChanged) reasons.push(`CLS changed by ${clsDelta}`);
    status = reasons.length > 0 ? 'UNEXPECTED_CHANGE' : 'UNCHANGED';
  }

  return { ...input, heightDelta, widthDelta, clsDelta, status, reasons };
};

/** 전체 판정. UNEXPECTED_CHANGE 또는 REGRESSION 이 하나라도 있으면 실패다. */
export const buildSummary = (
  meta: Pick<
    Summary,
    'base' | 'baseSha' | 'headSha' | 'headDirty' | 'createdAt'
  >,
  inputs: EntryInput[],
  expectChanged: string[],
  tolerances: Tolerances,
): Summary => {
  const entries = inputs.map((input) =>
    judgeEntry(input, expectChanged.includes(input.route), tolerances),
  );
  const expectedButUnchanged = expectChanged.filter((route) => {
    const own = entries.filter((e) => e.route === route);
    return own.length > 0 && own.every((e) => e.status === 'UNCHANGED');
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    ...meta,
    baseLabel: formatShaLabel(meta.baseSha),
    headLabel: formatShaLabel(meta.headSha, meta.headDirty),
    passed: entries.every(
      (e) => e.status === 'UNCHANGED' || e.status === 'CHANGED',
    ),
    tolerances,
    expectChanged,
    expectedButUnchanged,
    entries,
  };
};

/** 변경 있는 항목을 앞으로, 그 안에서는 diff 비율 큰 순으로 정렬한다. */
export const sortEntries = (entries: Entry[]): Entry[] => {
  const rank: Record<EntryStatus, number> = {
    UNEXPECTED_CHANGE: 0,
    REGRESSION: 0,
    CHANGED: 1,
    UNCHANGED: 2,
  };
  return [...entries].sort(
    (x, y) =>
      rank[x.status] - rank[y.status] ||
      y.diff.ratio - x.diff.ratio ||
      x.route.localeCompare(y.route) ||
      x.viewport.localeCompare(y.viewport) ||
      x.theme.localeCompare(y.theme),
  );
};

export const formatBox = (box: BoundingBox | null): string =>
  box ? `${box.width}×${box.height}@${box.x},${box.y}` : '-';

export const formatCls = (entry: Entry): string =>
  entry.clsDelta === null ? 'n/a' : formatSigned(entry.clsDelta);

const pad = (value: string, width: number) => value.padEnd(width);

/** 터미널용 표. */
export const formatConsoleTable = (summary: Summary): string => {
  const header = [
    'status',
    'route',
    'viewport',
    'theme',
    'diff',
    'bbox',
    'Δheight',
    'Δwidth',
    'overflow',
    'ΔCLS',
  ];
  const rows = sortEntries(summary.entries).map((e) => [
    e.status,
    e.route,
    e.viewport,
    e.theme,
    formatPercent(e.diff.ratio),
    formatBox(e.diff.boundingBox),
    formatSigned(e.heightDelta),
    formatSigned(e.widthDelta),
    e.after.horizontalOverflow ? 'YES' : 'no',
    formatCls(e),
  ]);
  const widths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length)),
  );
  const line = (cells: string[]) =>
    cells.map((c, i) => pad(c, widths[i])).join('  ');

  return [line(header), ...rows.map(line)].join('\n');
};
