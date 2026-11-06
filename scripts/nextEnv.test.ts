import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { keepNextEnvClean } from './nextEnv.ts';

const git = (cwd: string, ...args: string[]) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' });

describe('keepNextEnvClean', () => {
  let root: string;
  const file = () => join(root, 'next-env.d.ts');

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'next-env-'));
    git(root, 'init', '-q');
    git(root, 'config', 'user.email', 't@example.com');
    git(root, 'config', 'user.name', 't');
    writeFileSync(file(), 'original\n');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'init');
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('restores the file when it was clean', () => {
    const result = keepNextEnvClean(root, () => {
      writeFileSync(file(), 'rewritten\n');
      return 'done';
    });

    expect(result).toBe('done');
    expect(readFileSync(file(), 'utf8')).toBe('original\n');
  });

  it('keeps pre-existing local edits', () => {
    writeFileSync(file(), 'mine\n');

    keepNextEnvClean(root, () => writeFileSync(file(), 'rewritten\n'));

    expect(readFileSync(file(), 'utf8')).toBe('rewritten\n');
  });

  it('does not fail when the file is marked skip-worktree', () => {
    git(root, 'update-index', '--skip-worktree', 'next-env.d.ts');

    expect(() =>
      keepNextEnvClean(root, () => writeFileSync(file(), 'rewritten\n')),
    ).not.toThrow();
  });
});
