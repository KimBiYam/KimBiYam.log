import { Suspense } from 'react';

import DragScrollContainer from '@src/components/base/DragScrollContainer';
import PageRoutingAnimation from '@src/components/base/PageRoutingAnimation';
import ProfileCard from '@src/components/base/ProfileCard';
import PostList from '@src/components/posts/PostList';
import TagSelector from '@src/components/posts/TagSelector';
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
    <PageRoutingAnimation className="pb-12">
      <div className="my-2">
        <ProfileCard />
      </div>
      <DragScrollContainer>
        <Suspense fallback={null}>
          <TagSelector tags={tags} />
        </Suspense>
      </DragScrollContainer>
      <PostList postPreviews={postPreviews} />
    </PageRoutingAnimation>
  );
}
