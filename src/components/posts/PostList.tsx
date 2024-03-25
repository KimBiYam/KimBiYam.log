'use client';

import { useCallback, useMemo, useRef } from 'react';

import { useAtom } from 'jotai';

import postPageAtom from '@src/atoms/postPageAtom';
import { Tag } from '@src/constants/enums';
import useScrollObserver from '@src/hooks/useScrollObserver';
import { useSelectedTag } from '@src/hooks/useTag';
import { PostPreview } from '@src/types/post.types';

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
    <ul className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2 lg:grid-cols-3">
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
