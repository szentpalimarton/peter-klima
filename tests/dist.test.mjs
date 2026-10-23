import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { distEllenorzes } from '../tools/lib/dist.mjs';

const ld = (t) => `<script type="application/ld+json">${JSON.stringify({ '@type': t })}</script>`;
function hamisDist({ sema = ['Article', 'FAQPage', 'BreadcrumbList'], hub = true, sitemap = true } = {}) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'));
  fs.mkdirSync(path.join(d, 'tudastar/proba'), { recursive: true });
  fs.writeFileSync(path.join(d, 'tudastar/proba/index.html'), `<html>${sema.map(ld).join('')}</html>`);
  fs.writeFileSync(path.join(d, 'tudastar/index.html'), hub ? '<a href="/tudastar/proba/">x</a>' : '<a href="/tudastar/mas/">x</a>');
  fs.writeFileSync(path.join(d, 'sitemap-0.xml'), sitemap ? '<loc>https://example.hu/tudastar/proba/</loc>' : '<loc>https://example.hu/</loc>');
  return d;
}
const opts = (dist) => ({ dist, slug: 'proba', siteUrl: 'https://example.hu' });

test('teljes dist rendben', () => {
  const r = distEllenorzes(opts(hamisDist()));
  assert.deepEqual(r.hibak, []);
  assert.equal(r.rendben, true);
});

test('hiányzó oldal, hub-link, sitemap és séma külön hibák', () => {
  const r1 = distEllenorzes({ ...opts(hamisDist()), slug: 'nincs' });
  assert.ok(r1.hibak.some((h) => /nem létezik/.test(h)));
  const r2 = distEllenorzes(opts(hamisDist({ hub: false })));
  assert.ok(r2.hibak.some((h) => /hub/.test(h)));
  const r3 = distEllenorzes(opts(hamisDist({ sitemap: false })));
  assert.ok(r3.hibak.some((h) => /sitemap/.test(h)));
  const r4 = distEllenorzes(opts(hamisDist({ sema: ['Article'] })));
  assert.ok(r4.hibak.some((h) => /FAQPage/.test(h)));
});
