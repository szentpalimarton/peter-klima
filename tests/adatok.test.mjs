import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// A kör által olvasott és írt adatfájlok sémája (spec 2.2): egy kézi szerkesztés se törje el a szkripteket.
const olvas = (ut) => JSON.parse(fs.readFileSync(new URL(`../${ut}`, import.meta.url), 'utf8'));

test('tema-sor.json: parse-olható, a tételek sémája rendben', () => {
  const { items } = olvas('src/data/tema-sor.json');
  assert.ok(Array.isArray(items) && items.length > 0, 'items üres vagy nem tömb');
  const ids = new Set();
  for (const t of items) {
    assert.match(t.id, /^[a-z0-9-]+$/, `rossz id: ${t.id}`);
    assert.ok(!ids.has(t.id), `dupla id: ${t.id}`);
    ids.add(t.id);
    assert.ok(['topic', 'draft', 'live'].includes(t.allapot), `${t.id}: allapot ${t.allapot}`);
    assert.ok(['napelem', 'klima', 'terulet'].includes(t.bokor), `${t.id}: bokor ${t.bokor}`);
    assert.ok(['szezon', 'gsc', 'ugyfel'].includes(t.forras), `${t.id}: forras ${t.forras}`);
    assert.ok(Array.isArray(t.szezon) && t.szezon.length > 0, `${t.id}: szezon üres`);
    for (const h of t.szezon) assert.ok(Number.isInteger(h) && h >= 1 && h <= 12, `${t.id}: szezon-hónap ${h}`);
    assert.ok(t.allapotDatum === null || /^\d{4}-\d{2}-\d{2}$/.test(t.allapotDatum), `${t.id}: allapotDatum ${t.allapotDatum}`);
    assert.ok(t.kizarva === null || (typeof t.kizarva === 'object' && 'datum' in t.kizarva && 'ok' in t.kizarva), `${t.id}: kizarva`);
  }
});

test('tiltott-kifejezesek.json: parse-olható, a listák sémája rendben', () => {
  const { tiltott, hirszavak } = olvas('tools/tiltott-kifejezesek.json');
  assert.ok(Array.isArray(tiltott) && tiltott.length > 0, 'tiltott üres vagy nem tömb');
  for (const t of tiltott) {
    assert.ok(typeof t.kifejezes === 'string' && t.kifejezes.trim(), 'üres kifejezes');
    assert.ok(typeof t.ok === 'string' && t.ok.trim(), `${t.kifejezes}: üres ok`);
  }
  assert.ok(Array.isArray(hirszavak), 'hirszavak nem tömb');
  for (const h of hirszavak) assert.ok(typeof h === 'string' && h.trim(), 'üres hírszó');
});
