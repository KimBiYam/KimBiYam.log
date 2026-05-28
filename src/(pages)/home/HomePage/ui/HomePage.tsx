import { Suspense } from 'react';

import { PostPreview } from '@src/features/post/types';
import { TagSelectorSkeleton } from '@src/features/tag';
import { ProfileCard } from '@src/shared/ui';
import { PostList } from '@src/widgets/post';

import HomeTagSelector from './HomeTagSelector';

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
        <HomeTagSelector tags={tags} />
      </Suspense>
      <PostList postPreviews={postPreviews} />
    </div>
  );
};

export default HomePage;
