import { defineCollection, z } from 'astro:content';
import { getPostPreviewDescription } from '../features/post/utils';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tag: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts };
