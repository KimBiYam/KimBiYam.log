import getAllPostIds from "../../lib/posts/getAllPostIds";
import getPostData from "../../lib/posts/getPostData";
import { PostData } from "../../types/post.types";
import Head from "next/head";
import PostView from "../../components/posts/PostView";

export type PostProps = {
  postData: PostData;
};

const Post = ({ postData }: PostProps) => {
  const { title } = postData;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <PostView postData={postData} />
      </div>
    </>
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
  const postData = await getPostData(id);

  return {
    props: {
      postData,
    },
  };
}

export default Post;
