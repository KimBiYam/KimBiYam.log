import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkPrism from 'remark-prism';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

export const getMarkdownData = async (directory: string, id: string) => {
  const fullPath = path.join(directory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const { content } = matterResult;
  const contentHtml = await parseMarkdown(content);

  return {
    matterResult,
    contentHtml,
  };
};

export const parseMarkdown = async (content: string) => {
  const processedContent = await remark()
    .use(remarkGfm)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(remarkPrism as any)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);

  return processedContent.toString();
};
