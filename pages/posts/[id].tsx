import getAllPostIds from "../../lib/posts/getAllPostIds";

export type PostProps = {};

const Post = () => {
  return <div></div>;
};

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {},
  };
}

export default Post;
