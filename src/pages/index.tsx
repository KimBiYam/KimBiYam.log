import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import PageHead from '../components/base/PageHead';
import ProfileCard from '../components/base/ProfileCard';
import PostList from '../components/posts/PostList';
import TagSelector from '../components/posts/TagSelector';
import { Tag } from '../constants';
import useTag from '../hooks/useTag';
import { getSortedPostPreviews } from '../lib/posts/post';
import { PostPreview } from '../types/post.types';

interface HomeProps {
  postPreviews: PostPreview[];
}

const Home = ({ postPreviews }: HomeProps) => {
  const router = useRouter();
  const { selectedTag, handleTagClick } = useTag(router);

  const tags = useMemo(
    () => [
      Tag.all,
      ...Array.from(
        new Set(postPreviews.map((postPreview) => postPreview.tag)),
      ).sort(),
    ],
    [postPreviews],
  );

  return (
    <>
      <PageHead title="Main" description="KimBiYam의 개발 블로그 입니다." />
      <div className="pb-12">
        <div className="my-2">
          <ProfileCard />
        </div>
        <TagSelector
          tags={tags}
          onTagClick={handleTagClick}
          selectedTag={selectedTag}
        />
        <PostList postPreviews={postPreviews} selectedTag={selectedTag} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const postPreviews = getSortedPostPreviews();

  return {
    props: {
      postPreviews,
    },
  };
};

export default Home;
