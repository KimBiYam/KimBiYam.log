import { PostData } from "../../types/post.types";

export type PostViewProps = {
  postData: PostData;
};

const PostView = ({ postData }: PostViewProps) => {
  const { title, date, contentHtml } = postData;

  return (
    <article className="mt-8">
      <h1 className="text-3xl font-bold"> {title}</h1>
      <p className="flex mt-2 justify-end text-sm">{date}</p>
      <div className="mt-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
};

export default PostView;
