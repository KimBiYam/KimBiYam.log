import { remark } from "remark";
import remarkHtml from "remark-html";

export const parseMarkdown = async (content: string) => {
  const processedContent = await remark().use(remarkHtml).process(content);

  return processedContent;
};
