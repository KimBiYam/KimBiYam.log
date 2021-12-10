import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkPrism from "remark-prism";

export const parseMarkdown = async (content: string) => {
  const processedContent = await remark()
    .use(remarkPrism as any)
    .use(remarkHtml)
    .process(content);

  return processedContent.toString();
};
