import { describe, expect, it } from 'vitest';

import {
  DEFAULT_BASE,
  buildSummary,
  diffImages,
  formatShaLabel,
  formatBox,
  formatConsoleTable,
  judgeEntry,
  layoutDeltas,
  parseCompareArgs,
  parseRouteList,
  parseSitemapPaths,
  remoteOfRef,
  routeToSlug,
  sampleRoutes,
  screenshotName,
  sortEntries,
} from './lib.ts';

import type { DiffStats, EntryInput, LayoutMetrics, RawImage } from './lib.ts';

const layout = (overrides: Partial<LayoutMetrics> = {}): LayoutMetrics => ({
  scrollHeight: 1000,
  scrollWidth: 400,
  clientWidth: 400,
  horizontalOverflow: false,
  cls: 0,
  ...overrides,
});

const noDiff: DiffStats = {
  changedPixels: 0,
  totalPixels: 1000,
  ratio: 0,
  boundingBox: null,
};

const input = (overrides: Partial<EntryInput> = {}): EntryInput => ({
  route: '/',
  viewport: 'desktop',
  theme: 'light',
  before: layout(),
  after: layout(),
  diff: noDiff,
  ...overrides,
});

const tolerances = { diffRatio: 0.0001, cls: 0.001 };
const changedDiff: DiffStats = {
  changedPixels: 100,
  totalPixels: 1000,
  ratio: 0.1,
  boundingBox: { x: 1, y: 2, width: 3, height: 4 },
};

const solid = (width: number, height: number, rgba: number[]): RawImage => ({
  width,
  height,
  data: Uint8Array.from(
    Array.from({ length: width * height }, () => rgba).flat(),
  ),
});

describe('parseSitemapPaths', () => {
  it('중복 없는 pathname 을 정렬해 반환한다', () => {
    const xml =
      '<loc>https://a.dev/</loc><loc>https://a.dev/posts/b/</loc><loc>https://a.dev/posts/a</loc><loc>https://a.dev/posts/a</loc>';
    expect(parseSitemapPaths(xml)).toEqual(['/', '/posts/a', '/posts/b']);
  });
});

describe('sampleRoutes', () => {
  const paths = ['/', '/tags/x', '/tags/y', '/posts/a', '/posts/b', '/posts/c'];

  it('홈, 태그 하나, 글 처음/마지막을 고른다', () => {
    expect(sampleRoutes(paths)).toEqual([
      '/',
      '/tags/x',
      '/posts/a',
      '/posts/c',
    ]);
  });

  it('다른 경로를 노출하고 최대 개수를 지킨다', () => {
    const withOthers = [...paths, '/posts', '/about'];
    expect(sampleRoutes(withOthers)).toEqual([
      '/',
      '/tags/x',
      '/posts/a',
      '/about',
      '/posts/c',
    ]);
    expect(sampleRoutes(withOthers, 2)).toEqual(['/', '/tags/x']);
  });

  it('글이 하나이면 중복 없이 고른다', () => {
    expect(sampleRoutes(['/', '/posts/a'])).toEqual(['/', '/posts/a']);
  });

  it('입력 순서와 무관하게 결정적이다', () => {
    expect(sampleRoutes([...paths].reverse())).toEqual(sampleRoutes(paths));
  });
});

describe('parseRouteList', () => {
  it('슬래시를 보정하고 중복을 제거한다', () => {
    expect(parseRouteList('/, posts/a,/posts/a,,')).toEqual(['/', '/posts/a']);
  });
});

describe('parseCompareArgs', () => {
  it('기본값', () => {
    expect(parseCompareArgs([])).toMatchObject({
      base: 'origin/main',
      routes: null,
      expectChanged: [],
    });
  });

  it('공백/등호 형태 모두 파싱한다', () => {
    const options = parseCompareArgs([
      '--base',
      'dev',
      '--routes=/,/posts/a',
      '--expect-changed',
      '/',
      '--tolerance',
      '0.5',
      '--cls-tolerance=0.1',
      '--pixel-threshold',
      '3',
      '--max-routes',
      '2',
    ]);
    expect(options).toMatchObject({
      base: 'dev',
      routes: ['/', '/posts/a'],
      expectChanged: ['/'],
      diffTolerance: 0.5,
      clsTolerance: 0.1,
      pixelThreshold: 3,
      maxRoutes: 2,
    });
  });

  it('알 수 없는 옵션, 값 누락, 잘못된 숫자는 에러다', () => {
    expect(() => parseCompareArgs(['--nope'])).toThrow('Unknown option');
    expect(() => parseCompareArgs(['--base'])).toThrow('needs a value');
    expect(() => parseCompareArgs(['--tolerance', 'x'])).toThrow(
      'non-negative number',
    );
  });
});

