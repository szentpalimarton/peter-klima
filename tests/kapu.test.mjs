import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kapu } from '../tools/lib/kapu.mjs';

const tiltott = [{ kifejezes: 'vegyszermentes', ok: 'x' }, { kifejezes: 'megtérül', ok: 'y' }];
const hirszavak = ['tegnap', 'a héten'];
const letezik = (p) => ['/klimatisztitas/', '/arak/', '/tudastar/miert-budos-a-klima/'].includes(p);
const fejlec = `---
title: "Fűtésre optimalizált klímát ősszel is kell tisztíttatni?"
description: "Igen, a fűtési szezon előtt: a nyári hűtés után nedves hőcserélőn marad a kosz."
elsodleges: "klíma tisztítás ősszel"
bokor: klima
datePublished: 2026-10-26
dateModified: 2026-10-26
faq:
  - q: "K1?"
    a: "V1."
  - q: "K2?"
    a: "V2."
forrasok:
  - nev: "US DOE"
    url: "https://www.energy.gov/energysaver/air-conditioner-maintenance"
cta: "call-klima-osz"
---
`;
const jo = `${fejlec}
<p class="lede">Igen: a klíma tisztítás ősszel a fűtési szezon előtt esedékes. <a href="/klimatisztitas/">Így végezzük</a>, <a href="/arak/">ennyibe kerül</a>.</p>

## Miért

A DOE szerint az eltömődött szűrő cseréje <a href="https://www.energy.gov/energysaver/air-conditioner-maintenance" rel="nofollow">5–15 százalékkal csökkenti a fogyasztást</a>.
`;
const opts = { slug: 'futesre-optimalizalt-klima-oszi-tisztitas', letezik, tiltott, hirszavak };

test('jó cikk átmegy', () => {
  const r = kapu(jo, opts);
  assert.deepEqual(r.failures, []);
  assert.equal(r.pass, true);
});

test('hiányzó fejléc-mező és rossz bokor bukik', () => {
  const r = kapu(jo.replace('bokor: klima', 'bokor: egyeb').replace('cta: "call-klima-osz"', ''), opts);
  assert.ok(r.failures.some((f) => /bokor/.test(f)));
  assert.ok(r.failures.some((f) => /cta/.test(f)));
});

test('tiltott szó ragozva is bukik', () => {
  const r = kapu(jo.replace('Igen: a', 'Igen, Vegyszermentesen: a').replace('## Miért', '## Megtérülése'), opts);
  assert.ok(r.failures.some((f) => /vegyszermentes/.test(f)));
  assert.ok(r.failures.some((f) => /megtérül/.test(f)));
});

test('szám forrás nélkül bukik, tapasztalat-mondat nem', () => {
  const r1 = kapu(`${jo}\n\nA tisztítás 20%-kal többet hoz.\n`, opts);
  assert.ok(r1.failures.some((f) => /forrás/.test(f)));
  const r2 = kapu(`${jo}\n\nPéter tapasztalata szerint akár 15–20% a többlet.\n`, opts);
  assert.equal(r2.pass, true);
});

test('kevés vagy nem létező belső link bukik', () => {
  const r = kapu(jo.replace('<a href="/arak/">ennyibe kerül</a>', 'ennyibe kerül'), opts);
  assert.ok(r.failures.some((f) => /belső link/.test(f)));
  const r2 = kapu(jo.replace('/arak/', '/nincs-ilyen/'), opts);
  assert.ok(r2.failures.some((f) => /nincs-ilyen/.test(f)));
});

test('dupla slug bukik', () => {
  const r = kapu(jo, { ...opts, letezik: (p) => letezik(p) || p === '/tudastar/futesre-optimalizalt-klima-oszi-tisztitas/' });
  assert.ok(r.failures.some((f) => /slug/.test(f)));
});

test('kulcsszó a címben vagy a ledében kell', () => {
  const r = kapu(jo.replace('elsodleges: "klíma tisztítás ősszel"', 'elsodleges: "napelem hó eltávolítás"'), opts);
  assert.ok(r.failures.some((f) => /kulcsszó/.test(f)));
});

test('hírszó csak figyelmeztetés', () => {
  const r = kapu(`${jo}\n\nA héten sok hívás jött.\n`, opts);
  assert.equal(r.pass, true);
  assert.ok(r.warnings.some((w) => /a héten/.test(w)));
});
