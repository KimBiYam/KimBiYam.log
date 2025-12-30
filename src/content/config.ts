// eslint-disable-next-line import/no-unresolved
import { defineCollection, z } from 'astro:content';

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
