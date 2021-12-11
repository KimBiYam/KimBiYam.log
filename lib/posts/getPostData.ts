import { getMarkdownData, parseMarkdown } from "./markdown";
import { PostData } from "../../types/post.types";

const getPostData = async (
  directory: string,
  id: string
): Promise<PostData> => {
  const {
    matterResult: {
      data: { title, date },
    },
    contentHtml,
  } = await getMarkdownData(directory, id);

  return {
    id,
    title,
    date,
    contentHtml,
  };
};

export default getPostData;
