import RemoveMarkdown from 'remove-markdown';

export const getPostPreviewDescription = (content: string) => {
  const POST_PREVIEW_CONTENT_MAX_LENGTH = 200;
  return getPostDescription(content, {
    maxLength: POST_PREVIEW_CONTENT_MAX_LENGTH,
    shouldTrim: false,
    shouldReserveEllipsisLength: false,
  });
};

export const getPostMetaDescription = (content: string) => {
  const POST_META_DESCRIPTION_MAX_LENGTH = 90;
  return getPostDescription(content, {
    maxLength: POST_META_DESCRIPTION_MAX_LENGTH,
    shouldTrim: true,
    shouldReserveEllipsisLength: true,
  });
};

interface GetPostDescriptionOptions {
  maxLength: number;
  shouldReserveEllipsisLength: boolean;
  shouldTrim: boolean;
}

const getPostDescription = (
  content: string,
  {
    maxLength,
    shouldReserveEllipsisLength,
    shouldTrim,
  }: GetPostDescriptionOptions,
) => {
  const MARKDOWN_CODE_BLOCK_REG_EXP_1 = RegExp(/```([\s\S]*?)```/g);
  const MARKDOWN_CODE_BLOCK_REG_EXP_2 = RegExp(/~~~([\s\S]*?)~~~/g);
  const MARKDOWN_HEADING_REG_EXP = RegExp(/#{1,6}.+(?=\n)/);

  const preProcessedContent = content
    .replace(MARKDOWN_HEADING_REG_EXP, '')
    .replace(MARKDOWN_CODE_BLOCK_REG_EXP_1, '')
    .replace(MARKDOWN_CODE_BLOCK_REG_EXP_2, '');

  let description = RemoveMarkdown(preProcessedContent, {
    useImgAltText: false,
  });

  if (shouldTrim) {
    description = description.trim();
  }

  const ELLIPSIS = '...';
  const descriptionMaxLength = shouldReserveEllipsisLength
    ? maxLength - ELLIPSIS.length
    : maxLength;

  description = description.slice(0, descriptionMaxLength);

  if (content.length >= maxLength) {
    description += ELLIPSIS;
  }

  return description;
};
