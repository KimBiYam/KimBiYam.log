import { Suspense } from 'react';

import { PostPreview } from '@src/features/post/types';
import { TagSelector, TagSelectorSkeleton } from '@src/features/tag';
import { DragScrollContainer, ProfileCard } from '@src/shared/ui';
import { PostList } from '@src/widgets/post';

interface HomePageProps {
  postPreviews: PostPreview[];
  tags: string[];
}

const HomePage = ({ postPreviews, tags }: HomePageProps) => {
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
};

export default HomePage;
