'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useAtom } from 'jotai';

import { postPageAtom, PostPreview } from '@src/features/post/client';
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

  useEffect(() => {
    setPostPage(1);
  }, [selectedTag, setPostPage]);

  const handleIntersect = useCallback(
    () => setPostPage((prev) => prev + 1),
    [setPostPage],
  );

  useScrollObserver({
    enabled: postPreviews.length > POST_COUNT_BY_PAGE * postPage,
    onIntersect: handleIntersect,
    targetRef: scrollRef,
  });

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
    <ul>
      {filteredPostPreviews.map((postPreview) => (
        <PostListItem
          key={postPreview.id + postPreview.title}
          postPreview={postPreview}
        />
      ))}
      <div ref={scrollRef} />
    </ul>
  );
};

export default PostList;
