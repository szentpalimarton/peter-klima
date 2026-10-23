import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rendez } from '../tools/lib/rendezes.mjs';

const tema = (id, allapot = 'draft') => ({ id, kerdes: id, elsodleges: id, bokor: 'klima', szezon: [1], forras: 'szezon', allapot, allapotDatum: '2026-10-19', adat: null, kizarva: null });
const pr = (number, state, slug, extra = {}) => ({ number, state, headRefName: `cikk/${slug}`, createdAt: '2026-10-19T09:00:00Z', zaroKomment: null, ...extra });
const ma = new Date('2026-10-26');

test('merge-elt és élő → live', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: ['cikk/a'], eloRendben: { a: true }, ma });
  assert.equal(r.temaSor.items[0].allapot, 'live');
  assert.equal(r.temaSor.items[0].allapotDatum, '2026-10-26');
  assert.ok(r.teendok.some((t) => t.tipus === 'ag-torles' && t.slug === 'a'));
});

test('merge-elt, de nem él → marad draft, újra-néz teendő', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: [], eloRendben: { a: false }, ma });
  assert.equal(r.temaSor.items[0].allapot, 'draft');
  assert.ok(r.teendok.some((t) => t.tipus === 'ujra-nez' && t.slug === 'a'));
});

test('bezárt → kizárva a záró kommenttel, ág törlendő', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'CLOSED', 'a', { zaroKomment: 'nem időszerű' })], agak: ['cikk/a'], eloRendben: {}, ma });
  assert.equal(r.temaSor.items[0].allapot, 'topic');
  assert.deepEqual(r.temaSor.items[0].kizarva, { datum: '2026-10-26', ok: 'nem időszerű' });
  assert.ok(r.teendok.some((t) => t.tipus === 'ag-torles'));
});

test('két nyitott PR → nem írhat; régi PR emlékeztető', () => {
  const r = rendez({ items: [tema('a'), tema('b')] }, { prs: [pr(1, 'OPEN', 'a', { createdAt: '2026-09-20T09:00:00Z' }), pr(2, 'OPEN', 'b')], agak: ['cikk/a', 'cikk/b'], eloRendben: {}, ma });
  assert.equal(r.nyitott, 2);
  assert.equal(r.irhat, false);
  assert.ok(r.teendok.some((t) => t.tipus === 'emlekezteto' && t.number === 1));
});

test('ág PR nélkül → félbemaradt', () => {
  const r = rendez({ items: [tema('c')] }, { prs: [], agak: ['cikk/c'], eloRendben: {}, ma });
  assert.ok(r.teendok.some((t) => t.tipus === 'felbemaradt' && t.slug === 'c'));
  assert.equal(r.irhat, true);
});

test('régebbi bezárt PR nem írja felül az újabb nyitott újrapróbát', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(2, 'OPEN', 'a'), pr(1, 'CLOSED', 'a', { zaroKomment: 'régi' })], agak: ['cikk/a'], eloRendben: {}, ma });
  assert.equal(r.temaSor.items[0].allapot, 'draft');
  assert.equal(r.temaSor.items[0].kizarva, null);
  assert.ok(!r.teendok.some((t) => t.tipus === 'ag-torles' && t.slug === 'a'));
  assert.equal(r.nyitott, 1);
});

test('ág-törlés csak létező ágra: bezárt PR, ág már nincs', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'CLOSED', 'a', { zaroKomment: 'nem időszerű' })], agak: [], eloRendben: {}, ma });
  assert.equal(r.temaSor.items[0].allapot, 'topic');
  assert.ok(!r.teendok.some((t) => t.tipus === 'ag-torles'));
});

test('ág-törlés csak létező ágra: merge-elt és élő, ág már nincs', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: [], eloRendben: { a: true }, ma });
  assert.equal(r.temaSor.items[0].allapot, 'live');
  assert.ok(!r.teendok.some((t) => t.tipus === 'ag-torles'));
});

test('tema-sor ág: nem számít nyitottnak, nem félbemaradt', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(5, 'OPEN', 'tema-sor-2026-10-26')], agak: ['cikk/tema-sor-2026-10-26'], eloRendben: {}, ma });
  assert.equal(r.nyitott, 0);
  assert.equal(r.irhat, true);
  assert.ok(!r.teendok.some((t) => t.tipus === 'felbemaradt'));
});

test('tema-sor ág PR nélkül sem félbemaradt', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [], agak: ['cikk/tema-sor-2026-10-26'], eloRendben: {}, ma });
  assert.ok(!r.teendok.some((t) => t.tipus === 'felbemaradt'));
});

test('tema-sor ág: merge-elt vagy bezárt → ág-törlés csak ha az ág még megvan', () => {
  const van = rendez({ items: [tema('a')] }, { prs: [pr(5, 'MERGED', 'tema-sor-2026-10-26')], agak: ['cikk/tema-sor-2026-10-26'], eloRendben: {}, ma });
  assert.ok(van.teendok.some((t) => t.tipus === 'ag-torles' && t.slug === 'tema-sor-2026-10-26'));
  const nincs = rendez({ items: [tema('a')] }, { prs: [pr(5, 'CLOSED', 'tema-sor-2026-10-26')], agak: [], eloRendben: {}, ma });
  assert.ok(!nincs.teendok.some((t) => t.tipus === 'ag-torles'));
});
