import Head from "next/head";
import PostListItem from "../components/posts/PostListItem";
import getSortedPosts from "../lib/posts/getSortedPosts";
import { PostData } from "../types/post.types";

export type HomeProps = {
  allPosts: PostData[];
};

const Home = ({ allPosts }: HomeProps) => {
  return (
    <>
      <Head>
        <title>KimBiYam.log</title>
      </Head>
      <div>
        {allPosts.map((postData) => (
          <PostListItem
            key={postData.id + postData.title}
            postData={postData}
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
