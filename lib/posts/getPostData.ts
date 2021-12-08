import path from "path";
import { POST_DIRECTORY } from "../../constants";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const getPostData = async (id: string) => {
  const fullPath = path.join(POST_DIRECTORY, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkHtml)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const {
    data: { date, title },
  } = matterResult;

  return {
    id,
    title,
    date,
    contentHtml,
  };
};

export default getPostData;
