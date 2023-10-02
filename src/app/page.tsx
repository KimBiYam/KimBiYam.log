import DragScrollContainer from '../components/base/DragScrollContainer';
import PageRoutingAnimation from '../components/base/PageRoutingAnimation';
import ProfileCard from '../components/base/ProfileCard';
import PostList from '../components/posts/PostList';
import TagSelector from '../components/posts/TagSelector';
import { Tag } from '../constants';
import { getSortedPostPreviews } from '../lib/posts/postList';

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
        <TagSelector tags={tags} />
      </DragScrollContainer>
      <PostList postPreviews={postPreviews} />
    </PageRoutingAnimation>
  );
}
