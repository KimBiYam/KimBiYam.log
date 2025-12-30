import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import svgr from 'vite-plugin-svgr';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      GOOGLE_SITE_VERIFICATION_KEY: envField.string({
        context: 'client',
        access: 'public',
      }),
      NAVER_SITE_VERIFICATION_KEY: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
  },
  integrations: [react(), tailwind(), sitemap()],
  vite: {
    plugins: [
      svgr({
        svgrOptions: {
          exportType: 'default',
          ref: true,
          svgo: false,
          titleProp: true,
        },
      }),
    ],
  },
  site: 'https://kimbiyam.log',
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  },
});
