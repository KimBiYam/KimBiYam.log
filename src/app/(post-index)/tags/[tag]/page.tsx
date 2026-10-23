import { notFound } from 'next/navigation';

import { generateOpenGraphMetaData } from '@src/app/metadataBase';
import {
  getPostTags,
  getSortedPostPreviews,
  getTagJsonLd,
} from '@src/features/post/server';
import ogTagImage from '@src/shared/assets/images/og_tag_image.png';
import {
  FEED_ALTERNATE_TYPES,
  PAGE_TITLE_SUFFIX,
} from '@src/shared/constants/metadata';
import { serializeJsonLd } from '@src/shared/utils';

import type { Metadata } from 'next';

interface TagPath {
  tag: string;
}

export const dynamicParams = false;

export const generateStaticParams = async (): Promise<TagPath[]> => {
  const tags = await getPostTags();

  return tags.map((tag) => ({ tag }));
};

const getTagPageText = (tag: string) => ({
  title: `${tag.toUpperCase()} 태그 글 목록`,
  description: `${tag.toUpperCase()} 주제로 작성한 개발 기록을 모았습니다.`,
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<TagPath>;
}): Promise<Metadata> => {
  const { tag } = await params;
  const tags = await getPostTags();

  if (!tags.includes(tag)) return {};

  const { title, description } = getTagPageText(tag);
  const socialTitle = `${title}${PAGE_TITLE_SUFFIX}`;
  const path = `/tags/${encodeURIComponent(tag)}`;

  return {
    title,
    description,
    alternates: { canonical: path, types: FEED_ALTERNATE_TYPES },
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

  const { title, description } = getTagPageText(tag);
  const postPreviews = (await getSortedPostPreviews()).filter(
    (postPreview) => postPreview.tag === tag,
  );
  const tagJsonLd = getTagJsonLd({ tag, title, description, postPreviews });

  return (
    <>
      <h1 className="sr-only">{title}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(tagJsonLd) }}
      />
    </>
  );
};

export default Page;
