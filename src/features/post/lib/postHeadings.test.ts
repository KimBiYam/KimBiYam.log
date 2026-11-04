import { describe, expect, it } from 'vitest';

import { hasPostHeadings } from '@src/features/post/lib/postHeadings';

describe('hasPostHeadings', () => {
  it('is false for empty input', () => {
    expect(hasPostHeadings('')).toBe(false);
  });

  it('is false for prose without headings', () => {
    expect(hasPostHeadings('just text\nmore text')).toBe(false);
  });

  it('detects h2 and h3', () => {
    expect(hasPostHeadings('intro\n## Section')).toBe(true);
    expect(hasPostHeadings('### Sub')).toBe(true);
  });

  it('ignores h1 and h4+', () => {
    expect(hasPostHeadings('# Title')).toBe(false);
    expect(hasPostHeadings('#### Deep')).toBe(false);
  });

  it('requires a space, tab or end of line after the hashes', () => {
    expect(hasPostHeadings('##nospace')).toBe(false);
    expect(hasPostHeadings('##\ttab')).toBe(true);
    expect(hasPostHeadings('##')).toBe(true);
  });

  it('allows up to 3 leading spaces only', () => {
    expect(hasPostHeadings('   ## Heading')).toBe(true);
    expect(hasPostHeadings('    ## Code')).toBe(false);
  });

  it('ignores # lines inside fenced code blocks', () => {
    expect(hasPostHeadings('text\n```sh\n## comment\n```\nmore')).toBe(false);
  });

  it('finds a heading after a fenced block', () => {
    expect(hasPostHeadings('```\n## x\n```\n## Real')).toBe(true);
  });

  it('handles duplicate headings', () => {
    expect(hasPostHeadings('## A\n## A')).toBe(true);
  });
});
