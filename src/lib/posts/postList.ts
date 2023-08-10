import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import RemoveMarkdown from 'remove-markdown';

import { POST_DIRECTORY } from '../../constants';
import { PostPath, PostPreview } from '../../types/post.types';

export const getAllPostPaths = (): { params: PostPath }[] => {
  const MARKDOWN_FILE_EXTENSION_REG_EXP = RegExp(/\.md$/);
  const markdownFilePaths = getPostMarkdownFilePaths();

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

export const getSortedPostPreviews = () => {
  const filePaths = getPostMarkdownFilePaths();

  const allPosts = filePaths.map(getPostPreview);

  const sortedAllPosts = [...allPosts].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );

  return sortedAllPosts;
};

const getPostMarkdownFilePaths = () => {
  const directories = fs.readdirSync(POST_DIRECTORY);

  return directories.flatMap((directory) => {
    const fileNames = fs.readdirSync(`${POST_DIRECTORY}/${directory}`);
    const markdownFileNames = fileNames.filter((fileName) =>
      fileName.endsWith('.md'),
    );

    return markdownFileNames.map(
      (markdownFileName) => `${directory}/${markdownFileName}`,
    );
  });
};

const getPostPreview = (fileName: string): PostPreview => {
  const id = fileName.replace(/\.md$/, '');

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

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
