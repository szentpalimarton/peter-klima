#!/usr/bin/env node
// node tools/kovetkezo-tema.mjs [--datum ÉÉÉÉ-HH-NN] [--tema-sor <fájl>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kovetkezoTema } from './lib/valaszto.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (nev, alap) => { const i = process.argv.indexOf(nev); return i > -1 ? process.argv[i + 1] : alap; };
const datumMegadva = process.argv.includes('--datum');
const datumErtek = arg('--datum');
const ma = datumMegadva ? new Date(datumErtek ?? NaN) : new Date();
if (datumMegadva && (!datumErtek || datumErtek.startsWith('--') || Number.isNaN(ma.getTime()))) {
  process.stderr.write(`hibás --datum érték: ${datumErtek ?? ''}\n`);
  process.exit(2);
}
const temaSor = JSON.parse(fs.readFileSync(arg('--tema-sor', path.join(ROOT, 'src/data/tema-sor.json')), 'utf8'));
process.stdout.write(`${JSON.stringify(kovetkezoTema(temaSor, { ma }), null, 2)}\n`);
