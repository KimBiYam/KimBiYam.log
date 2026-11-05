import { describe, expect, it } from 'vitest';

import {
  BUILD_MARKER_FILE,
  SCHEMA_VERSION,
  checkBuildMarker,
  createBuildMarker,
  classifyDelta,
  compareMetrics,
  extractScriptSrcs,
  formatDiffTable,
  getTolerance,
  isPerfBaseline,
  parseSitemapPaths,
  ratchetBaseline,
  routeToHtmlPath,
} from './lib.ts';

describe('parseSitemapPaths', () => {
  it('pathname 만 뽑아 중복을 제거하고 정렬한다', () => {
    const xml = `<urlset>
<url><loc>https://example.com</loc></url>
<url><loc>https://example.com/tags/b</loc></url>
<url><loc> https://example.com/tags/a/ </loc></url>
<url><loc>https://example.com/tags/b</loc></url>
</urlset>`;

    expect(parseSitemapPaths(xml)).toEqual(['/', '/tags/a', '/tags/b']);
  });

  it('loc 이 없으면 빈 배열이다', () => {
    expect(parseSitemapPaths('<urlset/>')).toEqual([]);
  });
});

describe('routeToHtmlPath', () => {
  it('루트는 index.html 이다', () => {
    expect(routeToHtmlPath('/')).toBe('index.html');
  });

  it('하위 경로는 .html 을 붙이고 디코딩한다', () => {
    expect(routeToHtmlPath('/posts/a/b')).toBe('posts/a/b.html');
    expect(routeToHtmlPath('/tags/%ED%83%9C%EA%B7%B8')).toBe('tags/태그.html');
  });
});

describe('extractScriptSrcs', () => {
  it('정적 청크 script 만 쿼리 제거·디코딩·중복 제거해 반환한다', () => {
    const html = [
      '<script src="/_next/static/chunks/b.js?dpl=1" async=""></script>',
      '<script src="/_next/static/chunks/a.js" noModule=""></script>',
      '<script src="/_next/static/chunks/b.js" async=""></script>',
      '<script src="/_next/static/chunks/app/%5Bid%5D/page.js"></script>',
      '<script src="https://cdn.example.com/x.js"></script>',
      '<script>self.__next_f.push([1,"/_next/static/chunks/lazy.js"])</script>',
    ].join('');

    expect(extractScriptSrcs(html)).toEqual([
      '/_next/static/chunks/a.js',
      '/_next/static/chunks/app/[id]/page.js',
      '/_next/static/chunks/b.js',
    ]);
  });
});

describe('getTolerance', () => {
  it('작은 값은 최소 바이트, 큰 값은 비율을 쓴다', () => {
    expect(getTolerance(1000)).toBe(256);
    expect(getTolerance(100_000)).toBe(1000);
  });
});

describe('classifyDelta', () => {
  it.each([
    [4, 'regressed'],
    [3, 'within-tolerance'],
    [1, 'within-tolerance'],
    [0, 'unchanged'],
    [-1, 'within-tolerance'],
    [-3, 'within-tolerance'],
    [-4, 'improved'],
  ] as const)('tolerance 3: delta %i → %s', (delta, status) => {
    expect(classifyDelta(delta, 3)).toBe(status);
  });
});

describe('compareMetrics', () => {
  const baseline = { '/': 100_000, '/a': 100_000, '/b': 100_000, '/gone': 5 };

  it('허용 오차 이내 증가·동일·감소는 통과하고 상태를 구분한다', () => {
    const result = compareMetrics(baseline, {
      '/': 100_000,
      '/a': 100_900,
      '/b': 90_000,
      '/gone': 5,
    });

    expect(result.passed).toBe(true);
    expect(result.rows.map((r) => [r.route, r.status, r.delta])).toEqual([
      ['/', 'unchanged', 0],
      ['/a', 'within-tolerance', 900],
      ['/b', 'improved', -10_000],
      ['/gone', 'unchanged', 0],
    ]);
  });

  it('허용 오차를 넘어 증가하면 실패한다', () => {
    const result = compareMetrics(baseline, { ...baseline, '/a': 101_001 });

    expect(result.passed).toBe(false);
    expect(result.rows.find((r) => r.route === '/a')?.status).toBe('regressed');
  });

  it('새 경로와 사라진 경로는 게이트하지 않는다', () => {
    const result = compareMetrics({ '/old': 10 }, { '/new': 999_999 });

    expect(result.passed).toBe(true);
    expect(result.rows).toEqual([
      {
        route: '/new',
        baseline: null,
        current: 999_999,
        delta: null,
        status: 'new',
      },
      {
        route: '/old',
        baseline: 10,
        current: null,
        delta: null,
        status: 'removed',
      },
    ]);
  });
});

describe('ratchetBaseline', () => {
  it('낮아진 값만 반영하고 악화는 기준을 유지한다', () => {
    expect(
      ratchetBaseline(
        { '/a': 100, '/b': 100, '/gone': 1 },
        { '/a': 80, '/b': 120, '/new': 50 },
      ),
    ).toEqual({ '/a': 80, '/b': 100, '/new': 50 });
  });
});

