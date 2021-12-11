import { PostData } from "../../types/post.types";
import MarkdownView from "./MarkdownView";

export type PostViewProps = {
  postData: PostData;
};

const PostView = ({ postData }: PostViewProps) => {
  const { title, date, contentHtml } = postData;

  return (
    <article className="mt-8 pb-24">
      <h1 className="text-4xl font-bold sm:text-2xl"> {title}</h1>
      <p className="flex mt-2 mb-4 text-sm">{date}</p>
      <MarkdownView contentHtml={contentHtml} />
    </article>
  );
};

export default PostView;