describe('DEFAULT_BASE / remoteOfRef', () => {
  const remotes = ['origin', 'upstream'];

  it('기본 base 는 origin/main 이고 명시한 --base 가 우선한다', () => {
    expect(DEFAULT_BASE).toBe('origin/main');
    expect(parseCompareArgs([]).base).toBe('origin/main');
    expect(parseCompareArgs(['--base', 'main']).base).toBe('main');
    expect(parseCompareArgs(['--base=v1.0.0']).base).toBe('v1.0.0');
  });

  it('원격 추적 ref 는 remote 이름을 돌려준다', () => {
    expect(remoteOfRef('origin/main', remotes)).toBe('origin');
    expect(remoteOfRef('upstream/feat/x', remotes)).toBe('upstream');
    expect(remoteOfRef('refs/remotes/origin/main', remotes)).toBe('origin');
  });

  it('로컬 브랜치, 태그, sha, 모르는 remote 는 null 이다', () => {
    expect(remoteOfRef('main', remotes)).toBeNull();
    expect(remoteOfRef('feat/x', remotes)).toBeNull();
    expect(remoteOfRef('v1.0.0', remotes)).toBeNull();
    expect(remoteOfRef('ddaf74d', remotes)).toBeNull();
    expect(remoteOfRef('fork/main', remotes)).toBeNull();
    expect(remoteOfRef('origin/', remotes)).toBeNull();
    expect(remoteOfRef('origin/main', [])).toBeNull();
  });
});

describe('routeToSlug / screenshotName', () => {
  it('홈과 경로를 파일명으로 바꾼다', () => {
    expect(routeToSlug('/')).toBe('home');
    expect(routeToSlug('/posts/a-b')).toBe('posts-a-b');
    expect(routeToSlug('/tags/%ED%83%9C%EA%B7%B8')).toBe('tags-태그');
    expect(routeToSlug('/tags/%E0%A4%A')).toBe('tags-E0-A4-A');
    expect(screenshotName('/', 'mobile', 'dark')).toBe(
      'home__mobile__dark.png',
    );
  });
});

describe('diffImages', () => {
  it('같은 이미지는 비율 0, 박스 없음', () => {
    const { stats } = diffImages(
      solid(4, 4, [9, 9, 9, 255]),
      solid(4, 4, [9, 9, 9, 255]),
    );
    expect(stats).toEqual({
      changedPixels: 0,
      totalPixels: 16,
      ratio: 0,
      boundingBox: null,
    });
  });

  it('바뀐 픽셀의 수와 경계 상자를 구한다', () => {
    const a = solid(4, 4, [0, 0, 0, 255]);
    const b = solid(4, 4, [0, 0, 0, 255]);
    for (const [x, y] of [
      [1, 1],
      [2, 3],
    ]) {
      b.data[(y * 4 + x) * 4] = 200;
    }
    const { stats, image } = diffImages(a, b);
    expect(stats.changedPixels).toBe(2);
    expect(stats.ratio).toBe(2 / 16);
    expect(stats.boundingBox).toEqual({ x: 1, y: 1, width: 2, height: 3 });
    expect(
      Array.from(image.data.slice((1 * 4 + 1) * 4, (1 * 4 + 1) * 4 + 4)),
    ).toEqual([255, 0, 0, 255]);
  });

  it('픽셀 임계값 이하의 차이는 무시한다', () => {
    const b = solid(2, 2, [1, 1, 1, 255]);
    expect(
      diffImages(solid(2, 2, [0, 0, 0, 255]), b, 1).stats.changedPixels,
    ).toBe(0);
    expect(
      diffImages(solid(2, 2, [0, 0, 0, 255]), b, 0).stats.changedPixels,
    ).toBe(4);
  });

  it('크기가 다르면 겹치지 않는 영역을 모두 변경으로 센다', () => {
    const { stats, image } = diffImages(
      solid(2, 2, [0, 0, 0, 255]),
      solid(2, 4, [0, 0, 0, 255]),
    );
    expect(stats.totalPixels).toBe(8);
    expect(stats.changedPixels).toBe(4);
    expect(stats.boundingBox).toEqual({ x: 0, y: 2, width: 2, height: 2 });
    expect(image.height).toBe(4);
  });

  it('빈 이미지는 0 비율을 반환한다', () => {
    const empty = { data: new Uint8Array(0), width: 0, height: 0 };
    expect(diffImages(empty, empty).stats.ratio).toBe(0);
  });
});

