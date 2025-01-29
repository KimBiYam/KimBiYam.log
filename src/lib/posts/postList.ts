import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import RemoveMarkdown from 'remove-markdown';

import { POST_DIRECTORY } from '@src/constants/directories';
import { PostPath, PostPreview } from '@src/types/post.types';

export const getAllPostPaths = async (): Promise<{ params: PostPath }[]> => {
  const MARKDOWN_FILE_EXTENSION_REG_EXP = RegExp(/\.md$/);
  const markdownFilePaths = await getPostMarkdownFilePaths();

  const paths = markdownFilePaths.map((markdownFilePath) => {
    const [subdirectory, fileName] = markdownFilePath.split('/');
    const id = fileName.replace(MARKDOWN_FILE_EXTENSION_REG_EXP, '');

    return {
      params: {
        id,
        subdirectory,
      },
    };
  });

  return paths;
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

export const getPostPreviewDescription = (content: string) => {
  const POST_PREVIEW_CONTENT_MAX_LENGTH = 200;
  const MARKDOWN_CODE_BLOCK_REG_EXP_1 = RegExp(/```([\s\S]*?)```/g);
  const MARKDOWN_CODE_BLOCK_REG_EXP_2 = RegExp(/~~~([\s\S]*?)~~~/g);
  const MARKDOWN_HEADING_REG_EXP = RegExp(/#{1,6}.+(?=\n)/);

  const preProcessedContent = content
    .replace(MARKDOWN_HEADING_REG_EXP, '')
    .replace(MARKDOWN_CODE_BLOCK_REG_EXP_1, '')
    .replace(MARKDOWN_CODE_BLOCK_REG_EXP_2, '');

  let description = RemoveMarkdown(preProcessedContent, {
    useImgAltText: false,
  }).slice(0, POST_PREVIEW_CONTENT_MAX_LENGTH);

  if (content.length >= POST_PREVIEW_CONTENT_MAX_LENGTH) {
    description += '...';
  }

  return description;
};
