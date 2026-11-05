import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  buildPublishPlan,
  PUBLISH_BRANCH,
  isNothingToPublish,
  parseGitHubRemote,
} from './markdown.ts';
import { BLOCK_START, MAX_BODY_LENGTH, fitBlock } from './prBody.ts';

import type { RepoRef } from './markdown.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUTPUT_ROOT = path.join(ROOT, '.visual');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const readFlag = (flag: string) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const remote = readFlag('--remote') ?? 'origin';
const prBodyFlag = readFlag('--pr-body');
const positional = args.filter(
  (arg, i) =>
    !arg.startsWith('--') &&
    args[i - 1] !== '--remote' &&
    args[i - 1] !== '--repo' &&
    args[i - 1] !== '--pr-body',
);

const git = (cwd: string, gitArgs: string[]) =>
  execFileSync('git', gitArgs, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();

const latestRunDir = (): string => {
  if (!existsSync(OUTPUT_ROOT)) {
    throw new Error('.visual/ not found. Run `pnpm visual:compare` first.');
  }
  const runs = readdirSync(OUTPUT_ROOT).sort();
  const latest = runs.at(-1);
  if (!latest) throw new Error('.visual/ is empty. Run `pnpm visual:compare`.');
  return path.join(OUTPUT_ROOT, latest);
};

const resolveRepo = (): RepoRef & { url: string } => {
  const override = readFlag('--repo');
  if (override) {
    const [owner, repo] = override.split('/');
    return { owner, repo, url: `https://github.com/${owner}/${repo}.git` };
  }
  const url = git(ROOT, ['remote', 'get-url', remote]);
  const parsed = parseGitHubRemote(url);
  if (!parsed)
    throw new Error(`remote "${remote}" is not a GitHub URL: ${url}`);
  return { ...parsed, url };
};

const gh = (ghArgs: string[]) =>
  execFileSync('gh', ghArgs, { encoding: 'utf8', stdio: 'pipe' });

const readPrBody = (repo: RepoRef, pr: string): string => {
  const out = gh([
    'pr',
    'view',
    pr,
    '--repo',
    `${repo.owner}/${repo.repo}`,
    '--json',
    'body',
  ]);
  return (JSON.parse(out) as { body: string }).body;
};

/** 현재 본문과 새 본문의 diff 를 git 으로 보여준다(수정 없음). */
const printBodyDiff = (before: string, after: string) => {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'visual-body-'));
  try {
    writeFileSync(path.join(temp, 'before.md'), before);
    writeFileSync(path.join(temp, 'after.md'), after);
    let diff = '';
    try {
      diff = execFileSync(
        'git',
        ['diff', '--no-index', '--no-color', 'before.md', 'after.md'],
        { cwd: temp, encoding: 'utf8', stdio: 'pipe' },
      );
    } catch (error) {
      // git diff --no-index 는 차이가 있으면 종료 코드 1 을 돌려준다.
      diff = (error as { stdout?: string }).stdout ?? '';
    }
    const lines = diff.split('\n');
    console.log(
      lines.length > 80
        ? `${lines.slice(0, 80).join('\n')}\n... (${lines.length - 80} more diff lines)`
        : diff || '(no change)',
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
};

const pushImages = (
  repo: RepoRef & { url: string },
  runDir: string,
  runId: string,
  files: { source: string; target: string }[],
) => {
  // 사용자의 체크아웃과 무관한 임시 저장소에서 커밋/푸시한다.
  const temp = mkdtempSync(path.join(os.tmpdir(), 'visual-publish-'));
  try {
    git(temp, ['init', '-q']);
    git(temp, ['remote', 'add', 'origin', repo.url]);
    const exists =
      git(temp, ['ls-remote', '--heads', 'origin', PUBLISH_BRANCH]) !== '';
    if (exists) {
      git(temp, ['fetch', '-q', '--depth=1', 'origin', PUBLISH_BRANCH]);
      git(temp, ['checkout', '-q', '-b', PUBLISH_BRANCH, 'FETCH_HEAD']);
    } else {
      git(temp, ['checkout', '-q', '--orphan', PUBLISH_BRANCH]);
    }
    for (const file of files) {
      const target = path.join(temp, file.target);
      mkdirSync(path.dirname(target), { recursive: true });
      cpSync(path.join(runDir, file.source), target);
    }
    git(temp, ['add', '-A']);
    git(temp, [
      'commit',
      '-q',
      '-m',
      `chore(visual): add artifacts for ${runId}`,
    ]);
    // 강제 푸시 없이 fast-forward 만 허용한다.
    git(temp, ['push', '-q', 'origin', `HEAD:refs/heads/${PUBLISH_BRANCH}`]);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
};

const updatePrBody = (repo: RepoRef, pr: string, body: string) => {
  const temp = mkdtempSync(path.join(os.tmpdir(), 'visual-body-'));
  try {
    const file = path.join(temp, 'body.md');
    writeFileSync(file, body);
    gh([
      'pr',
      'edit',
      pr,
      '--repo',
      `${repo.owner}/${repo.repo}`,
      '--body-file',
      file,
    ]);
    console.log(`updated PR #${pr} description (${body.length} characters)`);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
};

const main = () => {
  if (prBodyFlag !== undefined && !/^\d+$/.test(prBodyFlag)) {
    throw new Error(`--pr-body needs a PR number, got "${prBodyFlag}"`);
  }
  const runDir = path.resolve(positional[0] ?? latestRunDir());
  const runId = path.basename(runDir);
  const markdown = readFileSync(path.join(runDir, 'comment.md'), 'utf8');
  const publishedPath = path.join(runDir, 'comment.published.md');

  // 이미지가 없으면 git/원격을 건드리지 않고 마크다운을 그대로 내보낸다.
  const nothing = isNothingToPublish(markdown);
  const prefix = dryRun ? '[dry-run] ' : '';
  if (nothing) {
    console.log(`${prefix}nothing to publish: comment.md references 0 images`);
  }

  // --pr-body 는 PR 본문을 읽어야 하므로 저장소가 필요하다. 이미지가 없고 본문도 안 쓰면 원격 불필요.
  const repo = nothing && prBodyFlag === undefined ? null : resolveRepo();
  const plan =
    repo && !nothing ? buildPublishPlan(markdown, repo, runId) : null;

  let outputMarkdown = plan?.markdown ?? markdown;
  let files = plan?.files ?? [];
  let nextBody: string | null = null;

  if (repo && prBodyFlag !== undefined) {
    const existing = readPrBody(repo, prBodyFlag);
    const fit = fitBlock(outputMarkdown, existing);
    nextBody = fit.body;
    outputMarkdown = fit.markdown;
    // 크기 때문에 빠진 스크린샷은 올리지 않는다.
    files = files.filter((file) => fit.markdown.includes(file.url));
    const action = existing.includes(BLOCK_START) ? 'replace' : 'append';
    console.log(
      `${prefix}PR #${prBodyFlag} body: ${action} visual block; ${existing.length} -> ${fit.body.length} of ${MAX_BODY_LENGTH} characters`,
    );
    if (fit.degradation) console.log(`  size guard: ${fit.degradation}`);
    if (dryRun) printBodyDiff(existing, fit.body);
  }

  if (repo && plan && files.length > 0) {
    console.log(
      `${prefix}${dryRun ? 'would publish' : 'publishing'} ${files.length} image(s) from ${runDir}`,
    );
    console.log(`  repo:   ${repo.owner}/${repo.repo} (${repo.url})`);
    console.log(
      `  branch: ${plan.branch} (created as an orphan branch if missing; never main or a PR branch)`,
    );
    console.log(`  dir:    ${plan.targetDir}/`);
    for (const file of files) console.log(`  ${file.source} -> ${file.url}`);
  }

  if (dryRun) {
    console.log(`[dry-run] would write ${publishedPath}`);
    console.log(
      nextBody === null
        ? '[dry-run] no git commands were run and nothing was pushed'
        : '[dry-run] no git push and no `gh pr edit` were run; PR body unchanged',
    );
    return;
  }

  if (repo && files.length > 0) pushImages(repo, runDir, runId, files);

  writeFileSync(publishedPath, outputMarkdown);
  console.log(
    nothing
      ? `paste-ready markdown (unchanged): ${publishedPath}`
      : `published. paste-ready markdown: ${publishedPath}`,
  );

  if (repo && nextBody !== null && prBodyFlag !== undefined) {
    updatePrBody(repo, prBodyFlag, nextBody);
  }
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
