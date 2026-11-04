import { describe, expect, it } from 'vitest';

import { buildSummary } from './lib.ts';
import {
  buildPublishPlan,
  extractImagePaths,
  isNothingToPublish,
  parseGitHubRemote,
  rawUrl,
  renderMarkdown,
  rewriteImageLinks,
} from './markdown.ts';

import type { EntryInput, LayoutMetrics } from './lib.ts';

const layout = (overrides: Partial<LayoutMetrics> = {}): LayoutMetrics => ({
  scrollHeight: 1000,
  scrollWidth: 400,
  clientWidth: 400,
  horizontalOverflow: false,
  cls: 0,
  ...overrides,
});

const entry = (route: string, ratio: number): EntryInput => ({
  route,
  viewport: 'desktop',
  theme: 'light',
  before: layout(),
  after: layout(),
  diff: {
    changedPixels: ratio * 100,
    totalPixels: 100,
    ratio,
    boundingBox: ratio ? { x: 0, y: 0, width: 5, height: 5 } : null,
  },
});

const meta = {
  base: 'main',
  baseSha: 'a'.repeat(40),
  headSha: 'b'.repeat(40),
  createdAt: 'now',
};
const tolerances = { diffRatio: 0.0001, cls: 0.001 };
const repo = { owner: 'KimBiYam', repo: 'log' };

describe('renderMarkdown', () => {
  const markdown = renderMarkdown(
    buildSummary(
      meta,
      [entry('/', 0), entry('/posts/a', 0.2), entry('/tags/x', 0.1)],
      ['/posts/a'],
      tolerances,
    ),
  );

  it('판정을 맨 위에, 변경된 항목을 먼저, 무변경은 접어서 보여준다', () => {
    expect(markdown.startsWith('## Visual comparison: ❌ FAIL')).toBe(true);
    expect(markdown.indexOf('`/posts/a`')).toBeLessThan(
      markdown.indexOf('`/tags/x`'),
    );
    expect(markdown).toContain('1 unchanged (zero diff)');
    expect(markdown).toContain('🔶 CHANGED');
    expect(markdown).toContain('**Needs attention**');
    expect(markdown).toContain('20.0000%');
  });

  it('변경된 항목의 이미지만 상대 경로로 참조한다', () => {
    expect(extractImagePaths(markdown)).toEqual([
      'before/tags-x__desktop__light.png',
      'after/tags-x__desktop__light.png',
      'diff/tags-x__desktop__light.png',
      'before/posts-a__desktop__light.png',
      'after/posts-a__desktop__light.png',
      'diff/posts-a__desktop__light.png',
    ]);
  });

  it('변경이 없으면 PASS 이고 스크린샷 절이 없다', () => {
    const clean = renderMarkdown(
      buildSummary(meta, [entry('/', 0)], [], tolerances),
    );
    expect(clean).toContain('✅ PASS');
    expect(clean).toContain('Expected to change: nothing');
    expect(clean).not.toContain('### Screenshots');
  });

  it('기대했지만 변화 없는 라우트를 경고한다', () => {
    const md = renderMarkdown(
      buildSummary(meta, [entry('/', 0)], ['/'], tolerances),
    );
    expect(md).toContain('Expected to change but nothing differed');
  });
});

describe('parseGitHubRemote', () => {
  it.each([
    ['https://github.com/KimBiYam/log.git', repo],
    ['https://github.com/KimBiYam/log', repo],
    ['git@github.com:KimBiYam/log.git', repo],
    ['https://x-access-token:t@github.com/KimBiYam/log.git\n', repo],
  ])('%s', (url, expected) => {
    expect(parseGitHubRemote(url)).toEqual(expected);
  });

  it('GitHub 가 아니면 null', () => {
    expect(parseGitHubRemote('git@gitlab.com:a/b.git')).toBeNull();
  });
});

describe('rawUrl / rewriteImageLinks / buildPublishPlan', () => {
  it('raw URL 은 브랜치와 실행 디렉터리를 포함하고 경로를 인코딩한다', () => {
    expect(
      rawUrl(
        repo,
        '2026-01-01T00-00-00-000Z',
        'diff/tags-태그__mobile__dark.png',
      ),
    ).toBe(
      'https://raw.githubusercontent.com/KimBiYam/log/visual-artifacts/runs/2026-01-01T00-00-00-000Z/diff/tags-%ED%83%9C%EA%B7%B8__mobile__dark.png',
    );
  });

  it('상대 이미지 경로만 raw URL 로 바꾼다', () => {
    const md =
      '<img src="before/a.png" width="240"> <img src="https://x/y.png"> `before/b.png`';
    expect(rewriteImageLinks(md, repo, 'run1')).toBe(
      '<img src="https://raw.githubusercontent.com/KimBiYam/log/visual-artifacts/runs/run1/before/a.png" width="240"> <img src="https://x/y.png"> `before/b.png`',
    );
  });

  it('계획은 업로드 대상과 재작성된 마크다운을 함께 담는다', () => {
    const md = renderMarkdown(
      buildSummary(meta, [entry('/', 0.3)], ['/'], tolerances),
    );
    const plan = buildPublishPlan(md, repo, 'run1');
    expect(plan.branch).toBe('visual-artifacts');
    expect(plan.targetDir).toBe('runs/run1');
    expect(plan.files).toHaveLength(3);
    expect(plan.files[0]).toEqual({
      source: 'before/home__desktop__light.png',
      target: 'runs/run1/before/home__desktop__light.png',
      url: 'https://raw.githubusercontent.com/KimBiYam/log/visual-artifacts/runs/run1/before/home__desktop__light.png',
    });
    expect(plan.markdown).not.toMatch(/<img src="(before|after|diff)\//);
    expect(plan.markdown).toContain('raw.githubusercontent.com');
  });
});

describe('isNothingToPublish', () => {
  it('이미지를 참조하지 않는 마크다운은 퍼블리시할 것이 없다', () => {
    expect(isNothingToPublish('# visual compare\n\nno diffs\n')).toBe(true);
    expect(
      isNothingToPublish('<img src="https://x/y.png"> `before/b.png`'),
    ).toBe(true);
  });

  it('상대 이미지가 하나라도 있으면 퍼블리시 대상이다', () => {
    expect(isNothingToPublish('<img src="diff/a.png" width="240">')).toBe(
      false,
    );
  });

  it('변화 없는 실행의 렌더 결과는 퍼블리시할 것이 없다', () => {
    const md = renderMarkdown(
      buildSummary(meta, [entry('/', 0)], [], tolerances),
    );
    expect(isNothingToPublish(md)).toBe(true);
  });
});
