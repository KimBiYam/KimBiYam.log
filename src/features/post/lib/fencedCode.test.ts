import { describe, expect, it } from 'vitest';

import { splitFencedCode } from '@src/features/post/lib/fencedCode';

describe('splitFencedCode', () => {
  it('returns no fences for empty input', () => {
    expect(splitFencedCode('')).toEqual({ proseLines: [''], fenceCount: 0 });
  });

  it('keeps prose-only markdown untouched', () => {
    const result = splitFencedCode('# Title\n\nbody');

    expect(result.proseLines).toEqual(['# Title', '', 'body']);
    expect(result.fenceCount).toBe(0);
  });

  it('removes backtick fenced blocks and counts them', () => {
    const result = splitFencedCode('before\n```ts\n# not heading\n```\nafter');

    expect(result.proseLines).toEqual(['before', 'after']);
    expect(result.fenceCount).toBe(1);
  });

  it('supports tilde fences and counts multiple blocks', () => {
    const result = splitFencedCode('a\n~~~\nx\n~~~\nb\n```\ny\n```\nc');

    expect(result.proseLines).toEqual(['a', 'b', 'c']);
    expect(result.fenceCount).toBe(2);
  });

  it('does not close a fence with a different fence character', () => {
    const result = splitFencedCode('```\ncode\n~~~\nstill code\n```\nprose');

    expect(result.proseLines).toEqual(['prose']);
    expect(result.fenceCount).toBe(1);
  });

  it('does not close a fence with a shorter fence', () => {
    const result = splitFencedCode('````\ncode\n```\nstill code\n````\nprose');

    expect(result.proseLines).toEqual(['prose']);
    expect(result.fenceCount).toBe(1);
  });

  it('does not close a fence when the closing line has trailing text', () => {
    const result = splitFencedCode('```\ncode\n``` ts\nstill code\n```\nprose');

    expect(result.proseLines).toEqual(['prose']);
  });

  it('allows up to 3 spaces of indentation but not 4', () => {
    expect(splitFencedCode('   ```\ncode\n   ```\nprose').fenceCount).toBe(1);

    const indented = splitFencedCode('    ```\nprose');
    expect(indented.fenceCount).toBe(0);
    expect(indented.proseLines).toEqual(['    ```', 'prose']);
  });

  it('treats an unclosed fence as running to the end', () => {
    const result = splitFencedCode('prose\n```\ncode\nmore');

    expect(result.proseLines).toEqual(['prose']);
    expect(result.fenceCount).toBe(1);
  });
});
