import Head from "next/head";
import PostListItem from "../components/posts/PostListItem";
import getSortedPosts from "../lib/posts/getSortedPosts";
import { PostPreview } from "../types/post.types";

export type HomeProps = {
  allPosts: PostPreview[];
};

const Home = ({ allPosts }: HomeProps) => {
  return (
    <>
      <Head>
        <title>KimBiYam.log</title>
      </Head>
      <div>
        {allPosts.map((postPreview) => (
          <PostListItem
            key={postPreview.id + postPreview.title}
            postPreview={postPreview}
          />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const allPosts = getSortedPosts();

  return {
    props: {
      allPosts,
    },
  };
}

export default Home;
