'use client';

import { useRef, useState } from 'react';
import { useAtom } from 'jotai';

import { postListPageAtom } from '@src/features/post/client';
import { PostPreview } from '@src/features/post/types';
import { usePointerSpotlight, useScrollObserver } from '@src/shared';

import PostFeaturedItem from './PostFeaturedItem';
import PostListItem from './PostListItem';

const POST_COUNT_BY_PAGE = 16;

interface PostListProps {
  fadeInFirstPage: boolean;
  postPreviews: PostPreview[];
  tag: string;
}

const PostList = ({ fadeInFirstPage, postPreviews, tag }: PostListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const spotlightRef = usePointerSpotlight<HTMLDivElement>();
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

  const [featuredPostPreview, ...gridPostPreviews] = visiblePostPreviews;

  return (
    <div ref={spotlightRef}>
      {featuredPostPreview && (
        <PostFeaturedItem
          postPreview={featuredPostPreview}
          fadeIn={fadeInFirstPage}
        />
      )}
      <ul
        aria-label="최근 글"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {gridPostPreviews.map((postPreview, index) => (
          <PostListItem
            key={postPreview.id + postPreview.title}
            postPreview={postPreview}
            fadeIn={fadeInFirstPage || index + 1 >= restoredCount}
          />
        ))}
      </ul>
      <div ref={scrollRef} />
    </div>
  );
};

export default PostList;
