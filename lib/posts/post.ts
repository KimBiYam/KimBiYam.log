import { getMarkdownData } from "./markdown";
import { PostData, PostPath, PostPreview } from "../../types/post.types";
import { POST_DIRECTORY } from "../../constants";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const getAllPostPaths = (): { params: PostPath }[] => {
  const markdownFilePaths = getPostMarkdownFilePaths();

  const paths = markdownFilePaths.map((markdownFilePath) => {
    const slicedFilePath = markdownFilePath.split("/");

    const subdirectory = slicedFilePath[0];
    const id = slicedFilePath[1].replace(/\.md$/, "");

    return {
      params: {
        id,
        subdirectory,
      },
    };
  });

  return paths;
};

export const getPostData = async (
  directory: string,
  id: string
): Promise<PostData> => {
  const {
    matterResult: {
      data: { title, date },
    },
    contentHtml,
  } = await getMarkdownData(directory, id);

  return {
    id,
    title,
    date,
    contentHtml,
  };
};

export const getSortedPostPreviews = () => {
  const filePaths = getPostMarkdownFilePaths();

  const allPosts = filePaths.map(getPostPreview);

  const sortedAllPosts = [...allPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return sortedAllPosts;
};

const getPostMarkdownFilePaths = () => {
  const directories = fs.readdirSync(POST_DIRECTORY);

  const markdownFilePaths = directories.map((directory) => {
    const fileNames = fs.readdirSync(`${POST_DIRECTORY}/${directory}`);
    const markdownFileNames = fileNames.filter((fileName) =>
      fileName.endsWith(".md")
    );

    return markdownFileNames.map(
      (markdownFileName) => `${directory}/${markdownFileName}`
    );
  });

  return markdownFilePaths.flat();
};

const getPostPreview = (fileName: string): PostPreview => {
  const POST_PREVIEW_CONTENT_MAX_LENGTH = 200;

  const id = fileName.replace(/\.md$/, "");

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);

  const {
    data: { date, title },
    content,
  } = matterResult;

  const slicedContent = content.substring(0, POST_PREVIEW_CONTENT_MAX_LENGTH);
  const previewContent = replacePreviewContent(slicedContent);

  return { id, date, title, content: previewContent };
};

const replacePreviewContent = (content: string) => {
  const IMAGE_TAG_REG_EXP = new RegExp(/!\[(.*?)\]\((.*?)\)/g);
  const SPECIAL_CHARACTERS_REG_EXP = new RegExp(
    /[!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]/g
  );

  return (
    content
      .replace(IMAGE_TAG_REG_EXP, "")
      .replace(SPECIAL_CHARACTERS_REG_EXP, "") + "..."
  );
};
