import { getSortedPostPreviews } from '@src/features/post/server';
import { Tag } from '@src/features/tag';
import { getSiteJsonLd, serializeJsonLd } from '@src/shared/utils';
import HomePage from '@src/(pages)/home/HomePage/ui/HomePage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Page() {
  const postPreviews = await getSortedPostPreviews();
  const siteJsonLd = getSiteJsonLd();

  const tags = [
    Tag.all,
    ...Array.from(
      new Set(postPreviews.map((postPreview) => postPreview.tag)),
    ).sort(),
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
      />
      <HomePage postPreviews={postPreviews} tags={tags} />
    </>
  );
}
