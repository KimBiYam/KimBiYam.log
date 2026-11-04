import { describe, expect, it } from 'vitest';

import {
  getAdjacentPostPreviews,
  getAllPostPaths,
  getPostTags,
  getSortedPostPreviews,
} from '@src/features/post/lib/postList';

describe('getAllPostPaths', () => {
  it('returns post paths with an id and subdirectory', async () => {
    const paths = await getAllPostPaths();

    expect(paths.length).toBeGreaterThan(0);
    for (const { id, subdirectory } of paths) {
      expect(id).not.toBe('');
      expect(id).not.toMatch(/\.md$/);
      expect(subdirectory).not.toBe('');
    }
  });

  it('has unique ids', async () => {
    const ids = (await getAllPostPaths()).map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getSortedPostPreviews', () => {
  it('returns previews with all required fields', async () => {
    const previews = await getSortedPostPreviews();

    expect(previews.length).toBeGreaterThan(0);
    for (const preview of previews) {
      expect(preview.id).toEqual(expect.any(String));
      expect(preview.title).toEqual(expect.any(String));
      expect(preview.tag).toEqual(expect.any(String));
      expect(preview.date).toEqual(expect.any(String));
      expect(preview.content).toEqual(expect.any(String));
      expect(preview.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('is sorted by date, newest first', async () => {
    const previews = await getSortedPostPreviews();

    for (let i = 1; i < previews.length; i += 1) {
      expect(previews[i - 1].date >= previews[i].date).toBe(true);
    }
  });

  it('matches the number of post paths', async () => {
    const [previews, paths] = await Promise.all([
      getSortedPostPreviews(),
      getAllPostPaths(),
    ]);

    expect(previews).toHaveLength(paths.length);
  });
});

describe('getPostTags', () => {
  it('returns unique, sorted tags that exist on posts', async () => {
    const [tags, previews] = await Promise.all([
      getPostTags(),
      getSortedPostPreviews(),
    ]);

    expect(tags.length).toBeGreaterThan(0);
    expect(new Set(tags).size).toBe(tags.length);
    expect(tags).toEqual([...tags].sort());
    expect(tags).toEqual(
      expect.arrayContaining([...new Set(previews.map(({ tag }) => tag))]),
    );
  });
});

describe('getAdjacentPostPreviews', () => {
  it('has no newer post for the newest post', async () => {
    const previews = await getSortedPostPreviews();
    const { newerPost, olderPost } = await getAdjacentPostPreviews(
      previews[0].id,
    );

    expect(newerPost).toBeUndefined();
    expect(olderPost?.id).toBe(previews[1]?.id);
  });

  it('has no older post for the oldest post', async () => {
    const previews = await getSortedPostPreviews();
    const last = previews.length - 1;
    const { newerPost, olderPost } = await getAdjacentPostPreviews(
      previews[last].id,
    );

    expect(olderPost).toBeUndefined();
    expect(newerPost?.id).toBe(previews[last - 1]?.id);
  });

  it('returns both neighbors for a middle post', async () => {
    const previews = await getSortedPostPreviews();
    expect(previews.length).toBeGreaterThan(2);

    const { newerPost, olderPost } = await getAdjacentPostPreviews(
      previews[1].id,
    );

    expect(newerPost?.id).toBe(previews[0].id);
    expect(olderPost?.id).toBe(previews[2].id);
  });

  it('returns undefined for both when the id is unknown', async () => {
    expect(await getAdjacentPostPreviews('__unknown__/id')).toEqual({
      newerPost: undefined,
      olderPost: undefined,
    });
  });
});
