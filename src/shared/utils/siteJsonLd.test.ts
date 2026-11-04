import { describe, expect, it } from 'vitest';

import { DOMAIN_URL, PROFILE } from '@src/shared/constants';
import { getSiteJsonLd } from '@src/shared/utils/siteJsonLd';

describe('getSiteJsonLd', () => {
  it('returns a schema.org graph with WebSite and Person', () => {
    const jsonLd = getSiteJsonLd();

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@graph'].map((item) => item['@type'])).toEqual([
      'WebSite',
      'Person',
    ]);
  });

  it('links the website publisher to the person id', () => {
    const [website, person] = getSiteJsonLd()['@graph'];

    expect(website['@id']).toBe(`${DOMAIN_URL}/#website`);
    expect(website.url).toBe(DOMAIN_URL);
    expect(website.inLanguage).toBe('ko-KR');
    expect(person['@id']).toBe(`${DOMAIN_URL}/#person`);
    expect(website.publisher).toEqual({ '@id': person['@id'] });
  });

  it('describes the person from the profile', () => {
    const person = getSiteJsonLd()['@graph'][1];

    expect(person.name).toBe(PROFILE.name);
    expect(person.url).toBe(PROFILE.social.github);
    expect(person.sameAs).toEqual([
      PROFILE.social.github,
      PROFILE.social.linkedIn,
    ]);
  });
});
