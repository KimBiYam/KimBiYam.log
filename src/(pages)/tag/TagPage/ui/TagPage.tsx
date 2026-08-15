import { PostPreview } from '@src/features/post/types';
import { ProfileCard } from '@src/shared/ui';
import { PostIndex } from '@src/widgets/post';

interface TagPageProps {
  postPreviews: PostPreview[];
  tags: string[];
}

const TagPage = ({ postPreviews, tags }: TagPageProps) => (
  <PostIndex
    postPreviews={postPreviews}
    profile={<ProfileCard />}
    tags={tags}
  />
);

export default TagPage;
