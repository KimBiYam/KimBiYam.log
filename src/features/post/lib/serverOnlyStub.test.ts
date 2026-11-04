import { describe, expect, it } from 'vitest';

import { getAllPostPaths } from '@src/features/post/lib/postList';

describe('server-only stub', () => {
  it('allows importing modules that import server-only', () => {
    expect(getAllPostPaths).toBeTypeOf('function');
  });
});
