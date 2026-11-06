import { execFileSync } from 'node:child_process';

const NEXT_ENV = 'next-env.d.ts';

const git = (root: string, args: string[]) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

/**
 * 되돌릴 수 있는 상태인지 본다. 추적 중이고(`H`), 작업 트리에서 수정이 없으며,
 * skip-worktree 같은 로컬 플래그가 없어야 한다. 플래그가 있으면 `git status` 는
 * 깨끗하게 보이지만 `git checkout` 이 pathspec 오류로 실패한다.
 */
const canRestore = (root: string) => {
  const flag = git(root, ['ls-files', '-v', '--', NEXT_ENV]).charAt(0);
  if (flag !== 'H') return false;
  return git(root, ['status', '--porcelain', '--', NEXT_ENV]) === '';
};

/**
 * `next build` 는 추적 중인 next-env.d.ts 를 다시 쓴다. 실행 전에 깨끗했다면
 * 끝난 뒤 되돌려 하네스가 작업 트리를 더럽히지 않게 한다. 이미 수정 중이던
 * 변경이나 skip-worktree 로 숨겨 둔 파일은 건드리지 않는다.
 */
export const keepNextEnvClean = <T>(root: string, fn: () => T): T => {
  const restore = canRestore(root);
  try {
    return fn();
  } finally {
    if (restore) git(root, ['checkout', '--', NEXT_ENV]);
  }
};
