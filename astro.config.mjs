import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ideiglenes demó-hoszting GitHub Pagesen (subpath alatt fut),
// élesítéskor a sima build a végleges domainre épül.
// TODO: cseréld a végleges domainre, amint megvan (pl. https://peternapelem.hu)
const ghPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: ghPages ? 'https://szentpalimarton.github.io' : 'https://klimatisztitas-fejer.hu',
  base: ghPages ? '/peter-klima' : undefined,
  integrations: [sitemap()],
});
