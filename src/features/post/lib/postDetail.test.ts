import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { POST_DIRECTORY } from '@src/features/post/constants/directories';
import { getPostDetail } from '@src/features/post/lib/postDetail';
import { getAllPostPaths } from '@src/features/post/lib/postList';

let directory: string;

beforeAll(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'post-detail-test-'));
  fs.writeFileSync(
    path.join(directory, 'sample.md'),
    [
      '---',
      "title: 'Sample'",
      "date: '2026-01-02'",
      "updated: '2026-02-03'",
      "tag: 'ts'",
      "ogImagePath: '/og.png'",
      '---',
      '',
      '## Heading',
      '',
      'Line one',
      'line two',
      '',
    ].join('\n'),
  );
});

afterAll(() => {
  fs.rmSync(directory, { recursive: true, force: true });
});

describe('getPostDetail', () => {
  it('maps front matter and body into a PostDetail', async () => {
    const detail = await getPostDetail(directory, 'sample');

    expect(detail).toMatchObject({
      id: 'sample',
      title: 'Sample',
      date: '2026-01-02',
      updated: '2026-02-03',
      tag: 'ts',
      ogImagePath: '/og.png',
      readingTimeMinutes: 1,
    });
    expect(detail.contentHtml).toContain('## Heading');
  });

  it('builds a description without line breaks', async () => {
    const { description } = await getPostDetail(directory, 'sample');

    expect(description).not.toContain('\n');
    expect(description).toContain('Line one');
  });

  it('calls notFound for an unknown id', async () => {
    await expect(getPostDetail(directory, 'missing')).rejects.toMatchObject({
      digest: expect.stringContaining('404'),
    });
  });

  it('rethrows errors other than a missing file', async () => {
    fs.mkdirSync(path.join(directory, 'folder.md'));

    await expect(getPostDetail(directory, 'folder')).rejects.toMatchObject({
      code: 'EISDIR',
    });
  });

  it('loads every real post with required fields', async () => {
    const paths = await getAllPostPaths();
    expect(paths.length).toBeGreaterThan(0);

    for (const { id, subdirectory } of paths.slice(0, 5)) {
      const fileId = id.split('/').pop() as string;
      const detail = await getPostDetail(
        path.join(POST_DIRECTORY, subdirectory),
        fileId,
      );

      expect(detail.title).toEqual(expect.any(String));
      expect(detail.date).toEqual(expect.any(String));
      expect(detail.tag).toEqual(expect.any(String));
      expect(detail.contentHtml.length).toBeGreaterThan(0);
      expect(detail.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    }
  });
});
