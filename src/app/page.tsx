import { Suspense } from 'react';

import { getSortedPostPreviews } from '@src/features/post/server';
import { Tag, TagSelector, TagSelectorSkeleton } from '@src/features/tag';
import { DragScrollContainer, ProfileCard } from '@src/shared';
import { PostList } from '@src/widgets/post';

export default async function HomePage() {
  const postPreviews = await getSortedPostPreviews();

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
