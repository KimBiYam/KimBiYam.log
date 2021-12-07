import getAllPostIds from "../../lib/posts/getAllPostIds";
import getPostData from "../../lib/posts/getPostData";
import { PostData } from "../../types/post.types";

export type PostProps = {
  postData: PostData;
};

const Post = ({ postData }: PostProps) => {
  const { id, date, content } = postData;

  return (
    <div>
      <p>{id}</p>
      <p>{date}</p>
      <p>{content}</p>
    </div>
  );
};

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params;
  const postData = getPostData(id);

  return {
    props: {
      postData,
    },
  };
}

export default Post;
