import { MetadataRoute } from 'next';

import { DOMAIN_URL } from '../constants';
import { getAllPostPaths } from '../lib/posts/postList';

export default function sitemap(): MetadataRoute.Sitemap {
  const postPaths = getAllPostPaths();

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
