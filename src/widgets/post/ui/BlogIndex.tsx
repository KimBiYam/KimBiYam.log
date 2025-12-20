import { Suspense } from 'react';

import { TagSelector, TagSelectorSkeleton } from '@src/features/tag';
import { DragScrollContainer } from '@src/shared';
import { PostList } from '@src/widgets/post';
import type { PostPreview } from '@src/features/post/types';

interface Props {
  postPreviews: PostPreview[];
  tags: string[];
}

export const BlogIndex = ({ postPreviews, tags }: Props) => {
  return (
    <>
      <Suspense fallback={<TagSelectorSkeleton />}>
        <DragScrollContainer>
          <TagSelector tags={tags} />
        </DragScrollContainer>
      </Suspense>
      <PostList postPreviews={postPreviews} />
    </>
  );
};
