import { notFound } from 'next/navigation';

import { PostDetail } from '@src/features/post/client';

import { getPostMetaDescription } from './postDescription';
import { getMarkdownData } from './markdown';

export const getPostDetail = async (
  directory: string,
  id: string,
): Promise<PostDetail> => {
  try {
    const LINE_BREAK_REG_EXP = RegExp(/\n/g);

    const {
      matterResult: { data, content },
      contentHtml,
    } = await getMarkdownData(directory, id);

    const description = getPostMetaDescription(content).replace(
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
  } catch (e) {
    if (e instanceof Error && (e as NodeJS.ErrnoException).code === 'ENOENT') {
      notFound();
    }
    throw e;
  }
};
