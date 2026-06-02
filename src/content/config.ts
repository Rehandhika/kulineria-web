import { z, defineCollection } from 'astro:content';

const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    photo: z.string(),
    order: z.number(),
    socials: z.array(z.object({
      platform: z.enum(['twitter', 'linkedin', 'github', 'instagram']),
      url: z.string().url(),
    })).optional(),
  }),
});

export const collections = { team };
