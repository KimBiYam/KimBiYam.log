import PageHead from "../components/base/PageHead";
import PostListItem from "../components/posts/PostListItem";
import { getSortedPostPreviews } from "../lib/posts/post";
import { PostPreview } from "../types/post.types";

export type HomeProps = {
  allPosts: PostPreview[];
};

const Home = ({ allPosts }: HomeProps) => {
  return (
    <>
      <PageHead
        title="KimBiYam.log"
        description="KimBiYam의 개발 블로그 입니다."
      />
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
