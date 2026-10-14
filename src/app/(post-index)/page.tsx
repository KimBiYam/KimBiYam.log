import { getSiteJsonLd, serializeJsonLd } from '@src/shared/utils';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const Page = () => {
  const siteJsonLd = getSiteJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
    />
  );
};

export default Page;
