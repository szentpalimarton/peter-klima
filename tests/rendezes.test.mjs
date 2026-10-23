import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rendez } from '../tools/lib/rendezes.mjs';

const tema = (id, allapot = 'draft') => ({ id, kerdes: id, elsodleges: id, bokor: 'klima', szezon: [1], forras: 'szezon', allapot, allapotDatum: '2026-10-19', adat: null, kizarva: null });
// A lezárt PR-ok a gh-tól closedAt / mergedAt mezőt kapnak; a dátumok ezekből jönnek, nem a futás napjából.
const LEZARVA = '2026-10-24T10:00:00Z';
const pr = (number, state, slug, extra = {}) => ({
  number, state, headRefName: `cikk/${slug}`, createdAt: '2026-10-19T09:00:00Z', zaroKomment: null,
  closedAt: state === 'OPEN' ? null : LEZARVA, mergedAt: state === 'MERGED' ? LEZARVA : null, ...extra,
});
const ma = new Date('2026-10-26');

test('merge-elt és élő → live', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: ['cikk/a'], eloRendben: { a: true }, ma });
  assert.equal(r.temaSor.items[0].allapot, 'live');
  assert.equal(r.temaSor.items[0].allapotDatum, '2026-10-24');
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
  assert.deepEqual(r.temaSor.items[0].kizarva, { datum: '2026-10-24', ok: 'nem időszerű' });
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

// A main-en a draft állapot nem látszik (csak a PR-ágon van): a PR állapota dönt a topic témán is.
const topicTema = (id) => ({ ...tema(id, 'topic'), allapotDatum: null });

test('main-en még topic, nyitott PR → draft a PR dátumával', () => {
  const r = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'OPEN', 'a', { createdAt: '2026-10-20T09:00:00Z' })], agak: ['cikk/a'], eloRendben: {}, ma });
  assert.equal(r.temaSor.items[0].allapot, 'draft');
  assert.equal(r.temaSor.items[0].allapotDatum, '2026-10-20');
  assert.equal(r.nyitott, 1);
});

test('main-en még topic, bezárt PR → kizárva', () => {
  const r = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'CLOSED', 'a', { zaroKomment: 'nem kell' })], agak: [], eloRendben: {}, ma });
  assert.equal(r.temaSor.items[0].allapot, 'topic');
  assert.equal(r.temaSor.items[0].allapotDatum, null);
  assert.deepEqual(r.temaSor.items[0].kizarva, { datum: '2026-10-24', ok: 'nem kell' });
});

test('main-en még topic, merge-elt és élő → live', () => {
  const r = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: ['cikk/a'], eloRendben: { a: true }, ma });
  assert.equal(r.temaSor.items[0].allapot, 'live');
  assert.equal(r.temaSor.items[0].allapotDatum, '2026-10-24');
  assert.ok(r.teendok.some((t) => t.tipus === 'ag-torles' && t.slug === 'a'));
});

test('már kizárt topic témán a bezárt PR nem írja újra a kizárást', () => {
  const kizart = { ...topicTema('a'), kizarva: { datum: '2026-10-19', ok: 'régi ok' } };
  const r = rendez({ items: [kizart] }, { prs: [pr(1, 'CLOSED', 'a', { zaroKomment: 'régi ok' })], agak: [], eloRendben: {}, ma });
  assert.deepEqual(r.temaSor.items[0], kizart);
});

test('nyitott PR draft-jelölése nem érdemi változás, a bezárás igen', () => {
  const nyitott = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'OPEN', 'a')], agak: ['cikk/a'], eloRendben: {}, ma });
  assert.equal(nyitott.temaSor.items[0].allapot, 'draft');
  assert.equal(nyitott.erdemiValtozas, false);
  const zart = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'CLOSED', 'a')], agak: [], eloRendben: {}, ma });
  assert.equal(zart.erdemiValtozas, true);
});

test('élővé válás érdemi változás; változatlan kizárás nem', () => {
  const elo = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: [], eloRendben: { a: true }, ma });
  assert.equal(elo.erdemiValtozas, true);
  const kizart = { ...topicTema('a'), kizarva: { datum: '2026-10-19', ok: 'régi ok' } };
  const marad = rendez({ items: [kizart] }, { prs: [pr(1, 'CLOSED', 'a')], agak: [], eloRendben: {}, ma });
  assert.equal(marad.erdemiValtozas, false);
});

test('a kizárás dátuma a PR closedAt-je, a futás napjától függetlenül', () => {
  const p = pr(1, 'CLOSED', 'a', { closedAt: '2026-10-12T15:30:00Z', zaroKomment: 'nem kell' });
  for (const nap of ['2026-10-19', '2026-11-30']) {
    const r = rendez({ items: [topicTema('a')] }, { prs: [p], agak: [], eloRendben: {}, ma: new Date(nap) });
    assert.equal(r.temaSor.items[0].kizarva.datum, '2026-10-12');
  }
});

test('az élő dátum a PR mergedAt-je; mező nélkül a futás napja', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a', { mergedAt: '2026-10-21T08:00:00Z' })], agak: [], eloRendben: { a: true }, ma });
  assert.equal(r.temaSor.items[0].allapotDatum, '2026-10-21');
  const regi = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a', { mergedAt: undefined, closedAt: undefined })], agak: [], eloRendben: { a: true }, ma });
  assert.equal(regi.temaSor.items[0].allapotDatum, '2026-10-26');
  const zart = rendez({ items: [tema('a')] }, { prs: [pr(1, 'CLOSED', 'a', { closedAt: undefined })], agak: [], eloRendben: {}, ma });
  assert.equal(zart.temaSor.items[0].kizarva.datum, '2026-10-26');
});

test('két egymás utáni futás ugyanarra a bemenetre azonos tételeket ad', () => {
  const bemenet = { items: [topicTema('a'), topicTema('b'), tema('c'), topicTema('d')] };
  const opts = (nap) => ({
    prs: [pr(1, 'CLOSED', 'a', { zaroKomment: 'x' }), pr(2, 'MERGED', 'b'), pr(3, 'MERGED', 'c'), pr(4, 'OPEN', 'd')],
    agak: [], eloRendben: { b: true, c: true }, ma: new Date(nap),
  });
  const elso = rendez(bemenet, opts('2026-10-26'));
  const masodik = rendez(bemenet, opts('2026-11-02'));
  assert.deepEqual(masodik.temaSor.items, elso.temaSor.items);
  // és a kimenet újrafuttatva sem változik tovább
  const harmadik = rendez(elso.temaSor, opts('2026-11-09'));
  assert.deepEqual(harmadik.temaSor.items, elso.temaSor.items);
});

test('nyitott tema-sor PR mellett nincs érdemi változás', () => {
  const r = rendez({ items: [topicTema('a')] }, { prs: [pr(1, 'CLOSED', 'a'), pr(5, 'OPEN', 'tema-sor-2026-10-19')], agak: [], eloRendben: {}, ma });
  assert.ok(r.temaSor.items[0].kizarva, 'a kizárás a fájlba bekerül');
  assert.equal(r.erdemiValtozas, false);
});

test('élő témán a bezárt PR nem ír kizárást', () => {
  const r = rendez({ items: [tema('a', 'live')] }, { prs: [pr(1, 'CLOSED', 'a')], agak: [], eloRendben: {}, ma });
  assert.equal(r.temaSor.items[0].allapot, 'live');
  assert.equal(r.temaSor.items[0].kizarva, null);
});
