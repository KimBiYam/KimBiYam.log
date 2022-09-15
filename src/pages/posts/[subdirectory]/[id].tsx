import { useRouter } from 'next/router';

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

import PageRoutingAnimation from '../../../components/base/PageRoutingAnimation';
import ProfileCard from '../../../components/base/ProfileCard';
import SEO from '../../../components/base/SEO';
import PostShareButtons from '../../../components/posts/PostShareButtons';
import PostView from '../../../components/posts/PostView';
import Utterances from '../../../components/posts/Utterances';
import { POST_DIRECTORY } from '../../../constants';
import { getAllPostPaths, getPostDetail } from '../../../lib/posts/post';
import { PostDetail } from '../../../types/post.types';

const Post = ({
  postDetail,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { title, description, ogImagePath } = postDetail;

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={router.asPath}
        ogImagePath={ogImagePath}
      />
      <PageRoutingAnimation>
        <PostView postDetail={postDetail} />
        <PostShareButtons postDetail={postDetail} />
        <div className="py-4 my-10 border-t border-b">
          <ProfileCard />
        </div>
        <Utterances />
      </PageRoutingAnimation>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostPaths();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  postDetail: PostDetail;
}> = async ({ params }) => {
  const subdirectory = params?.subdirectory;
  const id = String(params?.id);

  const postDetail = await getPostDetail(
    `${POST_DIRECTORY}/${subdirectory}`,
    id,
  );

  return {
    props: {
      postDetail,
    },
  };
};

export default Post;
