import { test } from 'node:test';
import assert from 'node:assert/strict';
import { javaslatok, slugosit } from '../tools/lib/javaslat.mjs';

const ma = new Date('2026-10-26');
const temaSor = { items: [] };
const oldalak = [{ cim: 'Miért büdös a klíma, és mit lehet tenni ellene?', elsodleges: 'büdös klíma' }];

test('slugosít ékezet nélkül', () => {
  assert.equal(slugosit('klíma tisztítás Székesfehérvár'), 'klima-tisztitas-szekesfehervar');
});

test('megjelenés ≥ 5, kattintás 0, nincs rá oldal → javaslat', () => {
  const r = javaslatok([
    { query: 'napelem tisztítás télen', page: '/x/', impressions: 4, clicks: 0, position: 12 },
    { query: 'napelem tisztítás télen', page: '/y/', impressions: 3, clicks: 0, position: 15 },
    { query: 'büdös klíma', page: '/z/', impressions: 20, clicks: 0, position: 8 },
    { query: 'klíma csöpög', page: '/z/', impressions: 9, clicks: 1, position: 6 },
  ], { temaSor, oldalak, ma });
  assert.equal(r.length, 1);
  assert.equal(r[0].id, 'napelem-tisztitas-telen');
  assert.equal(r[0].forras, 'gsc');
  assert.equal(r[0].bokor, 'napelem');
  assert.equal(r[0].adat.megjelenes, 7);
  assert.deepEqual(r[0].szezon, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('ami már a téma-sorban van, nem jön újra; legfeljebb max', () => {
  const sorok = ['a klíma b', 'c klíma d', 'e klíma f', 'g klíma h'].map((q, i) => ({ query: q, page: '/', impressions: 10 + i, clicks: 0, position: 9 }));
  // oldalak üres: a lefedettség-szűrőt az előző teszt nézi; itt a dupla-kizárás és a max
  const r = javaslatok(sorok, { temaSor: { items: [{ id: 'a-klima-b', adat: { lekerdezes: 'a klíma b' } }] }, oldalak: [], ma, max: 2 });
  assert.deepEqual(r.map((x) => x.id), ['g-klima-h', 'e-klima-f']);
});
