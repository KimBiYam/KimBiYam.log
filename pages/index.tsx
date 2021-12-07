import Head from "next/head";
import PostListItem from "../components/posts/PostListItem";
import getSortedPostPreviews from "../lib/posts/getSortedPostPreviews";
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
  const allPosts = getSortedPostPreviews();

  return {
    props: {
      allPosts,
    },
  };
}

export default Home;
