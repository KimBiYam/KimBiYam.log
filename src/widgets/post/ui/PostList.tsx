'use client';

import { useRef, useState } from 'react';
import { useAtom } from 'jotai';

import { postListPageAtom } from '@src/features/post/client';
import { PostPreview } from '@src/features/post/types';
import { useScrollObserver } from '@src/shared';

import PostListItem from './PostListItem';

const POST_COUNT_BY_PAGE = 10;

interface PostListProps {
  fadeInFirstPage: boolean;
  postPreviews: PostPreview[];
  tag: string;
}

const PostList = ({ fadeInFirstPage, postPreviews, tag }: PostListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [postPages, setPostPages] = useAtom(postListPageAtom);
  const postPage = postPages[tag] ?? 1;
  // Items already shown when this list mounted (restored on back navigation)
  // render immediately; only pages loaded afterwards fade in.
  const [restoredCount] = useState(POST_COUNT_BY_PAGE * postPage);

  const handleIntersect = () =>
    setPostPages((prev) => ({ ...prev, [tag]: (prev[tag] ?? 1) + 1 }));

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
          fadeIn={fadeInFirstPage || index >= restoredCount}
        />
      ))}
      <div ref={scrollRef} />
    </ul>
  );
};

export default PostList;
