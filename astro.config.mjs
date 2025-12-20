import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  site: 'https://kimbiyam.log',
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypePrism,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    shikiConfig: {
      theme: 'dracula',
    },
  },
});
