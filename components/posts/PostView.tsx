import { PostData } from "../../types/post.types";
import styles from "./post.module.css";

export type PostViewProps = {
  postData: PostData;
};

const PostView = ({ postData }: PostViewProps) => {
  const { title, date, contentHtml } = postData;

  return (
    <article className="mt-8 pb-24">
      <h1 className="text-4xl font-bold"> {title}</h1>
      <p className="flex mt-2 justify-end text mb-4">{date}</p>
      <div
        className={styles["post-content"]}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
};

export default PostView;
