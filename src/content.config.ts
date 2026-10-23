import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Tudástár-cikkek Markdownban (heti cikk-kör, spec 2.1). A fájlnév a slug.
const tudastar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tudastar' }),
  schema: z.object({
    title: z.string().max(62), // a sablon " | Péter"-t fűz hozzá, együtt ≤ 70
    description: z.string().max(160),
    elsodleges: z.string().min(1),
    bokor: z.enum(['napelem', 'klima', 'terulet']),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(2).max(4),
    forrasok: z.array(z.object({ nev: z.string(), url: z.string().url() })).min(1),
    cta: z.string().regex(/^call-[a-z0-9-]+$/),
  }),
});

export const collections = { tudastar };
