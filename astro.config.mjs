import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Éles: a végleges domainre épül, gyökér útvonalon, keresőknek indexelhetően.
export default defineConfig({
  site: 'https://fejersolarclean.hu',
  integrations: [sitemap()],
});
