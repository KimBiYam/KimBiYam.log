import { DEPLOYMENT_URL, DOMAIN_URL, PROFILE } from '@src/shared/constants';

import { PostDetail, PostPreview } from '../types';

interface JsonLdReference {
  '@id': string;
}

interface JsonLdPersonReference extends JsonLdReference {
  '@type': 'Person';
  name: string;
}

interface JsonLdWebPage {
  '@type': 'WebPage';
  '@id': string;
}

interface JsonLdBlogPosting {
  '@type': 'BlogPosting';
  '@id': string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  inLanguage: 'ko-KR';
  author: JsonLdPersonReference;
  publisher: JsonLdReference;
  url: string;
  mainEntityOfPage: JsonLdWebPage;
  isPartOf: JsonLdReference;
  image: string[];
  keywords: string[];
}

interface JsonLdListItem {
  '@type': 'ListItem';
  position: number;
  name?: string;
  item?: string;
  url?: string;
}

interface JsonLdBreadcrumbList {
  '@type': 'BreadcrumbList';
  '@id': string;
  itemListElement: JsonLdListItem[];
}

interface JsonLdItemList {
  '@type': 'ItemList';
  numberOfItems: number;
  itemListElement: JsonLdListItem[];
}

interface JsonLdCollectionPage {
  '@type': 'CollectionPage';
  '@id': string;
  name: string;
  description: string;
  url: string;
  inLanguage: 'ko-KR';
  isPartOf: JsonLdReference;
  mainEntity: JsonLdItemList;
}

interface PostJsonLd {
  '@context': 'https://schema.org';
  '@graph': [JsonLdBlogPosting, JsonLdBreadcrumbList];
}

interface TagJsonLd {
  '@context': 'https://schema.org';
  '@graph': [JsonLdCollectionPage, JsonLdBreadcrumbList];
}

const PERSON_ID = `${DOMAIN_URL}/#person`;
const WEBSITE_ID = `${DOMAIN_URL}/#website`;

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;

  return `${DOMAIN_URL}${path}`;
};

const getTagUrl = (tag: string) =>
  `${DOMAIN_URL}/tags/${encodeURIComponent(tag)}`;

const getBreadcrumbList = (
  url: string,
  items: { name: string; url: string }[],
): JsonLdBreadcrumbList => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [{ name: 'KimBiYam.log', url: DOMAIN_URL }, ...items].map(
    ({ name, url: itemUrl }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: itemUrl,
    }),
  ),
});

export const getPostJsonLd = ({
  path,
  postDetail,
}: {
  path: string;
  postDetail: PostDetail;
}): PostJsonLd => {
  const { date, updated, description, ogImagePath, tag, title } = postDetail;
  const url = toAbsoluteUrl(path);
  const imageUrl = ogImagePath
    ? toAbsoluteUrl(ogImagePath)
    : `${DEPLOYMENT_URL}${path}/opengraph-image`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: title,
        description,
        datePublished: date,
        dateModified: updated ?? date,
        inLanguage: 'ko-KR',
        // The site graph (with the full Person node) is only rendered on the home
        // page, so keep @type/name alongside the shared @id.
        author: {
          '@type': 'Person',
          '@id': PERSON_ID,
          name: PROFILE.name,
        },
        publisher: {
          '@id': PERSON_ID,
        },
        url,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        isPartOf: {
          '@id': WEBSITE_ID,
        },
        image: [imageUrl],
        keywords: [tag],
      },
      getBreadcrumbList(url, [
        { name: tag.toUpperCase(), url: getTagUrl(tag) },
        { name: title, url },
      ]),
    ],
  };
};

export const getTagJsonLd = ({
  tag,
  title,
  description,
  postPreviews,
}: {
  tag: string;
  title: string;
  description: string;
  postPreviews: PostPreview[];
}): TagJsonLd => {
  const url = getTagUrl(tag);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': url,
        name: title,
        description,
        url,
        inLanguage: 'ko-KR',
        isPartOf: {
          '@id': WEBSITE_ID,
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: postPreviews.length,
          itemListElement: postPreviews.map(({ id }, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: toAbsoluteUrl(`/posts/${id}`),
          })),
        },
      },
      getBreadcrumbList(url, [{ name: tag.toUpperCase(), url }]),
    ],
  };
};
