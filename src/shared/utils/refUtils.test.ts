import { describe, expect, it, vi } from 'vitest';

import { mergeRefs } from '@src/shared/utils/refUtils';

describe('mergeRefs', () => {
  it('returns null when no refs are given', () => {
    expect(mergeRefs()).toBeNull();
  });

  it('returns a single ref as is', () => {
    const ref = { current: null };

    expect(mergeRefs(ref)).toBe(ref);
  });

  it('returns null for a single undefined ref', () => {
    expect(mergeRefs(undefined)).toBeNull();
  });

  it('assigns the value to callback and object refs', () => {
    const callback = vi.fn();
    const object: { current: string | null } = { current: null };

    const merged = mergeRefs<string>(callback, object, undefined);
    (merged as (value: string) => void)('node');

    expect(callback).toHaveBeenCalledWith('node');
    expect(object.current).toBe('node');
  });
});
