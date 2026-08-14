import { notFound } from 'next/navigation';

import { generateOpenGraphMetaData } from '@src/app/metadataBase';
import {
  getPostTags,
  getSortedPostPreviews,
} from '@src/features/post/server';
import { Tag } from '@src/features/tag';
import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import TagPage from '@src/(pages)/tag/TagPage/ui/TagPage';

import type { Metadata } from 'next';

interface TagPath {
  tag: string;
}

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<TagPath[]> => {
  const tags = await getPostTags();

  return tags.map((tag) => ({ tag }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<TagPath>;
}): Promise<Metadata> => {
  const { tag } = await params;
  const tags = await getPostTags();

  if (!tags.includes(tag)) return {};

  const title = `${tag.toUpperCase()} 개발 글`;
  const description = `${tag.toUpperCase()} 주제로 작성한 개발 기록을 모았습니다.`;
  const path = `/tags/${tag}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: generateOpenGraphMetaData({
      path,
      title,
      description,
      imageAlt: title,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogTagImage.src],
    },
  };
};

const Page = async ({ params }: { params: Promise<TagPath> }) => {
  const { tag } = await params;
  const tags = await getPostTags();

  if (!tags.includes(tag)) notFound();

  const postPreviews = await getSortedPostPreviews();

  return (
    <TagPage
      postPreviews={postPreviews}
      tags={[Tag.all, ...tags]}
    />
  );
};

export default Page;
