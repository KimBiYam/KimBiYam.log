import path from "path";
import { POST_DIRECTORY } from "../../constants";
import fs from "fs";
import matter from "gray-matter";

const getPostData = (id: string) => {
  const fullPath = path.join(POST_DIRECTORY, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const {
    data: { date },
    content,
  } = matterResult;

  return {
    id,
    date,
    content,
  };
};

export default getPostData;
