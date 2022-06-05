import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';

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
  const processedContent = await remark().process(content);

  return processedContent.toString();
};
