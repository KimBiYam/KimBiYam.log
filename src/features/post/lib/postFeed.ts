import 'server-only';

import { DOMAIN_URL, FEED_PATH } from '@src/shared/constants';

import { getSortedPostPreviews } from './postList';

const SITE_TITLE = 'KimBiYam.log';
const SITE_DESCRIPTION = 'KimBiYam의 개발 블로그 입니다.';

const INVALID_XML_CHAR_REG_EXP = RegExp(
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
);

const escapeXml = (value: string) =>
  value
    .replace(INVALID_XML_CHAR_REG_EXP, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toRfc822Date = (date: string) => new Date(date).toUTCString();

export const getPostFeedXml = async () => {
  const postPreviews = await getSortedPostPreviews();
  const lastBuildDate = postPreviews[0]?.date;

  const items = postPreviews
    .map(({ id, title, date, tag, content }) => {
      const link = `${DOMAIN_URL}/posts/${id}`;

      return [
        '    <item>',
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${toRfc822Date(date)}</pubDate>`,
        `      <description>${escapeXml(content.trim())}</description>`,
        `      <category>${escapeXml(tag)}</category>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${SITE_TITLE}</title>`,
    `    <link>${escapeXml(DOMAIN_URL)}</link>`,
    `    <description>${SITE_DESCRIPTION}</description>`,
    '    <language>ko</language>',
    `    <atom:link href="${escapeXml(`${DOMAIN_URL}${FEED_PATH}`)}" rel="self" type="application/rss+xml" />`,
    ...(lastBuildDate
      ? [`    <lastBuildDate>${toRfc822Date(lastBuildDate)}</lastBuildDate>`]
      : []),
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
};
