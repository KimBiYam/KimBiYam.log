import { FEED_ALTERNATE_TYPES } from '@src/shared/constants/metadata';
import { getSiteJsonLd, serializeJsonLd } from '@src/shared/utils';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/', types: FEED_ALTERNATE_TYPES },
};

const Page = () => {
  const siteJsonLd = getSiteJsonLd();

  return (
    <>
      <h1 className="sr-only">KimBiYam.log</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
      />
    </>
  );
};

export default Page;
