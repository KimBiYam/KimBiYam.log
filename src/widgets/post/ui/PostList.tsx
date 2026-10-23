'use client';

import { useRef, useState } from 'react';

import { PostPreview } from '@src/features/post/types';
import { useScrollObserver } from '@src/shared';

import PostListItem from './PostListItem';

const POST_COUNT_BY_PAGE = 10;

interface PostListProps {
  fadeInFirstPage: boolean;
  postPreviews: PostPreview[];
}

const PostList = ({ fadeInFirstPage, postPreviews }: PostListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [postPage, setPostPage] = useState(1);

  const handleIntersect = () => setPostPage((prev) => prev + 1);

  useScrollObserver({
    enabled: postPreviews.length > POST_COUNT_BY_PAGE * postPage,
    onIntersect: handleIntersect,
    targetRef: scrollRef,
  });

  const visiblePostPreviews = postPreviews.slice(
    0,
    postPage * POST_COUNT_BY_PAGE,
  );

  return (
    <ul>
      {visiblePostPreviews.map((postPreview, index) => (
        <PostListItem
          key={postPreview.id + postPreview.title}
          postPreview={postPreview}
          fadeIn={fadeInFirstPage || index >= POST_COUNT_BY_PAGE}
        />
      ))}
      <div ref={scrollRef} />
    </ul>
  );
};

export default PostList;
