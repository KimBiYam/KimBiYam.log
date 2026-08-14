import { MetadataRoute } from 'next';

import { getPostTags, getSortedPostPreviews } from '@src/features/post/server';
import { DOMAIN_URL } from '@src/shared';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postPreviews = await getSortedPostPreviews();
  const tags = await getPostTags();
  const latestPostDate = postPreviews[0]?.date;

  return [
    {
      url: DOMAIN_URL,
      lastModified: latestPostDate,
    },
    ...tags.map((tag) => ({
      url: `${DOMAIN_URL}/tags/${tag}`,
      lastModified: postPreviews.find((post) => post.tag === tag)?.date,
    })),
    ...postPreviews.map(({ date, id }) => ({
      url: `${DOMAIN_URL}/posts/${id}`,
      lastModified: date,
    })),
  ];
}
