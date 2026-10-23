#!/usr/bin/env node
// node tools/dist-ellenorzes.mjs <slug>  – a kész dist/ ellenőrzése
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { distEllenorzes } from './lib/dist.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!slug) { console.error('használat: node tools/dist-ellenorzes.mjs <slug>'); process.exit(2); }
const r = distEllenorzes({ dist: path.join(ROOT, 'dist'), slug, siteUrl: 'https://fejersolarclean.hu' });
process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
process.exit(r.rendben ? 0 : 1);
