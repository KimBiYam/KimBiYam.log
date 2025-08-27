import fs from 'fs';
import path from 'path';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getMarkdownData } from '../markdown';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    promises: {
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

describe('markdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMarkdownData', () => {
    it('should read and parse markdown file', async () => {
      const mockReadFile = vi.mocked(fs.promises.readFile);
      const mockJoin = vi.mocked(path.join);
      const { default: matter } = await import('gray-matter');

      const mockFileContent = `---
title: Test Post
date: 2023-01-01
tag: test
---

# Test Content

This is test content.`;

      const mockMatterResult = {
        data: {
          title: 'Test Post',
          date: '2023-01-01',
          tag: 'test',
        },
        content: '# Test Content\n\nThis is test content.',
      };

      mockJoin.mockReturnValue('/mock/directory/test-post.md');
      mockReadFile.mockResolvedValue(mockFileContent);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(matter).mockReturnValue(mockMatterResult as any);

      const result = await getMarkdownData('/mock/directory', 'test-post');

      expect(mockJoin).toHaveBeenCalledWith('/mock/directory', 'test-post.md');
      expect(mockReadFile).toHaveBeenCalledWith(
        '/mock/directory/test-post.md',
        {
          encoding: 'utf-8',
        },
      );
      expect(matter).toHaveBeenCalledWith(mockFileContent);
      expect(result).toEqual({
        matterResult: mockMatterResult,
        contentHtml: '# Test Content\n\nThis is test content.',
      });
    });

    it('should handle file reading errors', async () => {
      const mockReadFile = vi.mocked(fs.promises.readFile);
      const mockError = new Error('File not found');

      mockReadFile.mockRejectedValue(mockError);

      await expect(
        getMarkdownData('/mock/directory', 'nonexistent'),
      ).rejects.toThrow('File not found');
    });

    it('should construct correct file path', async () => {
      const mockReadFile = vi.mocked(fs.promises.readFile);
      const mockJoin = vi.mocked(path.join);
      const { default: matter } = await import('gray-matter');

      mockReadFile.mockResolvedValue('test content');
      vi.mocked(matter).mockReturnValue({
        data: {},
        content: 'test content',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      await getMarkdownData('posts/javascript', 'array-methods');

      expect(mockJoin).toHaveBeenCalledWith(
        'posts/javascript',
        'array-methods.md',
      );
    });

    it('should parse frontmatter and content correctly', async () => {
      const mockReadFile = vi.mocked(fs.promises.readFile);
      const { default: matter } = await import('gray-matter');

      const fileContent = `---
title: Advanced JavaScript
date: 2023-12-01
tag: javascript
author: John Doe
---

# Advanced JavaScript Concepts

## Closures

Closures are a fundamental concept...`;

      const matterResult = {
        data: {
          title: 'Advanced JavaScript',
          date: '2023-12-01',
          tag: 'javascript',
          author: 'John Doe',
        },
        content:
          '# Advanced JavaScript Concepts\n\n## Closures\n\nClosures are a fundamental concept...',
      };

      mockReadFile.mockResolvedValue(fileContent);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(matter).mockReturnValue(matterResult as any);

      const result = await getMarkdownData('/posts', 'advanced-js');

      expect(result.matterResult.data).toEqual({
        title: 'Advanced JavaScript',
        date: '2023-12-01',
        tag: 'javascript',
        author: 'John Doe',
      });
      expect(result.contentHtml).toContain('# Advanced JavaScript Concepts');
      expect(result.contentHtml).toContain('## Closures');
    });
  });
});
