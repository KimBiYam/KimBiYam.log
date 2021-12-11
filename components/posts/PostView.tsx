import { PostData } from "../../types/post.types";

export type PostViewProps = {
  postData: PostData;
};

const PostView = ({ postData }: PostViewProps) => {
  const { title, date, contentHtml } = postData;

  return (
    <article className="mt-8 pb-24">
      <h1 className="text-4xl font-bold sm:text-2xl"> {title}</h1>
      <p className="flex mt-2 mb-4 text-sm">{date}</p>
      <div className="flex justify-center">
        <div
          className="w-full prose dark:prose-dark sm:prose-sm md:prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </article>
  );
};

export default PostView;
