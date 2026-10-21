import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const t = z.object({ en: z.string(), nl: z.string() });

// One YAML file per project in src/content/projects/. Add a file = add a project (EN + NL pages are generated).
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),                      // legacy project number (used for redirects from /project-N.html)
      order: z.number(),                   // display order on the site
      featured: z.boolean().default(false),// shown on the home page
      sector: z.enum(['hospitality', 'residential', 'commercial']),
      services: z.array(z.enum(['concept-design', 'technical-drawings', 'turn-key-build'])).default([]),
      slugs: t,
      title: t,
      summary: t,
      brief: t.optional(),
      challenge: t.optional(),
      outcome: t.optional(),
      facts: z.array(z.object({ key: z.string(), label: t, value: t })).default([]),
      hero: image(),
      heroAlt: t,
      heroPosition: z.enum(['center', 'upper', 'lower']).default('center'),
      heroCredit: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: t, credit: z.string().optional() })).default([]),
      video: z
        .object({ src: z.string(), poster: image(), alt: t })
        .nullable()
        .default(null),
    }),
});

export const collections = { projects };
