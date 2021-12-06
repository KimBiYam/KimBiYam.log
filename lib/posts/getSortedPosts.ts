import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostData } from "../../types/post.types";

const POST_DIRECTORY = path.join(process.cwd(), "contents", "posts");
const POST_PREVIEW_MAX_LENGTH = 200;

const getSortedPosts = () => {
  const fileNames = fs.readdirSync(POST_DIRECTORY);
  const allPosts: PostData[] = fileNames.map(getPostDataByFileName);

  const sortedAllPosts = [...allPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return sortedAllPosts;
};

const getPostDataByFileName = (fileName: string): PostData => {
  const id = fileName.replace(/\.md$/, "");

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);

  const {
    data: { date, title },
    content,
  } = matterResult;

  const slicedContent = content.substring(0, POST_PREVIEW_MAX_LENGTH);
  const postPreview = slicedContent.replace(/[*,#]/g, "") + "...";

  return { id, date, title, postPreview };
};

export default getSortedPosts;
