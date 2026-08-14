import { DOMAIN_URL, PROFILE } from '@src/shared/constants';

interface SiteJsonLdGraphItem {
  '@type': 'WebSite' | 'Person';
  '@id': string;
  name: string;
  url: string;
  inLanguage?: 'ko-KR';
  sameAs?: string[];
  publisher?: {
    '@id': string;
  };
}

interface SiteJsonLd {
  '@context': 'https://schema.org';
  '@graph': SiteJsonLdGraphItem[];
}

export const getSiteJsonLd = (): SiteJsonLd => {
  const personId = `${DOMAIN_URL}/#person`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${DOMAIN_URL}/#website`,
        name: 'KimBiYam.log',
        url: DOMAIN_URL,
        inLanguage: 'ko-KR',
        publisher: {
          '@id': personId,
        },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: PROFILE.name,
        url: PROFILE.social.github,
        sameAs: [PROFILE.social.github, PROFILE.social.linkedIn],
      },
    ],
  };
};
