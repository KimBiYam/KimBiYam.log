import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useAtom } from 'jotai';

import { postPageAtom, type PostPreview } from '@src/features/post/client';
import { Tag, useSelectedTag } from '@src/features/tag';
import { useScrollObserver } from '@src/shared';

import PostListItem from './PostListItem';

const POST_COUNT_BY_PAGE = 10;

interface PostListProps {
  postPreviews: PostPreview[];
}

const PostList = ({ postPreviews }: PostListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [postPage, setPostPage] = useAtom(postPageAtom);
  const selectedTag = useSelectedTag();

  const handleIntersect = useCallback(
    () => setPostPage((prev) => prev + 1),
    [setPostPage],
  );

  useScrollObserver({
    enabled: postPreviews.length > POST_COUNT_BY_PAGE * postPage,
    onIntersect: handleIntersect,
    targetRef: scrollRef,
  });

  // Reset postPage when unmounting to prevent hydration mismatch on back navigation
  useEffect(() => {
    return () => setPostPage(1);
  }, [setPostPage]);

  const filteredPostPreviews = useMemo(
    () =>
      postPreviews
        .filter(
          (postPreview) =>
            selectedTag === Tag.all || postPreview.tag === selectedTag,
        )
        .splice(0, postPage * POST_COUNT_BY_PAGE),
    [postPreviews, selectedTag, postPage],
  );

  return (
    <>
      <ul>
        {filteredPostPreviews.map((postPreview) => (
          <PostListItem
            key={postPreview.id + postPreview.title}
            postPreview={postPreview}
          />
        ))}
      </ul>
      <div ref={scrollRef} />
    </>
  );
};

export default PostList;
