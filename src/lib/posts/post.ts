import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import removeMarkdown from 'remove-markdown';

import { POST_DIRECTORY } from '../../constants';
import { PostDetail, PostPath, PostPreview } from '../../types/post.types';
import { getMarkdownData } from './markdown';

const MARKDOWN_FILE_EXTENSION_REG_EXP = RegExp(/\.md$/);
const LINE_BREAK_REG_EXP = RegExp(/\n/g);

export const getAllPostPaths = (): { params: PostPath }[] => {
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

export const getPostDetail = async (
  directory: string,
  id: string,
): Promise<PostDetail> => {
  const {
    matterResult: { data, content },
    contentHtml,
  } = await getMarkdownData(directory, id);

  const description = removeMarkdown(content).replace(LINE_BREAK_REG_EXP, '');
  const { title, date, tag, ...rest } = data;

  return {
    id,
    title,
    date,
    tag,
    contentHtml,
    description,
    ...rest,
  };
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

  const markdownFilePaths = directories.map((directory) => {
    const fileNames = fs.readdirSync(`${POST_DIRECTORY}/${directory}`);
    const markdownFileNames = fileNames.filter((fileName) =>
      fileName.endsWith('.md'),
    );

    return markdownFileNames.map(
      (markdownFileName) => `${directory}/${markdownFileName}`,
    );
  });

  return markdownFilePaths.flat();
};

const getPostPreview = (fileName: string): PostPreview => {
  const POST_PREVIEW_BEFORE_REMOVED_MAX_LENGTH = 500;
  const POST_PREVIEW_CONTENT_MAX_LENGTH = 200;
  const MARKDOWN_CODE_BLOCK_REG_EXP_1 = RegExp(/```([\s\S]*?)```/g);
  const MARKDOWN_CODE_BLOCK_REG_EXP_2 = RegExp(/~~~([\s\S]*?)~~~/g);
  const MARKDOWN_HEADING_REG_EXP = RegExp(/#{1,6}.+(?=\n)/);

  const id = fileName.replace(/\.md$/, '');

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

  const matterResult = matter(fileContents);

  const {
    data: { date, title, tag },
    content: fullContent,
  } = matterResult;

  const preProcessedContent = fullContent
    .slice(0, POST_PREVIEW_BEFORE_REMOVED_MAX_LENGTH)
    .replace(MARKDOWN_HEADING_REG_EXP, '')
    .replace(MARKDOWN_CODE_BLOCK_REG_EXP_1, '')
    .replace(MARKDOWN_CODE_BLOCK_REG_EXP_2, '');

  let content = removeMarkdown(preProcessedContent, {
    useImgAltText: false,
  }).slice(0, POST_PREVIEW_CONTENT_MAX_LENGTH);

  if (content.length >= POST_PREVIEW_CONTENT_MAX_LENGTH) {
    content += '...';
  }

  return {
    id,
    date,
    title,
    tag,
    content,
  };
};
