import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostData } from "../../types/post.types";

const POST_DIRECTORY = path.join(process.cwd(), "contents", "posts");

const getSortedPosts = () => {
  const fileNames = fs.readdirSync(POST_DIRECTORY);
  const allPosts: PostData[] = fileNames.map(getPostDataByFileName);

  const sortedAllPosts = [...allPosts].sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return sortedAllPosts;
};

const getPostDataByFileName = (fileName: string): PostData => {
  const id = fileName.replace(/\.md$/, "");

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);

  const { date, title } = matterResult.data;

  return { id, date, title };
};

export default getSortedPosts;
