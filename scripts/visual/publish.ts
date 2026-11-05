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
  isNothingToPublish,
  parseGitHubRemote,
} from './markdown.ts';

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
const positional = args.filter(
  (arg, i) =>
    !arg.startsWith('--') &&
    args[i - 1] !== '--remote' &&
    args[i - 1] !== '--repo',
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

const main = () => {
  const runDir = path.resolve(positional[0] ?? latestRunDir());
  const runId = path.basename(runDir);
  const markdown = readFileSync(path.join(runDir, 'comment.md'), 'utf8');
  const publishedPath = path.join(runDir, 'comment.published.md');

  // 이미지가 없으면 git/원격을 건드리지 않고 마크다운을 그대로 내보낸다.
  if (isNothingToPublish(markdown)) {
    console.log(
      `${dryRun ? '[dry-run] ' : ''}nothing to publish: comment.md references 0 images`,
    );
    if (dryRun) {
      console.log(
        `[dry-run] would write ${publishedPath} (unchanged markdown); no git commands were run and nothing was pushed`,
      );
      return;
    }
    writeFileSync(publishedPath, markdown);
    console.log(`paste-ready markdown (unchanged): ${publishedPath}`);
    return;
  }

  const repo = resolveRepo();
  const plan = buildPublishPlan(markdown, repo, runId);

  console.log(
    `${dryRun ? '[dry-run] would publish' : 'publishing'} ${plan.files.length} image(s) from ${runDir}`,
  );
  console.log(`  repo:   ${repo.owner}/${repo.repo} (${repo.url})`);
  console.log(
    `  branch: ${plan.branch} (created as an orphan branch if missing; never main or a PR branch)`,
  );
  console.log(`  dir:    ${plan.targetDir}/`);
  for (const file of plan.files) console.log(`  ${file.source} -> ${file.url}`);

  if (dryRun) {
    console.log(`[dry-run] would write ${publishedPath}`);
    console.log('[dry-run] no git commands were run and nothing was pushed');
    return;
  }

  // 사용자의 체크아웃과 무관한 임시 저장소에서 커밋/푸시한다.
  const temp = mkdtempSync(path.join(os.tmpdir(), 'visual-publish-'));
  try {
    git(temp, ['init', '-q']);
    git(temp, ['remote', 'add', 'origin', repo.url]);
    const exists =
      git(temp, ['ls-remote', '--heads', 'origin', plan.branch]) !== '';
    if (exists) {
      git(temp, ['fetch', '-q', '--depth=1', 'origin', plan.branch]);
      git(temp, ['checkout', '-q', '-b', plan.branch, 'FETCH_HEAD']);
    } else {
      git(temp, ['checkout', '-q', '--orphan', plan.branch]);
    }
    for (const file of plan.files) {
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
    git(temp, ['push', '-q', 'origin', `HEAD:refs/heads/${plan.branch}`]);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }

  writeFileSync(publishedPath, plan.markdown);
  console.log(`published. paste-ready markdown: ${publishedPath}`);
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
