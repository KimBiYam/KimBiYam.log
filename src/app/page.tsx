import { Suspense } from 'react';

import DragScrollContainer from '@src/components/base/DragScrollContainer';
import ProfileCard from '@src/components/base/ProfileCard';
import PostList from '@src/components/posts/PostList';
import TagSelector from '@src/components/posts/TagSelector';
import TagSelectorSkeleton from '@src/components/posts/TagSelectorSkeleton';
import { Tag } from '@src/constants/enums';
import { getSortedPostPreviews } from '@src/lib/posts/postList';

export default function HomePage() {
  const postPreviews = getSortedPostPreviews();

  const tags = [
    Tag.all,
    ...Array.from(
      new Set(postPreviews.map((postPreview) => postPreview.tag)),
    ).sort(),
  ];

  return (
    <div className="pb-12">
      <div className="my-2">
        <ProfileCard />
      </div>
      <Suspense fallback={<TagSelectorSkeleton />}>
        <DragScrollContainer>
          <TagSelector tags={tags} />
        </DragScrollContainer>
      </Suspense>
      <PostList postPreviews={postPreviews} />
    </div>
  );
}
