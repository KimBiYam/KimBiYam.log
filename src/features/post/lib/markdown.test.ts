import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getMarkdownData } from '@src/features/post/lib/markdown';

let directory: string;

beforeAll(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'markdown-test-'));
  fs.writeFileSync(
    path.join(directory, 'with-matter.md'),
    "---\ntitle: 'Hello'\ntag: 'ts'\n---\n\n## Body\n\ntext\n",
  );
  fs.writeFileSync(path.join(directory, 'no-matter.md'), '## Only body\n');
  fs.writeFileSync(path.join(directory, 'empty.md'), '');
});

afterAll(() => {
  fs.rmSync(directory, { recursive: true, force: true });
});

describe('getMarkdownData', () => {
  it('splits front matter from the body', async () => {
    const { matterResult, contentHtml } = await getMarkdownData(
      directory,
      'with-matter',
    );

    expect(matterResult.data).toEqual({ title: 'Hello', tag: 'ts' });
    expect(contentHtml).toBe('\n## Body\n\ntext\n');
    expect(contentHtml).toBe(matterResult.content);
  });

  it('returns empty data when there is no front matter', async () => {
    const { matterResult, contentHtml } = await getMarkdownData(
      directory,
      'no-matter',
    );

    expect(matterResult.data).toEqual({});
    expect(contentHtml).toBe('## Only body\n');
  });

  it('handles an empty file', async () => {
    const { matterResult, contentHtml } = await getMarkdownData(
      directory,
      'empty',
    );

    expect(matterResult.data).toEqual({});
    expect(contentHtml).toBe('');
  });

  it('rejects with ENOENT for an unknown id', async () => {
    await expect(getMarkdownData(directory, 'missing')).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });
});
