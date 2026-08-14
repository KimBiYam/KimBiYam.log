import { PostPreview } from '@src/features/post/types';
import { ProfileCard } from '@src/shared/ui';
import { PostIndex } from '@src/widgets/post';

interface HomePageProps {
  postPreviews: PostPreview[];
  tags: string[];
}

const HomePage = ({ postPreviews, tags }: HomePageProps) => {
  return (
    <PostIndex
      postPreviews={postPreviews}
      profile={<ProfileCard />}
      tags={tags}
    />
  );
};

export default HomePage;
