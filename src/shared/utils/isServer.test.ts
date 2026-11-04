import { describe, expect, it } from 'vitest';

import { isServer } from '@src/shared/utils/isServer';

describe('isServer', () => {
  it('returns true in the node environment', () => {
    expect(isServer()).toBe(true);
  });
});
