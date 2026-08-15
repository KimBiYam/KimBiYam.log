import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

import { POST_DIRECTORY } from '@src/features/post/constants/directories';
import { PostPath, PostPreview } from '@src/features/post/types/post.types';

import { getPostPreviewDescription } from './postDescription';

export const getAllPostPaths = async (): Promise<PostPath[]> => {
  const MARKDOWN_FILE_EXTENSION_REG_EXP = RegExp(/\.md$/);
  const markdownFilePaths = await getPostMarkdownFilePaths();

  const paths = markdownFilePaths.map((markdownFilePath) => {
    const [subdirectory, fileName] = markdownFilePath.split('/');
    const id = fileName.replace(MARKDOWN_FILE_EXTENSION_REG_EXP, '');

    return { id, subdirectory };
  });

  return paths;
};

export const getPostTags = async () => {
  const postPreviews = await getSortedPostPreviews();

  return Array.from(new Set(postPreviews.map(({ tag }) => tag))).sort();
};

export const getAdjacentPostPreviews = async (postId: string) => {
  const postPreviews = await getSortedPostPreviews();
  const currentIndex = postPreviews.findIndex(({ id }) => id === postId);

  if (currentIndex === -1) {
    return { newerPost: undefined, olderPost: undefined };
  }

  return {
    newerPost: postPreviews[currentIndex - 1],
    olderPost: postPreviews[currentIndex + 1],
  };
};

export const getSortedPostPreviews = async () => {
  const filePaths = await getPostMarkdownFilePaths();
  const allPosts = await Promise.all(filePaths.map(getPostPreview));

  const sortedAllPosts = [...allPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );

  return sortedAllPosts;
};

const getPostMarkdownFilePaths = async () => {
  const directories = await fs.promises.readdir(POST_DIRECTORY);
  const filePaths = await Promise.all(directories.map(getMarkdownFileNames));
  return filePaths.flat();
};

const getMarkdownFileNames = async (directory: string) => {
  const fileNames = await fs.promises.readdir(`${POST_DIRECTORY}/${directory}`);

  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => `${directory}/${fileName}`);
};

const getPostPreview = async (fileName: string): Promise<PostPreview> => {
  const id = fileName.replace(/\.md$/, '');

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = await fs.promises.readFile(fullPath, 'utf-8');

  const matterResult = matter(fileContents);

  const {
    data: { date, title, tag },
    content,
  } = matterResult;

  return {
    id,
    date,
    title,
    tag,
    content: getPostPreviewDescription(content),
  };
};