describe('formatDiffTable', () => {
  it('변화가 없으면 요약만 출력한다', () => {
    const out = formatDiffTable(compareMetrics({ '/': 1 }, { '/': 1 }));

    expect(out).toBe(
      '1 routes: 0 regressed, 0 improved (beyond tolerance), 0 within tolerance, 0 new, 0 removed, 1 unchanged',
    );
  });

  it('변화가 있는 행을 표로 출력한다', () => {
    const out = formatDiffTable(
      compareMetrics({ '/a': 100_000 }, { '/a': 110_000, '/b': 5 }),
    );

    expect(out).toContain('route');
    expect(out).toMatch(/\/a\s+100000\s+110000\s+\+10000\s+regressed/);
    expect(out).toMatch(/\/b\s+-\s+5\s+-\s+new/);
    expect(out).toContain('1 regressed');
    expect(out).not.toContain('perf:update');
  });

  it('오차 안의 감소는 within-tolerance 로 표시하고 ratchet 을 권하지 않는다', () => {
    // 100_000 의 허용 오차는 1000B: -900B 는 개선으로 치지 않는다.
    const out = formatDiffTable(
      compareMetrics({ '/a': 100_000 }, { '/a': 99_100 }),
    );

    expect(out).toMatch(/\/a\s+100000\s+99100\s+-900\s+within-tolerance/);
    expect(out).toContain('1 within tolerance');
    expect(out).toContain('0 improved');
    expect(out).not.toContain('perf:update');
  });

  it('오차를 넘는 감소만 improved 로 표시하고 perf:update 를 권한다', () => {
    const out = formatDiffTable(
      compareMetrics({ '/a': 100_000 }, { '/a': 98_999 }),
    );

    expect(out).toMatch(/\/a\s+100000\s+98999\s+-1001\s+improved/);
    expect(out).toContain('1 improved (beyond tolerance)');
    expect(out).toContain('pnpm perf:update');
  });
});

describe('isPerfBaseline', () => {
  it('올바른 모양만 통과시킨다', () => {
    const valid = { schemaVersion: SCHEMA_VERSION };

    expect(isPerfBaseline({ ...valid, firstLoadJsGzipBytes: { '/': 1 } })).toBe(
      true,
    );
    expect(isPerfBaseline({ schemaVersion: 0, firstLoadJsGzipBytes: {} })).toBe(
      false,
    );
    expect(
      isPerfBaseline({ ...valid, firstLoadJsGzipBytes: { '/': 'x' } }),
    ).toBe(false);
    expect(isPerfBaseline({ ...valid, firstLoadJsGzipBytes: null })).toBe(
      false,
    );
    expect(isPerfBaseline(null)).toBe(false);
  });
});

describe('build marker', () => {
  const perfEnv = {
    NEXT_PUBLIC_SENTRY_DISABLED: 'true',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: '',
  };
  const expected = createBuildMarker(perfEnv, 'abc123');

  it('환경과 HEAD 에서 표식을 만든다', () => {
    expect(expected).toEqual({
      schemaVersion: SCHEMA_VERSION,
      sentryDisabled: 'true',
      gaIdEmpty: true,
      analyze: false,
      headSha: 'abc123',
    });
  });

  it('ANALYZE 와 GA id 를 불리언으로 정규화한다', () => {
    const marker = createBuildMarker(
      { ANALYZE: 'true', NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: 'G-1' },
      null,
    );
    expect(marker).toMatchObject({
      analyze: true,
      gaIdEmpty: false,
      sentryDisabled: null,
      headSha: null,
    });
    expect(createBuildMarker({ ANALYZE: 'false' }, null).analyze).toBe(false);
  });

  it('같은 표식이면 통과한다', () => {
    expect(checkBuildMarker({ ...expected }, expected)).toEqual([]);
  });

  it('표식이 없으면 거부한다', () => {
    expect(checkBuildMarker(undefined, expected)[0]).toContain(
      `${BUILD_MARKER_FILE} is missing`,
    );
  });

  it('형식이 깨졌거나 스키마가 다르면 거부한다', () => {
    expect(checkBuildMarker({ foo: 1 }, expected)[0]).toContain('malformed');
    expect(
      checkBuildMarker({ ...expected, schemaVersion: 999 }, expected),
    ).toHaveLength(1);
  });

  it.each([
    ['sentryDisabled', { sentryDisabled: null }, 'NEXT_PUBLIC_SENTRY_DISABLED'],
    ['gaIdEmpty', { gaIdEmpty: false }, 'GA tracking id'],
    ['analyze', { analyze: true }, 'ANALYZE'],
    ['headSha', { headSha: 'other' }, 'git HEAD'],
  ])('%s 가 다르면 해당 사유를 반환한다', (_, override, label) => {
    const problems = checkBuildMarker({ ...expected, ...override }, expected);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain(label);
  });

  it('여러 항목이 다르면 모두 보고한다', () => {
    expect(
      checkBuildMarker({ ...expected, analyze: true, headSha: 'x' }, expected),
    ).toHaveLength(2);
  });
});
