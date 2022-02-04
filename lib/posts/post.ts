import { getMarkdownData } from './markdown';
import { PostDetail, PostPath, PostPreview } from '../../types/post.types';
import { POST_DIRECTORY } from '../../constants';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import removeMarkdown from 'remove-markdown';

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
  const POST_PREVIEW_CONTENT_MAX_LENGTH = 200;

  const id = fileName.replace(/\.md$/, '');

  const fullPath = path.join(POST_DIRECTORY, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

  const matterResult = matter(fileContents);

  const {
    data: { date, title, tag },
    content,
  } = matterResult;

  const slicedContent = content.substring(0, POST_PREVIEW_CONTENT_MAX_LENGTH);
  const previewContent = removeMarkdown(slicedContent) + '...';

  return { id, date, title, tag, content: previewContent };
};
