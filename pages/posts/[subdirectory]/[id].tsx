import { motion } from 'framer-motion';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { getAllPostPaths, getPostDetail } from '../../../lib/posts/post';
import PostView from '../../../components/posts/PostView';
import { POST_DIRECTORY } from '../../../constants';
import PageHead from '../../../components/base/PageHead';
import { slideUpMotion } from '../../../lib/styles/motions';

const Post = ({
  postDetail,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

export const getStaticPaths = async () => {
  const paths = getAllPostPaths();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
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
