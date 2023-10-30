import { PostDetail } from '@src/types/post.types';

import { getMarkdownData } from './markdown';
import { getPostPreviewDescription } from './postList';

export const getPostDetail = async (
  directory: string,
  id: string,
): Promise<PostDetail> => {
  const LINE_BREAK_REG_EXP = RegExp(/\n/g);

  const {
    matterResult: { data, content },
    contentHtml,
  } = await getMarkdownData(directory, id);

  const description = getPostPreviewDescription(content).replace(
    LINE_BREAK_REG_EXP,
    '',
  );
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
