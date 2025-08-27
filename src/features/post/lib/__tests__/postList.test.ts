import fs from 'fs';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  getPostPreviewDescription,
  getAllPostPaths,
  getSortedPostPreviews,
} from '../postList';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    promises: {
      readdir: vi.fn(),
      readFile: vi.fn(),
    },
  },
}));

// Mock path module
vi.mock('path', () => ({
  default: {
    join: vi.fn((...paths: string[]) => paths.join('/')),
  },
}));

// Mock gray-matter
vi.mock('gray-matter', () => ({
  default: vi.fn(),
}));

// Mock constants
vi.mock('@src/features/post/constants/directories', () => ({
  POST_DIRECTORY: '/mock/posts',
}));

describe('postList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPostPreviewDescription', () => {
    it('should extract preview text from markdown content', () => {
      const markdownContent = `
# Main Title

This is the first paragraph that should be included in the preview.
This is the second paragraph that continues the description.

## Subtitle

More content here that should also be included.
      `;

      const result = getPostPreviewDescription(markdownContent);

      expect(result).toContain('This is the first paragraph');
      expect(result).toContain('This is the second paragraph');
      expect(result).not.toContain('# Main Title');
      expect(result).not.toContain('## Subtitle');
    });

    it('should remove code blocks from preview', () => {
      const markdownContent = `
# Title

This is some text before code.

\`\`\`javascript
function test() {
  console.log('This should not appear');
}
\`\`\`

This text should appear in preview.

~~~python
def another_test():
    print("This should also not appear")
~~~

Final text that should appear.
      `;

      const result = getPostPreviewDescription(markdownContent);

      expect(result).toContain('This is some text before code');
      expect(result).toContain('This text should appear in preview');
      expect(result).toContain('Final text that should appear');
      expect(result).not.toContain('console.log');
      expect(result).not.toContain('print("This should also not appear")');
    });

    it('should truncate content to 200 characters and add ellipsis', () => {
      const longContent = 'A'.repeat(250);
      const result = getPostPreviewDescription(longContent);

      expect(result.length).toBe(203); // 200 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should not add ellipsis for short content', () => {
      const shortContent = 'Short content that is under 200 characters.';
      const result = getPostPreviewDescription(shortContent);

      expect(result).toBe(shortContent);
      expect(result.endsWith('...')).toBe(false);
    });

    it('should handle empty content', () => {
      const result = getPostPreviewDescription('');
      expect(result).toBe('');
    });

    it('should remove inline markdown formatting', () => {
      const markdownContent = `
This has **bold text** and *italic text* and [links](http://example.com).

- List item 1
- List item 2

> This is a blockquote
      `;

      const result = getPostPreviewDescription(markdownContent);

      expect(result).toContain('bold text');
      expect(result).toContain('italic text');
      expect(result).toContain('links');
      expect(result).not.toContain('**');
      expect(result).not.toContain('*');
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
      expect(result).not.toContain('(http://example.com)');
    });
  });

  describe('getAllPostPaths', () => {
    it('should return post paths from directories and files', async () => {
      const mockReaddir = vi.mocked(fs.promises.readdir);

      // Mock directory structure
      mockReaddir
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['javascript', 'react', 'nodejs'] as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['array-methods.md', 'closures.md'] as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['hooks-guide.md', 'state-management.md'] as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['express-basics.md'] as any);

      const result = await getAllPostPaths();

      expect(result).toEqual([
        { params: { subdirectory: 'javascript', id: 'array-methods' } },
        { params: { subdirectory: 'javascript', id: 'closures' } },
        { params: { subdirectory: 'react', id: 'hooks-guide' } },
        { params: { subdirectory: 'react', id: 'state-management' } },
        { params: { subdirectory: 'nodejs', id: 'express-basics' } },
      ]);
    });

    it('should filter out non-markdown files', async () => {
      const mockReaddir = vi.mocked(fs.promises.readdir);

      mockReaddir
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['javascript'] as any)
        .mockResolvedValueOnce([
          'test.md',
          'image.png',
          'README.txt',
          'another.md',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any);

      const result = await getAllPostPaths();

      expect(result).toEqual([
        { params: { subdirectory: 'javascript', id: 'test' } },
        { params: { subdirectory: 'javascript', id: 'another' } },
      ]);
    });
  });

  describe('getSortedPostPreviews', () => {
    it('should return posts sorted by date descending', async () => {
      const mockReaddir = vi.mocked(fs.promises.readdir);
      const mockReadFile = vi.mocked(fs.promises.readFile);
      const { default: matter } = await import('gray-matter');

      mockReaddir
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['tech'] as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce(['post1.md', 'post2.md', 'post3.md'] as any);

      mockReadFile
        .mockResolvedValueOnce('content1')
        .mockResolvedValueOnce('content2')
        .mockResolvedValueOnce('content3');

      vi.mocked(matter)
        .mockReturnValueOnce({
          data: { date: '2023-01-01', title: 'Post 1', tag: 'tech' },
          content: 'Content 1',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .mockReturnValueOnce({
          data: { date: '2023-03-01', title: 'Post 2', tag: 'tech' },
          content: 'Content 2',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .mockReturnValueOnce({
          data: { date: '2023-02-01', title: 'Post 3', tag: 'tech' },
          content: 'Content 3',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

      const result = await getSortedPostPreviews();

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2023-03-01'); // Most recent first
      expect(result[1].date).toBe('2023-02-01');
      expect(result[2].date).toBe('2023-01-01'); // Oldest last
    });
  });
});
