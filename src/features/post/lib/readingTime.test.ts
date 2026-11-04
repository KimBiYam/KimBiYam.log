import { describe, expect, it } from 'vitest';

import { getReadingTimeMinutes } from '@src/features/post/lib/readingTime';

describe('getReadingTimeMinutes', () => {
  it('returns at least 1 minute for empty input', () => {
    expect(getReadingTimeMinutes('')).toBe(1);
  });

  it('returns 1 for short text', () => {
    expect(getReadingTimeMinutes('안녕하세요 hello')).toBe(1);
  });

  it('counts 500 hangul characters per minute', () => {
    expect(getReadingTimeMinutes('가'.repeat(500))).toBe(1);
    expect(getReadingTimeMinutes('가'.repeat(501))).toBe(2);
    expect(getReadingTimeMinutes('가'.repeat(1500))).toBe(3);
  });

  it('counts 200 english words per minute', () => {
    expect(getReadingTimeMinutes('word '.repeat(200))).toBe(1);
    expect(getReadingTimeMinutes('word '.repeat(201))).toBe(2);
  });

  it('counts hyphenated and apostrophe words as one word', () => {
    expect(getReadingTimeMinutes("state-of-the-art don't ".repeat(100))).toBe(
      1,
    );
    expect(getReadingTimeMinutes("state-of-the-art don't ".repeat(101))).toBe(
      2,
    );
    expect(getReadingTimeMinutes('state-of-the-art '.repeat(200))).toBe(1);
    expect(getReadingTimeMinutes('state-of-the-art '.repeat(201))).toBe(2);
  });

  it('adds 10 seconds per fenced code block', () => {
    const block = '```\ncode\n```\n';

    expect(getReadingTimeMinutes(block.repeat(6))).toBe(1);
    expect(getReadingTimeMinutes(block.repeat(7))).toBe(2);
  });

  it('does not count text inside code blocks as prose', () => {
    const code = `\`\`\`\n${'가'.repeat(5000)}\n\`\`\``;

    expect(getReadingTimeMinutes(code)).toBe(1);
  });

  it('strips markdown syntax before counting', () => {
    const link = `[${'가'.repeat(500)}](https://example.com/${'a'.repeat(1000)})`;

    expect(getReadingTimeMinutes(link)).toBe(1);
  });

  it('ignores image alt text', () => {
    expect(getReadingTimeMinutes(`![${'가'.repeat(1000)}](/a.png)`)).toBe(1);
  });
});
