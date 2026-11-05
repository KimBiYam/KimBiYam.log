import {
  formatBox,
  formatCls,
  formatPercent,
  formatSigned,
  screenshotName,
  sortEntries,
} from './lib.ts';

import type { Entry, Summary } from './lib.ts';

export const PUBLISH_BRANCH = 'visual-artifacts';

const STATUS_ICON: Record<Entry['status'], string> = {
  UNEXPECTED_CHANGE: '❌',
  REGRESSION: '❌',
  EXPECTED_CHANGE_MISSING: '❌',
  CHANGED: '🔶',
  UNCHANGED: '✅',
};

const imagePath = (
  dir: 'before' | 'after' | 'diff',
  entry: Pick<Entry, 'route' | 'viewport' | 'theme'>,
) => `${dir}/${screenshotName(entry.route, entry.viewport, entry.theme)}`;

const row = (cells: string[]) => `| ${cells.join(' | ')} |`;

const TABLE_HEADER = [
  row([
    'Status',
    'Route',
    'Viewport',
    'Theme',
    'Diff',
    'Changed box',
    'Δheight',
    'Δwidth',
    'Overflow',
    'ΔCLS',
  ]),
  row(Array(10).fill('---')),
];

const tableRow = (e: Entry) =>
  row([
    `${STATUS_ICON[e.status]} ${e.status}`,
    `\`${e.route}\``,
    e.viewport,
    e.theme,
    formatPercent(e.diff.ratio),
    formatBox(e.diff.boundingBox),
    `${formatSigned(e.heightDelta)}px`,
    `${formatSigned(e.widthDelta)}px`,
    e.after.horizontalOverflow ? 'YES' : 'no',
    formatCls(e),
  ]);

const imageRow = (e: Entry) =>
  [
    `<details><summary><code>${e.route}</code> · ${e.viewport} · ${e.theme}${e.reasons.length ? ` — ${e.reasons.join('; ')}` : ''}</summary>`,
    '',
    '| before | after | diff |',
    '| --- | --- | --- |',
    row(
      (['before', 'after', 'diff'] as const).map(
        (dir) => `<img src="${imagePath(dir, e)}" width="240">`,
      ),
    ),
    '',
    '</details>',
  ].join('\n');

/**
 * PR 코멘트용 마크다운. 판정 표를 맨 위에, 변경된 항목을 먼저, 변경 없는 항목은 한 줄로 모은다.
 * 이미지 경로는 출력 디렉터리 기준 상대 경로이며 `visual:publish` 가 raw URL 로 바꾼다.
 */
export const renderMarkdown = (summary: Summary): string => {
  const sorted = sortEntries(summary.entries);
  const failing = sorted.filter(
    (e) => e.status === 'UNEXPECTED_CHANGE' || e.status === 'REGRESSION',
  );
  const changed = sorted.filter((e) => e.status !== 'UNCHANGED');
  const unchanged = sorted.filter((e) => e.status === 'UNCHANGED');
  const { tolerances } = summary;

  const lines = [
    `## Visual comparison: ${summary.passed ? '✅ PASS' : '❌ FAIL'}`,
    '',
    `\`${summary.base}\` (${summary.baseLabel}) → current (${summary.headLabel}) · same machine, ` +
      `diff tolerance ${formatPercent(tolerances.diffRatio)}, CLS tolerance ${tolerances.cls}`,
    summary.expectChanged.length > 0
      ? `Expected to change: ${summary.expectChanged.map((r) => `\`${r}\``).join(', ')}`
      : 'Expected to change: nothing',
    '',
  ];

  if (changed.length > 0) {
    lines.push(...TABLE_HEADER, ...changed.map(tableRow), '');
  }

  if (unchanged.length > 0) {
    lines.push(
      `<details><summary>${unchanged.length} unchanged (zero diff)</summary>`,
      '',
      ...unchanged.map(
        (e) =>
          `- ✅ \`${e.route}\` · ${e.viewport} · ${e.theme} — ${formatPercent(e.diff.ratio)}`,
      ),
      '',
      '</details>',
      '',
    );
  }

  if (summary.expectedButUnchanged.length > 0) {
    lines.push(
      `❌ EXPECTED_CHANGE_MISSING: expected to change but nothing differed: ${summary.expectedButUnchanged.map((r) => `\`${r}\``).join(', ')}`,
      '',
    );
  }

  if (failing.length > 0) {
    lines.push(
      '**Needs attention** — fix or revert, or list the route in `--expect-changed` if intended:',
      ...failing.map(
        (e) =>
          `- \`${e.route}\` · ${e.viewport} · ${e.theme}: ${e.reasons.join('; ')}`,
      ),
      '',
    );
  }

  if (changed.length > 0) {
    lines.push('### Screenshots', '', ...changed.map(imageRow), '');
  }

  lines.push(
    'CLS is read from a `layout-shift` PerformanceObserver on both sides; `n/a` means it could not be measured.',
    '',
    'Humans make the final call on user-visible tradeoffs.',
  );

  return `${lines.join('\n')}\n`;
};

/** 마크다운이 참조하는 상대 이미지 경로(`before/…png` 등)를 중복 없이 뽑는다. */
export const extractImagePaths = (markdown: string): string[] => [
  ...new Set(
    [...markdown.matchAll(/<img src="((?:before|after|diff)\/[^"]+)"/g)].map(
      ([, src]) => src,
    ),
  ),
];

/** 올릴 이미지가 하나도 없으면(변화 없음) 퍼블리시할 것이 없다. */
export const isNothingToPublish = (markdown: string): boolean =>
  extractImagePaths(markdown).length === 0;

export interface RepoRef {
  owner: string;
  repo: string;
}

/** git remote URL(https/ssh)에서 owner/repo 를 뽑는다. GitHub 가 아니면 null. */
export const parseGitHubRemote = (url: string): RepoRef | null => {
  const match = url
    .trim()
    .match(/github\.com[:/]([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

/** 퍼블리시 브랜치 안에서 이번 실행이 놓일 디렉터리. */
export const publishDirFor = (runId: string): string => `runs/${runId}`;

export const rawUrl = (
  { owner, repo }: RepoRef,
  runId: string,
  relativePath: string,
  branch = PUBLISH_BRANCH,
): string =>
  `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${publishDirFor(runId)}/${relativePath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

/** 마크다운의 상대 이미지 경로를 raw GitHub URL 로 바꾼다. */
export const rewriteImageLinks = (
  markdown: string,
  repo: RepoRef,
  runId: string,
): string =>
  markdown.replace(
    /<img src="((?:before|after|diff)\/[^"]+)"/g,
    (_, src: string) => `<img src="${rawUrl(repo, runId, src)}"`,
  );

export interface PublishPlan {
  branch: string;
  /** 퍼블리시 브랜치 안의 디렉터리. */
  targetDir: string;
  /** 출력 디렉터리 기준 상대 경로 → 브랜치 내 경로 + raw URL. */
  files: { source: string; target: string; url: string }[];
  markdown: string;
}

/** 어떤 파일을 어디에 올리고 마크다운을 어떻게 바꿀지 계산한다(부수효과 없음). */
export const buildPublishPlan = (
  markdown: string,
  repo: RepoRef,
  runId: string,
): PublishPlan => ({
  branch: PUBLISH_BRANCH,
  targetDir: publishDirFor(runId),
  files: extractImagePaths(markdown).map((source) => ({
    source,
    target: `${publishDirFor(runId)}/${source}`,
    url: rawUrl(repo, runId, source),
  })),
  markdown: rewriteImageLinks(markdown, repo, runId),
});
