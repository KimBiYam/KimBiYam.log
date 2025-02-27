import { captureException } from '@sentry/nextjs';
import { Metadata } from 'next';

import { generateOpenGraphMetaData } from '@src/app/metadataBase';
import ProfileCard from '@src/components/base/ProfileCard';
import PostShareButtons from '@src/components/posts/PostShareButtons';
import PostView from '@src/components/posts/PostView';
import Utterances from '@src/components/posts/Utterances';
import { POST_DIRECTORY } from '@src/constants/directories';
import { getPostDetail } from '@src/lib/posts/postDetail';
import { getPostImageSizes } from '@src/lib/posts/postImage';
import { getAllPostPaths } from '@src/lib/posts/postList';
import { PostPath } from '@src/types/post.types';

export async function generateStaticParams() {
  const paths = await getAllPostPaths();
  return paths;
}

export async function generateMetadata(props: {
  params: Promise<PostPath>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const subdirectory = params?.subdirectory;
    const id = String(params?.id);

    const postDetail = await getPostDetail(
      `${POST_DIRECTORY}/${subdirectory}`,
      id,
    );

    const { title, description } = postDetail;

    return {
      title,
      description,
      openGraph: generateOpenGraphMetaData({
        type: 'article',
        title,
        description,
        path: `/posts/${subdirectory}/${id}`,
        ogImageTitle: title,
      }),
    };
  } catch (e) {
    captureException(e);
    return {};
  }
}

export default async function PostDetailPage(props: {
  params: Promise<PostPath>;
}) {
  const params = await props.params;
  const subdirectory = params?.subdirectory;
  const id = String(params?.id);

  const postDetail = await getPostDetail(
    `${POST_DIRECTORY}/${subdirectory}`,
    id,
  );

  const imageSizes = getPostImageSizes(postDetail.contentHtml);

  return (
    <div>
      <PostView postDetail={postDetail} imageSizes={imageSizes} />
      <PostShareButtons postDetail={postDetail} />
      <div className="py-4 my-10 border-t border-b">
        <ProfileCard />
      </div>
      <Utterances />
    </div>
  );
}
