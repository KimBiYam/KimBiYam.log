import { useCallback, useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import postPageState from '../../atoms/postPageState';
import { Tag } from '../../constants';
import useScrollObserver from '../../hooks/useScrollObserver';
import { PostPreview } from '../../types/post.types';
import PostListItem from './PostListItem';
import { slideUpMotion } from '../../lib/styles/motions';

export type PostListProps = {
  postPreviews: PostPreview[];
  selectedTag: string;
};

const POST_COUNT_BY_PAGE = 10;

const PostList = ({ postPreviews, selectedTag }: PostListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [postPage, setPostPage] = useRecoilState(postPageState);

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
    <motion.div {...slideUpMotion}>
      {filteredPostPreviews.map((postPreview) => (
        <PostListItem
          key={postPreview.id + postPreview.title}
          postPreview={postPreview}
        />
      ))}
      <div ref={scrollRef} />
    </motion.div>
  );
};

export default PostList;
