import { captureException } from '@sentry/nextjs';
import { Metadata } from 'next';

import { generateOpenGraphMetaData } from '@src/app/metadataBase';
import { PostPath } from '@src/features/post/client';
import PostPage from '@src/(pages)/post/PostPage/ui/PostPage';
import { POST_DIRECTORY } from '@src/features/post/constants/directories';
import {
  getPostDetail,
  getPostImageSizes,
  getAllPostPaths,
} from '@src/features/post/server';
import { PROFILE } from '@src/shared/constants/profile';
import { DOMAIN_URL } from '@src/shared/constants/server';

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

    const { date, description, ogImagePath, tag, title } = postDetail;
    const path = `/posts/${subdirectory}/${id}`;

    return {
      title,
      description,
      alternates: {
        canonical: `${DOMAIN_URL}${path}`,
      },
      openGraph: generateOpenGraphMetaData({
        type: 'article',
        title,
        description,
        path,
        imagePath: ogImagePath,
        publishedTime: date,
        authors: [PROFILE.name],
        tags: [tag],
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

  return <PostPage postDetail={postDetail} imageSizes={imageSizes} />;
}