describe('layoutDeltas', () => {
  it('높이/너비/CLS 차이를 계산하고 CLS 가 없으면 null', () => {
    expect(
      layoutDeltas(
        layout({ cls: 0.1 }),
        layout({ scrollHeight: 1012, scrollWidth: 399, cls: 0.35 }),
      ),
    ).toEqual({ heightDelta: 12, widthDelta: -1, clsDelta: 0.25 });
    expect(layoutDeltas(layout({ cls: null }), layout()).clsDelta).toBeNull();
  });
});

describe('judgeEntry', () => {
  it('기대하지 않은 라우트: 변화가 없으면 UNCHANGED', () => {
    expect(judgeEntry(input(), false, tolerances)).toMatchObject({
      status: 'UNCHANGED',
      reasons: [],
    });
  });

  it('허용치 이내의 diff 는 UNCHANGED', () => {
    const diff = { ...noDiff, changedPixels: 0.05, ratio: 0.00005 };
    expect(judgeEntry(input({ diff }), false, tolerances).status).toBe(
      'UNCHANGED',
    );
  });

  it('diff 비율이 허용치를 넘으면 UNEXPECTED_CHANGE', () => {
    const entry = judgeEntry(input({ diff: changedDiff }), false, tolerances);
    expect(entry.status).toBe('UNEXPECTED_CHANGE');
    expect(entry.reasons[0]).toContain('diff ratio');
  });

  it('픽셀이 같아도 레이아웃 변화는 UNEXPECTED_CHANGE', () => {
    const entry = judgeEntry(
      input({
        after: layout({
          scrollHeight: 1001,
          scrollWidth: 450,
          horizontalOverflow: true,
          cls: 0.2,
        }),
      }),
      false,
      tolerances,
    );
    expect(entry.status).toBe('UNEXPECTED_CHANGE');
    expect(entry.reasons).toHaveLength(4);
  });

  it('기대한 라우트: 바뀌어도 CHANGED', () => {
    expect(
      judgeEntry(input({ diff: changedDiff }), true, tolerances).status,
    ).toBe('CHANGED');
    expect(
      judgeEntry(
        input({ after: layout({ scrollHeight: 1100 }) }),
        true,
        tolerances,
      ).status,
    ).toBe('CHANGED');
  });

  it('기대한 라우트에서 바뀐 게 없으면 UNCHANGED', () => {
    expect(judgeEntry(input(), true, tolerances).status).toBe('UNCHANGED');
  });

  it('기대한 라우트가 새 가로 오버플로를 만들면 REGRESSION, 기존 오버플로는 허용', () => {
    const overflow = layout({ horizontalOverflow: true, scrollWidth: 500 });
    expect(
      judgeEntry(
        input({ diff: changedDiff, after: overflow }),
        true,
        tolerances,
      ).status,
    ).toBe('REGRESSION');
    expect(
      judgeEntry(
        input({ diff: changedDiff, before: overflow, after: overflow }),
        true,
        tolerances,
      ).status,
    ).toBe('CHANGED');
  });

  it('기대한 라우트의 CLS 증가는 REGRESSION, 감소는 허용', () => {
    expect(
      judgeEntry(
        input({ diff: changedDiff, after: layout({ cls: 0.05 }) }),
        true,
        tolerances,
      ).status,
    ).toBe('REGRESSION');
    expect(
      judgeEntry(
        input({ diff: changedDiff, before: layout({ cls: 0.05 }) }),
        true,
        tolerances,
      ).status,
    ).toBe('CHANGED');
  });

  it('CLS 증가가 허용치 이내면 기대한 라우트도 CHANGED', () => {
    expect(
      judgeEntry(
        input({ diff: changedDiff, after: layout({ cls: 0.0005 }) }),
        true,
        tolerances,
      ).status,
    ).toBe('CHANGED');
  });

  it('기대하지 않은 라우트의 CLS 증가는 픽셀이 같아도 UNEXPECTED_CHANGE', () => {
    const entry = judgeEntry(
      input({ after: layout({ cls: 0.046664 }) }),
      false,
      tolerances,
    );
    expect(entry.status).toBe('UNEXPECTED_CHANGE');
    expect(entry.clsDelta).toBe(0.046664);
    expect(entry.reasons).toEqual(['CLS changed by 0.046664']);
  });

  it('CLS 를 못 쟀으면 CLS 로 판정하지 않는다', () => {
    expect(
      judgeEntry(input({ after: layout({ cls: null }) }), false, tolerances)
        .status,
    ).toBe('UNCHANGED');
  });
});

