import { execFileSync } from 'node:child_process';

const NEXT_ENV = 'next-env.d.ts';

const git = (root: string, args: string[]) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

/**
 * `next build` 는 추적 중인 next-env.d.ts 를 다시 쓴다. 실행 전에 깨끗했다면
 * 끝난 뒤 되돌려 하네스가 작업 트리를 더럽히지 않게 한다. 이미 수정 중이던
 * 변경은 건드리지 않는다.
 */
export const keepNextEnvClean = <T>(root: string, fn: () => T): T => {
  const wasClean = git(root, ['status', '--porcelain', '--', NEXT_ENV]) === '';
  try {
    return fn();
  } finally {
    if (wasClean) git(root, ['checkout', '--', NEXT_ENV]);
  }
};
