import { captureException } from '@sentry/nextjs';
import { Metadata } from 'next';

import { generateOpenGraphMetaData } from '@src/app/metadataBase';
import { PostPath } from '@src/features/post/client';
import PostPage from '@src/(pages)/post/PostPage/ui/PostPage';
import { POST_DIRECTORY } from '@src/features/post/constants/directories';
import {
  getPostDetail,
  getPostImageSizes,
  getPostJsonLd,
  getAllPostPaths,
  getAdjacentPostPreviews,
} from '@src/features/post/server';
import { PROFILE } from '@src/shared/constants/profile';
import { DEPLOYMENT_URL, DOMAIN_URL } from '@src/shared/constants/server';
import { serializeJsonLd } from '@src/shared/utils';

export async function generateStaticParams() {
  return getAllPostPaths();
}

export const dynamicParams = false;

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
    const socialImageUrl = ogImagePath
      ? `${DOMAIN_URL}${ogImagePath}`
      : `${DEPLOYMENT_URL}${path}/opengraph-image`;

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
        imagePath: socialImageUrl,
        imageAlt: title,
        publishedTime: date,
        authors: [PROFILE.name],
        tags: [tag],
      }),
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [{ url: socialImageUrl, alt: title }],
      },
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

  const [postDetail, { newerPost, olderPost }] = await Promise.all([
    getPostDetail(`${POST_DIRECTORY}/${subdirectory}`, id),
    getAdjacentPostPreviews(`${subdirectory}/${id}`),
  ]);
  const path = `/posts/${subdirectory}/${id}`;
  const postJsonLd = getPostJsonLd({ path, postDetail });

  const imageSizes = getPostImageSizes(postDetail.contentHtml);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(postJsonLd) }}
      />
      <PostPage
        canonicalPath={path}
        postDetail={postDetail}
        imageSizes={imageSizes}
        newerPost={newerPost}
        olderPost={olderPost}
      />
    </>
  );
}
