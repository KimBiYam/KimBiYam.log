import { MetadataRoute } from 'next';

import { getAllPostPaths } from '@src/features/post/server';
import { DOMAIN_URL } from '@src/shared';

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
