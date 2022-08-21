import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { m } from 'framer-motion';
import { GetStaticProps } from 'next';

import PageHead from '../components/base/PageHead';
import ProfileCard from '../components/base/ProfileCard';
import PostList from '../components/posts/PostList';
import TagSelector from '../components/posts/TagSelector';
import { Tag } from '../constants';
import useTag from '../hooks/useTag';
import { getSortedPostPreviews } from '../lib/posts/post';
import { routingMotion } from '../lib/styles/motions';
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
      <PageHead title="Home" />
      <m.div className="pb-12" {...routingMotion}>
        <div className="my-2">
          <ProfileCard />
        </div>
        <TagSelector
          tags={tags}
          onTagClick={handleTagClick}
          selectedTag={selectedTag}
        />
        <PostList postPreviews={postPreviews} selectedTag={selectedTag} />
      </m.div>
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
