import { notFound } from 'next/navigation';

import { generateOpenGraphMetaData } from '@src/app/metadataBase';
import { getPostTags } from '@src/features/post/server';
import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import { PAGE_TITLE_SUFFIX } from '@src/shared/constants/metadata';

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

  const title = `${tag.toUpperCase()} 태그 글 목록`;
  const socialTitle = `${title}${PAGE_TITLE_SUFFIX}`;
  const description = `${tag.toUpperCase()} 주제로 작성한 개발 기록을 모았습니다.`;
  const path = `/tags/${encodeURIComponent(tag)}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: generateOpenGraphMetaData({
      path,
      title,
      description,
      imageAlt: socialTitle,
    }),
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogTagImage.src],
    },
  };
};

const Page = async ({ params }: { params: Promise<TagPath> }) => {
  const { tag } = await params;
  const tags = await getPostTags();

  if (!tags.includes(tag)) notFound();

  return null;
};

export default Page;
