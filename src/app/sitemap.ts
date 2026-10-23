import { MetadataRoute } from 'next';

import { PostPreview } from '@src/features/post/client';
import { getPostTags, getSortedPostPreviews } from '@src/features/post/server';
import { DOMAIN_URL } from '@src/shared';

const getLastModified = ({ date, updated }: PostPreview) => updated ?? date;

const getLatestModified = (postPreviews: PostPreview[]) =>
  postPreviews.map(getLastModified).sort().at(-1);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postPreviews = await getSortedPostPreviews();
  const tags = await getPostTags();

  return [
    {
      url: DOMAIN_URL,
      lastModified: getLatestModified(postPreviews),
    },
    ...tags.map((tag) => ({
      url: `${DOMAIN_URL}/tags/${encodeURIComponent(tag)}`,
      lastModified: getLatestModified(
        postPreviews.filter((post) => post.tag === tag),
      ),
    })),
    ...postPreviews.map((postPreview) => ({
      url: `${DOMAIN_URL}/posts/${postPreview.id}`,
      lastModified: getLastModified(postPreview),
    })),
  ];
}
