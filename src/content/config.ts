// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { z, defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    main: z.object({
      id: z.number(),
      content: z.string(),
      imgCard: z.string(),
      imgMain: z.string(),
      imgAlt: z.string(),
    }),
    tabs: z.array(
      z.object({
        id: z.string(),
        dataTab: z.string(),
        title: z.string(),
      })
    ),
    longDescription: z.object({
      title: z.string(),
      subTitle: z.string(),
      btnTitle: z.string(),
      btnURL: z.string(),
    }),
    descriptionList: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsLeft: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ),
    specificationsRight: z.array(
      z.object({
        title: z.string(),
        subTitle: z.string(),
      })
    ).optional(),
    tableData: z.array(
      z.object({
        feature: z.array(z.string()),
        description: z.array(z.array(z.string())),
      })
    ).optional(),
    blueprints: z.object({
      first: z.string().optional(),
      second: z.string().optional(),
    }),
  }),
});

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    contents: z.array(z.string()),
    author: z.string(),
    role: z.string().optional(),
    authorImage: z.string(),
    authorImageAlt: z.string(),
    pubDate: z.date(),
    cardImage: z.string(),
    cardImageAlt: z.string(),
    readTime: z.number(),
    tags: z.array(z.string()).optional(),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    features: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  'products': productsCollection,
  'blog': blogCollection,
  'services': servicesCollection,
};