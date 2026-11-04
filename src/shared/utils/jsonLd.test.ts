import { describe, expect, it } from 'vitest';

import { serializeJsonLd } from '@src/shared/utils/jsonLd';

describe('serializeJsonLd', () => {
  it('serializes values as JSON', () => {
    expect(serializeJsonLd({ a: 1, b: ['x'] })).toBe('{"a":1,"b":["x"]}');
  });

  it('escapes < so a closing script tag cannot break out', () => {
    const result = serializeJsonLd({ name: '</script><script>alert(1)' });

    expect(result).not.toContain('<');
    expect(result).toContain('\\u003c/script>');
  });

  it('round-trips through JSON.parse', () => {
    const value = { name: '<b>bold</b>' };

    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });
});
