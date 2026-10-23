#!/usr/bin/env node
// node tools/cikk-kapu.mjs src/content/tudastar/<slug>.md → JSON; kilépési kód 1, ha bukik
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kapu } from './lib/kapu.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fajl = process.argv[2];
if (!fajl) { console.error('használat: node tools/cikk-kapu.mjs <cikk.md>'); process.exit(2); }
const slug = path.basename(fajl, '.md');
const lista = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/tiltott-kifejezesek.json'), 'utf8'));

// Létezik-e az oldal a repóban: src/pages/<út>.astro, src/pages/<út>/index.astro vagy a kollekcióban
const letezik = (p) => {
  const rel = p.replace(/^\/|\/$/g, '');
  if (rel === '') return true;
  const jeloltek = [
    path.join(ROOT, 'src/pages', `${rel}.astro`),
    path.join(ROOT, 'src/pages', rel, 'index.astro'),
    path.join(ROOT, 'src/content', `${rel}.md`),
  ];
  // a saját fájl nem számít létezőnek (a slug-egyediség a többi cikket nézi)
  return jeloltek.some((j) => fs.existsSync(j) && path.resolve(j) !== path.resolve(fajl));
};

const r = kapu(fs.readFileSync(fajl, 'utf8'), { slug, letezik, tiltott: lista.tiltott, hirszavak: lista.hirszavak });
process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
process.exit(r.pass ? 0 : 1);
