import { describe, expect, it } from 'vitest';

import { extractImagePaths } from './markdown.ts';
import {
  BLOCK_END,
  BLOCK_START,
  MAX_BODY_LENGTH,
  fitBlock,
  replaceBlock,
  wrapBlock,
} from './prBody.ts';

const imageBlock = (n: number) =>
  [
    `<details><summary><code>/r${n}</code> · desktop · light</summary>`,
    '',
    '| before | after | diff |',
    '| --- | --- | --- |',
    `| <img src="before/${n}.png" width="240"> | <img src="after/${n}.png" width="240"> | <img src="diff/${n}.png" width="240"> |`,
    '',
    '</details>',
  ].join('\n');

const report = (images: number, rows = 1) =>
  [
    '## Visual comparison: ✅ PASS',
    '',
    'header line',
    '',
    '| Status | Route |',
    '| --- | --- |',
    ...Array(rows).fill('| 🔶 CHANGED | `/` |'),
    '',
    ...(images > 0
      ? [
          '### Screenshots',
          '',
          Array.from({ length: images }, (_, i) => imageBlock(i)).join('\n\n'),
          '',
        ]
      : []),
    'CLS footnote.',
    '',
  ].join('\n');

describe('replaceBlock', () => {
  const block = wrapBlock('NEW\n');

  it('replaces only the text between the markers', () => {
    const body = `above\n\n${BLOCK_START}\nOLD\n${BLOCK_END}\n\nbelow\n`;
    expect(replaceBlock(body, block)).toBe(`above\n\n${block}\n\nbelow\n`);
  });

  it('appends the block with markers when they are missing', () => {
    expect(replaceBlock('author text', block)).toBe(
      `author text\n\n${block}\n`,
    );
    expect(replaceBlock('author text\n', block)).toBe(
      `author text\n\n${block}\n`,
    );
    expect(replaceBlock('author text\n\n', block)).toBe(
      `author text\n\n${block}\n`,
    );
  });

  it('writes just the block into an empty body', () => {
    expect(replaceBlock('', block)).toBe(`${block}\n`);
  });

  it('is idempotent and never duplicates the block', () => {
    const once = replaceBlock('above\n', block);
    const twice = replaceBlock(once, block);
    expect(twice).toBe(once);
    expect(twice.split(BLOCK_START)).toHaveLength(2);
    const changed = replaceBlock(once, wrapBlock('OTHER\n'));
    expect(changed.split(BLOCK_START)).toHaveLength(2);
    expect(changed).not.toContain('NEW');
  });

  it('preserves CRLF text outside the block byte for byte', () => {
    const above = 'line1\r\n\r\nline2\r\n';
    const below = '\r\nafter\r\n';
    const body = `${above}${BLOCK_START}\r\nOLD\r\n${BLOCK_END}${below}`;
    const result = replaceBlock(body, block);
    expect(result.startsWith(above + BLOCK_START)).toBe(true);
    expect(result.endsWith(BLOCK_END + below)).toBe(true);
  });

  it('appends using the existing CRLF line ending', () => {
    const result = replaceBlock('a\r\nb', block);
    expect(result.startsWith('a\r\nb\r\n\r\n' + BLOCK_START)).toBe(true);
    expect(result.endsWith(`${BLOCK_END}\r\n`)).toBe(true);
  });

  it('does not clobber text when only one marker is present', () => {
    const body = `intro\n${BLOCK_START}\nnever closed\n`;
    const result = replaceBlock(body, block);
    expect(result.startsWith(body)).toBe(true);
    const reversed = `${BLOCK_END}\nx\n${BLOCK_START}`;
    expect(replaceBlock(reversed, block).startsWith(reversed)).toBe(true);
  });

  it('treats `$` in the block literally', () => {
    const dollar = wrapBlock('cost $& $1 $$\n');
    expect(replaceBlock(`${BLOCK_START}\nx\n${BLOCK_END}`, dollar)).toBe(
      dollar,
    );
  });
});

describe('fitBlock', () => {
  it('keeps everything when it fits', () => {
    const md = report(2);
    const fit = fitBlock(md, 'author\n');
    expect(fit.degradation).toBeNull();
    expect(fit.markdown).toBe(md);
    expect(fit.imagesKept).toBe(6);
    expect(fit.imagesDropped).toBe(0);
    expect(fit.body).toBe(replaceBlock('author\n', wrapBlock(md)));
  });

  it('handles a report with zero images', () => {
    const fit = fitBlock(report(0), '');
    expect(fit.imagesKept).toBe(0);
    expect(fit.body).toContain('| 🔶 CHANGED | `/` |');
  });

  it('caps the screenshots when the body would be too large', () => {
    const md = report(10);
    const author = 'a'.repeat(1200);
    const full = fitBlock(md, author).body.length;
    const limit = full - 900;
    const fit = fitBlock(md, author, limit);
    expect(fit.body.length).toBeLessThanOrEqual(limit);
    expect(fit.degradation).toMatch(/showing screenshots for \d+ of 10/);
    expect(fit.markdown).toContain('Size guard');
    expect(fit.imagesKept).toBeGreaterThan(0);
    expect(fit.imagesKept).toBeLessThan(30);
    expect(fit.imagesKept + fit.imagesDropped).toBe(30);
    expect(extractImagePaths(fit.markdown)).toHaveLength(fit.imagesKept);
    expect(fit.body.startsWith(author)).toBe(true);
  });

  it('drops all screenshots but keeps the table when needed', () => {
    const author = 'b'.repeat(500);
    const noImages = fitBlock(report(0), author).body.length;
    const limit = noImages + 300;
    const fit = fitBlock(report(10), author, limit);
    expect(fit.imagesKept).toBe(0);
    expect(fit.degradation).toMatch(/screenshots omitted/);
    expect(fit.markdown).toContain('| 🔶 CHANGED | `/` |');
    expect(fit.body.length).toBeLessThanOrEqual(limit);
  });

  it('falls back to the header only, never touching the author text', () => {
    const author = 'c'.repeat(300);
    const limit = 560;
    const fit = fitBlock(report(3, 40), author, limit);
    expect(fit.degradation).toMatch(/table and screenshots omitted/);
    expect(fit.markdown).not.toContain('| Status |');
    expect(fit.body.startsWith(author)).toBe(true);
    expect(fit.body.length).toBeLessThanOrEqual(limit);
  });

  it('throws when even the minimal block cannot fit', () => {
    const author = 'd'.repeat(MAX_BODY_LENGTH);
    expect(() => fitBlock(report(1), author)).toThrow(/too large/);
  });

  it('works against the real 65,536 limit with an oversized report', () => {
    const fit = fitBlock(report(400), 'text\r\n');
    expect(fit.body.length).toBeLessThanOrEqual(MAX_BODY_LENGTH);
    expect(fit.degradation).not.toBeNull();
    expect(fit.body.startsWith('text\r\n')).toBe(true);
    expect(fit.body.split(BLOCK_START)).toHaveLength(2);
  });

  it('is idempotent when re-fitting against its own output', () => {
    const first = fitBlock(report(400), 'x\n');
    const second = fitBlock(report(400), first.body);
    expect(second.body).toBe(first.body);
  });
});
