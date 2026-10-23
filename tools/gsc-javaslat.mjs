#!/usr/bin/env node
// node tools/gsc-javaslat.mjs <sorok.json> [--proba]
// sorok.json: [{ "query", "page", "impressions", "clicks", "position" }] a gsc MCP query,page bontásából
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { szetszed } from './lib/frontmatter.mjs';
import { javaslatok } from './lib/javaslat.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fajl = process.argv[2];
if (!fajl) { console.error('használat: node tools/gsc-javaslat.mjs <sorok.json> [--proba]'); process.exit(2); }
const proba = process.argv.includes('--proba');
const sorok = JSON.parse(fs.readFileSync(fajl, 'utf8'));
const temaSorUt = path.join(ROOT, 'src/data/tema-sor.json');
const temaSor = JSON.parse(fs.readFileSync(temaSorUt, 'utf8'));

// Az oldalak címei: .astro (const title = '…') és a kollekció (fejléc)
const oldalak = [];
const jar = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) jar(p);
    else if (f.name.endsWith('.astro')) { const m = /const title =\s*['"`]([^'"`]+)['"`]/.exec(fs.readFileSync(p, 'utf8')); if (m) oldalak.push({ cim: m[1], elsodleges: '' }); }
    else if (f.name.endsWith('.md')) { const { fejlec } = szetszed(fs.readFileSync(p, 'utf8')); oldalak.push({ cim: fejlec.title ?? '', elsodleges: fejlec.elsodleges ?? '' }); }
  }
};
jar(path.join(ROOT, 'src/pages'));
jar(path.join(ROOT, 'src/content/tudastar'));
for (const t of temaSor.items) oldalak.push({ cim: t.kerdes, elsodleges: t.elsodleges });

const uj = javaslatok(sorok, { temaSor, oldalak, ma: new Date() });
if (uj.length && !proba) {
  temaSor.items.push(...uj);
  fs.writeFileSync(temaSorUt, `${JSON.stringify(temaSor, null, 2)}\n`);
}
process.stdout.write(`${JSON.stringify({ felvett: uj, proba }, null, 2)}\n`);
