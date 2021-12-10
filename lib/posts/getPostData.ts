import path from "path";
import { POST_DIRECTORY } from "../../constants";
import fs from "fs";
import matter from "gray-matter";
import { parseMarkdown } from "./markdown";

const getPostData = async (id: string) => {
  const fullPath = path.join(POST_DIRECTORY, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const {
    data: { date, title },
    content,
  } = matterResult;

  const contentHtml = await parseMarkdown(content);

  return {
    id,
    title,
    date,
    contentHtml,
  };
};

export default getPostData;
