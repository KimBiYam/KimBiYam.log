import { PostData } from "../../types/post.types";

export type PostViewProps = {
  postData: PostData;
};

const PostView = ({ postData }: PostViewProps) => {
  const { title, date, contentHtml } = postData;

  return (
    <article className="mt-8 pb-24">
      <h1 className="text-4xl font-bold sm:text-2xl"> {title}</h1>
      <p className="flex mt-2 justify-end text mb-4">{date}</p>
      <div
        className="prose sm:prose-sm md:prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
};

export default PostView;