describe('formatShaLabel', () => {
  it('깨끗한 트리는 짧은 sha 만, 변경이 있으면 +dirty 를 붙인다', () => {
    const sha = '0123456789abcdef0123456789abcdef01234567';
    expect(formatShaLabel(sha)).toBe('0123456');
    expect(formatShaLabel(sha, false)).toBe('0123456');
    expect(formatShaLabel(sha, true)).toBe('0123456+dirty');
  });

  it('buildSummary 가 base 와 현재 라벨을 따로 만든다', () => {
    const base = {
      base: 'main',
      baseSha: 'a'.repeat(40),
      headSha: 'b'.repeat(40),
      createdAt: 'now',
    };
    const clean = buildSummary({ ...base, headDirty: false }, [], [], {
      diffRatio: 0,
      cls: 0,
    });
    const dirty = buildSummary({ ...base, headDirty: true }, [], [], {
      diffRatio: 0,
      cls: 0,
    });
    expect([clean.baseLabel, clean.headLabel]).toEqual(['aaaaaaa', 'bbbbbbb']);
    expect([dirty.baseLabel, dirty.headLabel]).toEqual([
      'aaaaaaa',
      'bbbbbbb+dirty',
    ]);
  });
});

describe('buildSummary', () => {
  const meta = {
    base: 'main',
    baseSha: 'a'.repeat(40),
    headSha: 'b'.repeat(40),
    headDirty: false,
    createdAt: 'now',
  };

  it('기대 라우트의 변화는 통과, 그 외는 실패', () => {
    const inputs = [
      input({ route: '/', diff: changedDiff }),
      input({ route: '/posts/a' }),
    ];
    expect(buildSummary(meta, inputs, ['/'], tolerances).passed).toBe(true);
    const failing = buildSummary(meta, inputs, [], tolerances);
    expect(failing.passed).toBe(false);
    expect(failing.entries[0].status).toBe('UNEXPECTED_CHANGE');
  });

  describe('--expect-changed 라우트', () => {
    const entry = (
      route: string,
      viewport: 'desktop' | 'mobile',
      changed: boolean,
    ) => input({ route, viewport, ...(changed ? { diff: changedDiff } : {}) });

    it('전부 그대로면 EXPECTED_CHANGE_MISSING 으로 실패한다', () => {
      const summary = buildSummary(
        meta,
        [entry('/', 'desktop', false), entry('/', 'mobile', false)],
        ['/'],
        tolerances,
      );
      expect(summary.expectedButUnchanged).toEqual(['/']);
      expect(summary.passed).toBe(false);
      expect(summary.entries.map((e) => e.status)).toEqual([
        'EXPECTED_CHANGE_MISSING',
        'EXPECTED_CHANGE_MISSING',
      ]);
      expect(summary.entries[0].reasons[0]).toContain('expected a change');
    });

    it('일부 viewport/theme 만 바뀌어도 바뀐 것으로 본다', () => {
      const summary = buildSummary(
        meta,
        [entry('/', 'desktop', true), entry('/', 'mobile', false)],
        ['/'],
        tolerances,
      );
      expect(summary.expectedButUnchanged).toEqual([]);
      expect(summary.passed).toBe(true);
      expect(summary.entries.map((e) => e.status)).toEqual([
        'CHANGED',
        'UNCHANGED',
      ]);
    });

    it('전부 바뀌면 통과한다', () => {
      const summary = buildSummary(
        meta,
        [entry('/', 'desktop', true), entry('/', 'mobile', true)],
        ['/'],
        tolerances,
      );
      expect(summary.expectedButUnchanged).toEqual([]);
      expect(summary.passed).toBe(true);
    });

    it('레이아웃만 바뀌어도(diff 0) 바뀐 것으로 본다', () => {
      const summary = buildSummary(
        meta,
        [input({ after: layout({ scrollHeight: 1100 }) })],
        ['/'],
        tolerances,
      );
      expect(summary.entries[0].status).toBe('CHANGED');
      expect(summary.passed).toBe(true);
    });

    it('목록에 없는 라우트는 계속 그대로여야 한다', () => {
      const summary = buildSummary(
        meta,
        [entry('/', 'desktop', true), entry('/x', 'desktop', true)],
        ['/'],
        tolerances,
      );
      expect(summary.passed).toBe(false);
      expect(summary.entries.map((e) => e.status)).toEqual([
        'CHANGED',
        'UNEXPECTED_CHANGE',
      ]);
    });

    it('캡처되지 않은 라우트는 표시하지 않는다', () => {
      const summary = buildSummary(
        meta,
        [entry('/', 'desktop', true)],
        ['/', '/missing'],
        tolerances,
      );
      expect(summary.expectedButUnchanged).toEqual([]);
      expect(summary.passed).toBe(true);
    });

    it('다른 상태와 섞여도 각자 판정한다', () => {
      const summary = buildSummary(
        meta,
        [
          entry('/same', 'desktop', false),
          entry('/same', 'mobile', false),
          entry('/partial', 'desktop', true),
          entry('/partial', 'mobile', false),
          input({
            route: '/regress',
            diff: changedDiff,
            after: layout({ horizontalOverflow: true }),
          }),
          entry('/other', 'desktop', true),
          entry('/stable', 'desktop', false),
        ],
        ['/same', '/partial', '/regress'],
        tolerances,
      );
      expect(summary.expectedButUnchanged).toEqual(['/same']);
      expect(summary.passed).toBe(false);
      expect(summary.entries.map((e) => [e.route, e.status])).toEqual([
        ['/same', 'EXPECTED_CHANGE_MISSING'],
        ['/same', 'EXPECTED_CHANGE_MISSING'],
        ['/partial', 'CHANGED'],
        ['/partial', 'UNCHANGED'],
        ['/regress', 'REGRESSION'],
        ['/other', 'UNEXPECTED_CHANGE'],
        ['/stable', 'UNCHANGED'],
      ]);
    });

    it('missing 만으로도 다른 항목이 모두 정상이면 실패한다', () => {
      const summary = buildSummary(
        meta,
        [entry('/same', 'desktop', false), entry('/stable', 'desktop', false)],
        ['/same'],
        tolerances,
      );
      expect(summary.passed).toBe(false);
    });
  });

  it('REGRESSION 은 실패다', () => {
    const summary = buildSummary(
      meta,
      [
        input({
          diff: changedDiff,
          after: layout({ horizontalOverflow: true }),
        }),
      ],
      ['/'],
      tolerances,
    );
    expect(summary.passed).toBe(false);
  });
});

