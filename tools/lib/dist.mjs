import fs from 'node:fs';
import path from 'node:path';

const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

export function distEllenorzes({ dist, slug, siteUrl }) {
  const hibak = [];
  const oldal = path.join(dist, 'tudastar', slug, 'index.html');
  if (!fs.existsSync(oldal)) return { rendben: false, hibak: [`az oldal nem létezik a buildben: ${oldal}`] };
  const html = fs.readFileSync(oldal, 'utf8');
  const tipusok = [];
  for (const m of html.matchAll(LD)) {
    try { tipusok.push(JSON.parse(m[1])['@type']); } catch { hibak.push('érvénytelen JSON-LD blokk'); }
  }
  for (const t of ['Article', 'FAQPage', 'BreadcrumbList']) if (!tipusok.includes(t)) hibak.push(`hiányzó séma: ${t}`);
  const hubFajl = path.join(dist, 'tudastar/index.html');
  if (!fs.existsSync(hubFajl)) hibak.push('a hub oldal hiányzik a buildben (tudastar/index.html)');
  else if (!fs.readFileSync(hubFajl, 'utf8').includes(`href="/tudastar/${slug}/"`)) hibak.push('a hub nem linkeli az új cikket');
  const sitemapFajl = path.join(dist, 'sitemap-0.xml');
  if (!fs.existsSync(sitemapFajl)) hibak.push('a sitemap hiányzik a buildben (sitemap-0.xml)');
  else if (!fs.readFileSync(sitemapFajl, 'utf8').includes(`${siteUrl}/tudastar/${slug}/`)) hibak.push('a sitemap nem tartalmazza az új cikket');
  return { rendben: hibak.length === 0, hibak };
}
