import { MetadataRoute } from 'next';

import { DOMAIN_URL } from '@src/constants/server';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${DOMAIN_URL}/sitemap.xml`,
  };
}
