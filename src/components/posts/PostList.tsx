import { useAtom } from 'jotai';
import { useCallback, useMemo, useRef } from 'react';
import postPageAtom from '../../atoms/postPageAtom';
import { Tag } from '../../constants';
import useScrollObserver from '../../hooks/useScrollObserver';
import { PostPreview } from '../../types/post.types';
import PostListItem from './PostListItem';

interface PostListProps {
  postPreviews: PostPreview[];
  selectedTag: string;
}

const POST_COUNT_BY_PAGE = 10;

const PostList = ({ postPreviews, selectedTag }: PostListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [postPage, setPostPage] = useAtom(postPageAtom);

  const handleIntersect = useCallback(
    () => setPostPage((prev) => prev + 1),
    [],
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
