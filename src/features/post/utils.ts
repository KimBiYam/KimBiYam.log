import RemoveMarkdown from 'remove-markdown';

export const getPostPreviewDescription = (content: string) => {
  if (!content) return '';
  
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