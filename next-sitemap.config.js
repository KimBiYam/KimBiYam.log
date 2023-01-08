/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://kimbiyam.me',
  sitemapSize: 7000,
  changefreq: 'weekly',
  generateRobotsTxt: true,
  priority: 1,
};
