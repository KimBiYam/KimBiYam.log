import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { GetStaticProps } from 'next';

import PageRoutingAnimation from '../components/base/PageRoutingAnimation';
import ProfileCard from '../components/base/ProfileCard';
import SEO from '../components/base/SEO';
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
      <SEO title="Home" path={router.asPath} />
      <PageRoutingAnimation className="pb-12">
        <div className="my-2">
          <ProfileCard />
        </div>
        <TagSelector
          tags={tags}
          onTagClick={handleTagClick}
          selectedTag={selectedTag}
        />
        <PostList postPreviews={postPreviews} selectedTag={selectedTag} />
      </PageRoutingAnimation>
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
