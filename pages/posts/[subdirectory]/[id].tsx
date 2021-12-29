import { getAllPostPaths, getPostData } from '../../../lib/posts/post';
import { PostData } from '../../../types/post.types';
import PostView from '../../../components/posts/PostView';
import { POST_DIRECTORY } from '../../../constants';
import PageHead from '../../../components/base/PageHead';
import { motion } from 'framer-motion';
import { slideUpMotion } from '../../../lib/styles/motions';

export type PostProps = {
  postData: PostData;
};

const Post = ({ postData }: PostProps) => {
  const { title, description, tag, id } = postData;

  return (
    <>
      <PageHead
        title={title}
        description={description}
        url={`/posts/${tag}/${id}`}
      />
      <motion.div {...slideUpMotion}>
        <PostView postData={postData} />
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
  const postData = await getPostData(`${POST_DIRECTORY}/${subdirectory}`, id);

  return {
    props: {
      postData,
    },
  };
}

export default Post;
