import { z, defineCollection } from 'astro:content';

const foods = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    region: z.enum(['sumatera', 'jawa', 'kalimantan', 'sulawesi', 'bali-ntt', 'maluku-papua']),
    description: z.string(),
    taste: z.array(z.enum(['manis', 'pedas', 'gurih', 'asam', 'asin'])),
    imageUrl: z.string(),
    hero: z.object({
      image: z.string(),
      alt: z.string(),
      credit: z.string().optional(),
      dominantColor: z.string(),
    }).optional(),
    story: z.object({
      headline: z.string(),
      body: z.string(),
      pullQuote: z.string().optional(),
      image: z.string().optional(),
    }).optional(),
    ingredients: z.array(z.object({
      name: z.string(),
      qty: z.string().optional(),
      image: z.string(),
      essential: z.boolean(),
    })).optional(),
    recipe: z.object({
      servings: z.number(),
      prepTime: z.number(),
      cookTime: z.number(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      steps: z.array(z.object({
        order: z.number(),
        title: z.string(),
        text: z.string(),
        image: z.string().optional(),
        duration: z.number().optional(),
        tip: z.string().optional(),
      })),
    }).optional(),
    tasteScore: z.object({
      manis: z.number().min(0).max(100),
      pedas: z.number().min(0).max(100),
      gurih: z.number().min(0).max(100),
      asam: z.number().min(0).max(100),
      asin: z.number().min(0).max(100),
    }).optional(),
    nutrition: z.object({
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      fiber: z.number().optional(),
      servingSize: z.string(),
    }).optional(),
    locations: z.array(z.object({
      name: z.string(),
      city: z.string(),
      lat: z.number(),
      lng: z.number(),
      description: z.string(),
      priceRange: z.string().optional(),
    })).optional(),
    related: z.array(z.string()).optional(),
    funFacts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const regions = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.enum(['sumatera', 'jawa', 'kalimantan', 'sulawesi', 'bali-ntt', 'maluku-papua']),
    name: z.string(),
    color: z.string(),
    naraExpression: z.enum(['idle', 'excited', 'thinking', 'sad']),
    naraDialog: z.string(),
  }),
});

const stories = defineCollection({
  type: 'content',
  schema: z.object({
    section: z.enum(['hero-manifesto', 'mission', 'nara-origin', 'process-step', 'value']),
    order: z.number(),
    headline: z.string(),
    body: z.string(),
    image: z.string().optional(),
    icon: z.string().optional(),
  }),
});

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

export const collections = { foods, regions, stories, team };
