export const PAGE_TITLE_SUFFIX = ' | KimBiYam.log';

export const FEED_PATH = '/feed.xml';

// Page-level `alternates` replaces the layout's, so pages that set a canonical
// must spread this to keep the RSS <link rel="alternate">.
export const FEED_ALTERNATE_TYPES = {
  'application/rss+xml': FEED_PATH,
};
