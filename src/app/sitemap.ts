import { MetadataRoute } from 'next';

import { DOMAIN_URL } from '@src/constants/server';
import { getAllPostPaths } from '@src/lib/posts/postList';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postPaths = await getAllPostPaths();

  return [
    {
      url: DOMAIN_URL,
      lastModified: new Date(),
    },
    ...postPaths.map(({ params: { id, subdirectory } }) => ({
      url: `${DOMAIN_URL}/posts/${subdirectory}/${id}`,
      lastModified: new Date(),
    })),
  ];
}
