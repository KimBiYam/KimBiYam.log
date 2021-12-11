import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";

export const parseMarkdown = async (content: string) => {
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(prism as any)
    .process(content);

  return processedContent.toString();
};
