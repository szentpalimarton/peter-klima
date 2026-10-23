import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kovetkezoTema } from '../tools/lib/valaszto.mjs';

const tema = (id, extra = {}) => ({
  id, kerdes: id, elsodleges: id, bokor: 'klima', szezon: [10, 11], forras: 'szezon',
  allapot: 'topic', allapotDatum: null, adat: null, kizarva: null, ...extra,
});
const okt = new Date('2026-10-26');

test('csak a szezonban lévő topic témák jelöltek', () => {
  const r = kovetkezoTema({ items: [tema('a', { szezon: [3, 4] }), tema('b', { allapot: 'live' }), tema('c', { kizarva: { datum: '2026-10-01', ok: 'nem kell' } }), tema('d')] }, { ma: okt });
  assert.equal(r.pick.id, 'd');
  assert.deepEqual(r.skipped.map((s) => s.id), ['a', 'b', 'c']);
  assert.match(r.skipped[0].ok, /szezon/);
  assert.match(r.skipped[2].ok, /kizárva/);
});

test('a következő hónap szezonja is számít', () => {
  const r = kovetkezoTema({ items: [tema('nov', { szezon: [11] })] }, { ma: okt });
  assert.equal(r.pick.id, 'nov');
});

test('gsc-forrású téma elöl, megjelenés szerint', () => {
  const r = kovetkezoTema({ items: [tema('sz'), tema('g1', { forras: 'gsc', adat: { megjelenes: 5 } }), tema('g2', { forras: 'gsc', adat: { megjelenes: 12 } })] }, { ma: okt });
  assert.deepEqual(r.ranked.map((t) => t.id), ['g2', 'g1', 'sz']);
});

test('a bokor váltakozik az utolsó draft/live után', () => {
  const r = kovetkezoTema({ items: [tema('k1'), tema('n1', { bokor: 'napelem' }), tema('volt', { bokor: 'klima', allapot: 'draft', allapotDatum: '2026-10-19' })] }, { ma: okt });
  assert.equal(r.pick.id, 'n1');
});

test('nincs jelölt: pick null', () => {
  const r = kovetkezoTema({ items: [tema('a', { szezon: [5] })] }, { ma: okt });
  assert.equal(r.pick, null);
  assert.deepEqual(r.ranked, []);
});
