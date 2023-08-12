import PageRoutingAnimation from '../../../../components/base/PageRoutingAnimation';
import ProfileCard from '../../../../components/base/ProfileCard';
import PostShareButtons from '../../../../components/posts/PostShareButtons';
import PostView from '../../../../components/posts/PostView';
import Utterances from '../../../../components/posts/Utterances';
import { POST_DIRECTORY } from '../../../../constants';
import { getPostDetail } from '../../../../lib/posts/postDetail';
import { getAllPostPaths } from '../../../../lib/posts/postList';
import { PostPath } from '../../../../types/post.types';

export function generateStaticParams() {
  const paths = getAllPostPaths();
  return paths;
}

export default async function PostDetailPage({ params }: { params: PostPath }) {
  const subdirectory = params?.subdirectory;
  const id = String(params?.id);

  const postDetail = await getPostDetail(
    `${POST_DIRECTORY}/${subdirectory}`,
    id,
  );

  return (
    <PageRoutingAnimation>
      <PostView postDetail={postDetail} />
      <PostShareButtons postDetail={postDetail} />
      <div className="py-4 my-10 border-t border-b">
        <ProfileCard />
      </div>
      <Utterances />
    </PageRoutingAnimation>
  );
}
