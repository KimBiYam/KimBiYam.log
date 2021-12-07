import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostPreview } from "../../types/post.types";
import { POST_DIRECTORY } from "../../constants";

const POST_PREVIEW_MAX_LENGTH = 200;

const getSortedPostPreviews = () => {
  const fileNames = fs.readdirSync(POST_DIRECTORY);
  const allPosts: PostPreview[] = fileNames.map(getPostPreview);

  const sortedAllPosts = [...allPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return sortedAllPosts;
};

const getPostPreview = (fileName: string): PostPreview => {
  const id = fileName.replace(/\.md$/, "");

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);

  const {
    data: { date, title },
    content,
  } = matterResult;

  const slicedContent = content.substring(0, POST_PREVIEW_MAX_LENGTH);
  const previewContent = slicedContent.replace(/[*,#]/g, "") + "...";

  return { id, date, title, content: previewContent };
};

export default getSortedPostPreviews;
