import path from "path";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";
import fs from "fs";
import matter from "gray-matter";

export const getMarkdownData = async (directory: string, id: string) => {
  const fullPath = path.join(directory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

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
    .use(html, { sanitize: false })
    .use(prism as any)
    .process(content);

  return processedContent.toString();
};