describe('sortEntries / formatConsoleTable', () => {
  it('실패, 변경, 무변경 순으로 정렬하고 표를 만든다', () => {
    const summary = buildSummary(
      {
        base: 'main',
        baseSha: 'a',
        headSha: 'b',
        headDirty: false,
        createdAt: 'now',
      },
      [
        input({ route: '/c' }),
        input({ route: '/b', diff: changedDiff }),
        input({ route: '/a', diff: { ...changedDiff, ratio: 0.5 } }),
      ],
      ['/b'],
      tolerances,
    );
    expect(sortEntries(summary.entries).map((e) => e.route)).toEqual([
      '/a',
      '/b',
      '/c',
    ]);
    const table = formatConsoleTable(summary);
    expect(table.split('\n')[0]).toContain('status');
    expect(table).toContain('UNEXPECTED_CHANGE');
    expect(table).toContain('3×4@1,2');
  });

  it('EXPECTED_CHANGE_MISSING 은 맨 앞에 정렬된다', () => {
    const summary = buildSummary(
      {
        base: 'main',
        baseSha: 'a',
        headSha: 'b',
        headDirty: false,
        createdAt: 'now',
      },
      [input({ route: '/b', diff: changedDiff }), input({ route: '/a' })],
      ['/a', '/b'],
      tolerances,
    );
    expect(sortEntries(summary.entries).map((e) => e.status)).toEqual([
      'EXPECTED_CHANGE_MISSING',
      'CHANGED',
    ]);
    expect(formatConsoleTable(summary)).toContain('EXPECTED_CHANGE_MISSING');
  });

  it('formatBox 는 상자가 없으면 -', () => {
    expect(formatBox(null)).toBe('-');
  });
});
