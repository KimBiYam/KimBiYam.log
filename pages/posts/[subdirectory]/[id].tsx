import { getAllPostPaths, getPostDetail } from '../../../lib/posts/post';
import { PostDetail } from '../../../types/post.types';
import PostView from '../../../components/posts/PostView';
import { POST_DIRECTORY } from '../../../constants';
import PageHead from '../../../components/base/PageHead';
import { motion } from 'framer-motion';
import { slideUpMotion } from '../../../lib/styles/motions';

export type PostProps = {
  postDetail: PostDetail;
};

const Post = ({ postDetail }: PostProps) => {
  const { title, description, tag, id, ogImagePath } = postDetail;

  return (
    <>
      <PageHead
        title={title}
        description={description}
        url={`/posts/${tag}/${id}`}
        ogImagePath={ogImagePath}
      />
      <motion.div {...slideUpMotion}>
        <PostView postDetail={postDetail} />
      </motion.div>
    </>
  );
};

export async function getStaticPaths() {
  const paths = getAllPostPaths();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params: { subdirectory, id },
}: {
  params: { subdirectory: string; id: string };
}) {
  const postDetail = await getPostDetail(
    `${POST_DIRECTORY}/${subdirectory}`,
    id,
  );

  return {
    props: {
      postDetail,
    },
  };
}

export default Post;
