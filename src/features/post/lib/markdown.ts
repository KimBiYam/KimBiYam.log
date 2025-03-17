import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

export const getMarkdownData = async (directory: string, id: string) => {
  const fullPath = path.join(directory, `${id}.md`);
  const fileContents = await fs.promises.readFile(fullPath, {
    encoding: 'utf-8',
  });

  const matterResult = matter(fileContents);

  const { content } = matterResult;

  return {
    matterResult,
    contentHtml: content,
  };
};
