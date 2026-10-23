# Heti cikk-kör – megvalósítási terv

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hetente egy, a szezonban aktuális magyar Tudástár-cikk készül Markdownban, gépi kapukkal és belső linkekkel, pull requestben, amit Márton merge-dzsel ad ki.

**Architecture:** Az Astro site egy content collectiont kap (`src/content/tudastar/*.md`) közös sablonnal; a döntési szabályok (választó, kapu, dist-ellenőrzés, PR-rendezés, GSC-javaslat) tiszta függvények `tools/lib/` alatt, vékony CLI-kkel `tools/` alatt, `node:test` tesztekkel. A futást egy hétfői ütemezett feladat végzi a repó `cikk-kor.md` projektlapja szerint, worktree-ben, `cikk/<slug>` ágon, és `gh pr create`-tel zárul.

**Tech Stack:** Astro 5.18 (content layer, `glob` loader, `astro:content`), Node 22 (`node:test`, `fetch`), `yaml` (devDependency, a frontmatterhez), `gh` CLI, `gsc` MCP, GitHub Actions (változatlan).

**Spec:** `docs/superpowers/specs/2026-10-23-heti-cikk-kor-design.md`

## Global Constraints

- A kör a `main`-re soha nem ír; kiadás csak PR-merge-dzsel (spec 2.7, 4).
- Tiltott megfogalmazások: `vegyszermentes`, `vegyszer nélkül`, `garancia`, `garantál`, `biztosítás`, `biztosított`, `éve dolgoz`, `éves tapasztalat`, `megtérül`, `hőszivattyús`, `fűtésre is használt`, `kimondott ár` (spec 2.4/3).
- Helyes megfogalmazások: „szűrt, pH-semleges víz”, „előre kalkulálható ár”, „zsákos-átmosásos technika”, „fűtésre optimalizált készülék” (spec 2.6).
- Szám csak megnevezett, letöltéssel ellenőrzött elsődleges forrással; ha nincs forrás, nincs szám (spec 2.6).
- Tipográfia: em dash (—) tilos, gondolatjel ( – ) legfeljebb elvétve; magyar idézőjel „…”.
- A 8 meglévő `.astro` cikk és a deploy-munkafolyamat nem változik (spec 2.1, 6).
- Belső linkek a Markdownban gyökér-útvonallal (`/klimatisztitas/`), `.astro` fájlban `withBase('/…/')` (spec 2.1, 2.5).
- Commit-üzenet a kör commitjain: `cikk-kor: <slug>` előtag; a fejlesztés commitjai a repó szokása szerint (`feat:`, `docs:`, `test:`).
- Új runtime-függőség nincs; devDependency csak a `yaml`.

---

## Fájlszerkezet

| Fájl | Felelősség |
|---|---|
| `src/content.config.ts` | a `tudastar` kollekció sémája (új) |
| `src/content/tudastar/.gitkeep` | a kollekció mappája (új; a cikkek ide jönnek) |
| `src/pages/tudastar/[slug].astro` | a Markdown-cikkek közös sablonja sémával és CTA-val (új) |
| `src/pages/tudastar/index.astro` | hub: a kollekció cikkei a kézi lista elé (módosul) |
| `src/data/tema-sor.json` | téma-sor (új) |
| `tools/tiltott-kifejezesek.json` | a kapu tiltólistája indoklással (új) |
| `tools/lib/frontmatter.mjs` | frontmatter + törzs szétválasztása (új) |
| `tools/lib/valaszto.mjs` + `tools/kovetkezo-tema.mjs` | választó, tiszta függvény + CLI (új) |
| `tools/lib/kapu.mjs` + `tools/cikk-kapu.mjs` | gépi kapu (új) |
| `tools/lib/dist.mjs` + `tools/dist-ellenorzes.mjs` | a kész build ellenőrzése (új) |
| `tools/lib/rendezes.mjs` + `tools/pr-rendezes.mjs` | PR-ok rendezése a téma-sorban (új) |
| `tools/lib/javaslat.mjs` + `tools/gsc-javaslat.mjs` | GSC-témajavaslatok (új) |
| `tests/*.test.mjs` | `node:test` tesztek (új) |
| `cikk-kor.md` | projektlap: a futás lépései és beállításai (új) |
| `docs/cikk-kor/iras-utasitas.md`, `docs/cikk-kor/pr-sablon.md` | írás-utasítás és PR-leírás sablon (új) |
| `.claude/settings.json` | a kör engedélyei (új, commitolva) |
| `.gitignore`, `package.json`, `public/llms.txt`, `README.md`, `content-backlog.md` | apró kiegészítések |
| `~/.claude/scheduled-tasks/heti-cikk-kor-fejersolarclean/SKILL.md` | az ütemezett feladat (a repón kívül) |

---

### Task 1: Content collection, sablon, hub

**Files:**
- Create: `src/content.config.ts`, `src/content/tudastar/.gitkeep`, `src/pages/tudastar/[slug].astro`
- Modify: `src/pages/tudastar/index.astro:1-62`, `.gitignore`, `package.json`

**Interfaces:**
- Produces: a `tudastar` kollekció; egy bejegyzés `id`-ja a fájlnév kiterjesztés nélkül (= slug), `data` a lenti séma. A cikk URL-je `/tudastar/<slug>/`. A `data-cta` érték a fejléc `cta` mezője.

- [ ] **Step 1: `.gitignore` és `package.json`**

`.gitignore` végére:

```
.worktrees/
```

`package.json` `scripts` blokkja:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "node --test tests/"
}
```

Futtasd: `npm install --save-dev yaml`
Elvárt: a `package.json`-ban `"devDependencies": { "yaml": "^2…" }`.

- [ ] **Step 2: A kollekció sémája**

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Tudástár-cikkek Markdownban (heti cikk-kör, spec 2.1). A fájlnév a slug.
const tudastar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tudastar' }),
  schema: z.object({
    title: z.string().max(62), // a sablon " | Péter"-t fűz hozzá, együtt ≤ 70
    description: z.string().max(160),
    elsodleges: z.string().min(1),
    bokor: z.enum(['napelem', 'klima', 'terulet']),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(2).max(4),
    forrasok: z.array(z.object({ nev: z.string(), url: z.string().url() })).min(1),
    cta: z.string().regex(/^call-[a-z0-9-]+$/),
  }),
});

export const collections = { tudastar };
```

`src/content/tudastar/.gitkeep`: üres fájl.

- [ ] **Step 3: A sablon**

`src/pages/tudastar/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { BRAND, PHONE_DISPLAY, PHONE_TEL, withBase } from '../../consts';

export async function getStaticPaths() {
  const cikkek = await getCollection('tudastar');
  return cikkek.map((cikk) => ({ params: { slug: cikk.id }, props: { cikk } }));
}

const { cikk } = Astro.props;
const { Content } = await render(cikk);
const d = cikk.data;

const title = `${d.title} | Péter`;
const description = d.description;
const homeUrl = withBase('/');
const tudastarUrl = withBase('/tudastar/');
const pageUrl = new URL(withBase(`/tudastar/${cikk.id}/`), Astro.site).toString();
const iso = (x: Date) => x.toISOString().slice(0, 10);

// A bokor szolgáltatás-oldala a crosslink-kártyához
const bokorLink = {
  napelem: { href: withBase('/napelem-tisztitas/'), cim: 'Napelemtisztítás', szoveg: 'módszer, árak, időpont' },
  klima: { href: withBase('/klimatisztitas/'), cim: 'Klímatisztítás és fertőtlenítés', szoveg: 'módszer, árak, időpont' },
  terulet: { href: withBase('/teruletek/'), cim: 'Kiszolgált területek', szoveg: 'hova megyünk ki' },
}[d.bokor];

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.title,
    description,
    datePublished: iso(d.datePublished),
    dateModified: iso(d.dateModified),
    inLanguage: 'hu',
    author: { '@type': 'Organization', name: BRAND },
    publisher: { '@type': 'Organization', name: BRAND },
    mainEntityOfPage: pageUrl,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: Astro.site?.toString() },
      { '@type': 'ListItem', position: 2, name: 'Tudástár', item: new URL(withBase('/tudastar/'), Astro.site).toString() },
      { '@type': 'ListItem', position: 3, name: d.title, item: pageUrl },
    ],
  },
];
---

<Base {title} {description} {schema} ogType="article">
  <section class="page-hero">
    <div class="wrap">
      <nav class="breadcrumb"><a href={homeUrl}>Főoldal</a> › <a href={tudastarUrl}>Tudástár</a> › {d.title}</nav>
      <span class="kicker">Tudástár</span>
      <h1>{d.title}</h1>
    </div>
  </section>

  <section class="section">
    <div class="wrap prose">
      <Content />

      <h2>Gyakori kérdések</h2>
      {d.faq.map((f) => (
        <>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </>
      ))}

      <a class="crosslink" href={bokorLink.href}>
        <span class="k">Szolgáltatás</span>
        <strong>{bokorLink.cim}</strong>: {bokorLink.szoveg}
        <span class="arw">→</span>
      </a>

      <div class="cta-band">
        <h2>Kérjen időpontot</h2>
        <p>A telefonban megbeszélt ár a helyszínen nem változik. Hívjon, és megbeszéljük az időpontot.</p>
        <a class="contact-phone" href={PHONE_TEL} data-cta={d.cta}>{PHONE_DISPLAY}</a><br />
        <a class="btn btn-call" href={PHONE_TEL} data-cta={`${d.cta}-btn`}>📞 Hívom most</a>
      </div>

      <div class="sources">
        <h2>Források</h2>
        <ol>
          {d.forrasok.map((f) => (
            <li><a href={f.url} rel="nofollow">{f.nev}</a></li>
          ))}
        </ol>
      </div>
    </div>
  </section>
</Base>
```

Megjegyzés: a Markdown-törzs első bekezdése a lede; a Markdownban `<p class="lede">…</p>` HTML-blokkal írjuk, hogy a kinézet egyezzen a régi cikkekkel (az írás-utasítás, Task 7, ezt előírja).

- [ ] **Step 4: A hub listázza a kollekciót**

`src/pages/tudastar/index.astro` frontmatterjének elejére (az `import { withBase }` sor után):

```ts
import { getCollection } from 'astro:content';

const kollekcio = (await getCollection('tudastar'))
  .sort((a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime())
  .map((c) => ({ href: withBase(`/tudastar/${c.id}/`), title: c.data.title, excerpt: c.data.description }));
```

A `const articles = [` sort írd át erre, a kézi tömb elé fűzve az újakat:

```ts
const articles = [
  ...kollekcio,
```

(A tömb többi eleme és a záró `];` változatlan.)

- [ ] **Step 5: Próbabuild egy ideiglenes cikkel**

Hozd létre `src/content/tudastar/proba-cikk.md`-t (ideiglenes, nem commitoljuk):

```md
---
title: "Próbacikk a sablonhoz"
description: "Ideiglenes cikk a sablon ellenőrzésére."
elsodleges: "próba"
bokor: klima
datePublished: 2026-10-23
dateModified: 2026-10-23
faq:
  - q: "Ez próba?"
    a: "Igen."
  - q: "Törlődik?"
    a: "Igen, a build után."
forrasok:
  - nev: "US DOE, energy.gov"
    url: "https://www.energy.gov/energysaver/air-conditioner-maintenance"
cta: "call-proba"
---

<p class="lede">Ez a lede. <a href="/klimatisztitas/">Klímatisztítás</a> és <a href="/arak/">árak</a>.</p>

## Egy címsor

Egy bekezdés.
```

Futtasd: `npm run build && grep -c 'application/ld+json' dist/tudastar/proba-cikk/index.html && grep -c 'href="/tudastar/proba-cikk/"' dist/tudastar/index.html && grep -c 'tudastar/proba-cikk/' dist/sitemap-0.xml && grep -c 'data-cta="call-proba"' dist/tudastar/proba-cikk/index.html`
Elvárt: `3`, `1`, `1`, `1` (három JSON-LD blokk, a hub linkeli, a sitemapben van, a CTA attribútum ott van).

Töröld: `rm src/content/tudastar/proba-cikk.md && npm run build`
Elvárt: a build zöld a kollekció üres mappájával is; `ls dist/tudastar/` nem tartalmaz `proba-cikk`-et.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json package-lock.json src/content.config.ts src/content/tudastar/.gitkeep src/pages/tudastar/[slug].astro src/pages/tudastar/index.astro
git commit -m "feat(tudastar): Markdown content collection közös cikk-sablonnal, a hub listázza"
```

---

### Task 2: Téma-sor, tiltólista, frontmatter-olvasó

**Files:**
- Create: `src/data/tema-sor.json`, `tools/tiltott-kifejezesek.json`, `tools/lib/frontmatter.mjs`
- Test: `tests/frontmatter.test.mjs`

**Interfaces:**
- Produces: `szetszed(szoveg) → { fejlec: object, torzs: string }` (hibát dob, ha nincs `---` blokk); a téma-sor JSON alakja (lent), amit a Task 3–6 függvényei olvasnak.

- [ ] **Step 1: A téma-sor**

`src/data/tema-sor.json` (12 induló téma; `allapotDatum` az állapot utolsó változásának napja, `topic`-nál `null`):

```json
{
  "_megjegyzes": "Heti cikk-kör téma-sora (spec 2.2). allapot: topic → draft (PR nyitva) → live (merge-elve). forras: szezon | gsc | ugyfel. szezon: hónapok, amikor a kérdés aktuális. A választó: tools/kovetkezo-tema.mjs.",
  "frissitve": "2026-10-23",
  "items": [
    { "id": "futesre-optimalizalt-klima-oszi-tisztitas", "kerdes": "Fűtésre optimalizált klímát ősszel is kell tisztíttatni?", "elsodleges": "klíma tisztítás ősszel", "bokor": "klima", "szezon": [9, 10, 11], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "lomb-pollen-madarurulek-napelemen-osszel", "kerdes": "Lehullott lomb és madárürülék a napelemen: mit tegyen ősszel?", "elsodleges": "napelem tisztítás ősszel", "bokor": "napelem", "szezon": [9, 10, 11], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "mi-tortenik-ha-nem-tisztittatom-a-klimat", "kerdes": "Mi történik, ha nem tisztíttatom a klímát?", "elsodleges": "klíma tisztítás elmaradása", "bokor": "klima", "szezon": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "forras": "ugyfel", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "ho-es-jeg-a-napelemen", "kerdes": "Hó és jég a napelemen: le kell takarítani?", "elsodleges": "napelem hó eltávolítás", "bokor": "napelem", "szezon": [11, 12, 1, 2], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "klima-futes-kozben-dohos-szag", "kerdes": "Fűtés közben dohos szagú a klíma: mi az oka?", "elsodleges": "klíma dohos szag fűtés", "bokor": "klima", "szezon": [10, 11, 12, 1, 2, 3], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "tavaszi-pollen-a-napelemen", "kerdes": "Tavaszi pollen a napelemen: mennyit vesz el a termelésből?", "elsodleges": "napelem pollen", "bokor": "napelem", "szezon": [3, 4, 5, 6], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "klimatisztitas-hutesi-szezon-elott-mikor", "kerdes": "Klímatisztítás a hűtési szezon előtt: mikor érdemes időpontot foglalni?", "elsodleges": "klímatisztítás tavasszal", "bokor": "klima", "szezon": [3, 4, 5], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "serul-a-napelem-tisztitas-kozben", "kerdes": "Sérülhet a napelem tisztítás közben?", "elsodleges": "napelem tisztítás sérülés", "bokor": "napelem", "szezon": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "forras": "ugyfel", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "klima-csopog-vagy-gyengen-hut", "kerdes": "Csöpög vagy gyengén hűt a klíma: mikor a kosz az ok?", "elsodleges": "klíma gyengén hűt", "bokor": "klima", "szezon": [5, 6, 7, 8], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "nyaralo-apartman-klima-szezon-elott", "kerdes": "Nyaraló és apartman klímája: mikor tisztíttassa a szezon előtt?", "elsodleges": "apartman klímatisztítás", "bokor": "terulet", "szezon": [4, 5, 6], "forras": "szezon", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "szamla-es-ceges-ugyfelek", "kerdes": "Kapok számlát? Cégeknek is dolgoznak?", "elsodleges": "napelemtisztítás számlával", "bokor": "napelem", "szezon": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "forras": "ugyfel", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null },
    { "id": "hogyan-zajlik-az-idopont-es-a-munka", "kerdes": "Hogyan zajlik az időpont-egyeztetés és maga a munka?", "elsodleges": "napelemtisztítás menete", "bokor": "napelem", "szezon": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "forras": "ugyfel", "allapot": "topic", "allapotDatum": null, "adat": null, "kizarva": null }
  ]
}
```

- [ ] **Step 2: A tiltólista**

`tools/tiltott-kifejezesek.json` (kisbetűs szótövek; a kapu `includes`-szal keres, így a ragozott alakot is fogja):

```json
{
  "_megjegyzes": "content-backlog.md „Trust signals confirmed by owner” szerint. Bővítéskor oda is írd be az okot.",
  "tiltott": [
    { "kifejezes": "vegyszermentes", "ok": "Péter használ tisztítószert (2026-07-27)" },
    { "kifejezes": "vegyszer nélkül", "ok": "Péter használ tisztítószert (2026-07-27)" },
    { "kifejezes": "garancia", "ok": "nem megerősített" },
    { "kifejezes": "garantál", "ok": "nem megerősített" },
    { "kifejezes": "biztosítás", "ok": "nem megerősített" },
    { "kifejezes": "biztosított", "ok": "nem megerősített" },
    { "kifejezes": "éve dolgoz", "ok": "évek száma nem megerősített" },
    { "kifejezes": "éves tapasztalat", "ok": "évek száma nem megerősített" },
    { "kifejezes": "év tapasztalat", "ok": "évek száma nem megerősített" },
    { "kifejezes": "megtérül", "ok": "ellentmond az évi rendszeres tisztításnak; helyette: a veszteség évente újratermelődik" },
    { "kifejezes": "hőszivattyús", "ok": "helyette: fűtésre optimalizált készülék" },
    { "kifejezes": "fűtésre is használt", "ok": "helyette: fűtésre optimalizált készülék" },
    { "kifejezes": "kimondott ár", "ok": "helyette: előre kalkulálható ár" }
  ],
  "hirszavak": ["ma ", "tegnap", "a héten", "idén nyáron", "idén télen", "jelenleg", "a napokban", "friss hír"]
}
```

- [ ] **Step 3: Teszt a frontmatter-olvasóra**

`tests/frontmatter.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { szetszed } from '../tools/lib/frontmatter.mjs';

test('szétszedi a fejlécet és a törzset', () => {
  const r = szetszed('---\ntitle: "Cím"\nfaq:\n  - q: "K?"\n    a: "V."\n---\n\nTörzs.\n');
  assert.equal(r.fejlec.title, 'Cím');
  assert.equal(r.fejlec.faq[0].q, 'K?');
  assert.equal(r.torzs.trim(), 'Törzs.');
});

test('hibát dob fejléc nélkül', () => {
  assert.throws(() => szetszed('Nincs fejléc.'), /fejléc/);
});
```

Futtasd: `npm test`
Elvárt: FAIL, `Cannot find module '…/tools/lib/frontmatter.mjs'`.

- [ ] **Step 4: A frontmatter-olvasó**

`tools/lib/frontmatter.mjs`:

```js
import { parse } from 'yaml';

// A cikkfájl eleje: ---\n<YAML>\n---\n<Markdown>
export function szetszed(szoveg) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(szoveg);
  if (!m) throw new Error('nincs YAML fejléc (--- … ---) a fájl elején');
  return { fejlec: parse(m[1]) ?? {}, torzs: m[2] };
}
```

Futtasd: `npm test`
Elvárt: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/tema-sor.json tools/tiltott-kifejezesek.json tools/lib/frontmatter.mjs tests/frontmatter.test.mjs
git commit -m "feat(cikk-kor): téma-sor 12 induló témával, tiltólista, frontmatter-olvasó"
```

---

### Task 3: Választó

**Files:**
- Create: `tools/lib/valaszto.mjs`, `tools/kovetkezo-tema.mjs`
- Test: `tests/valaszto.test.mjs`

**Interfaces:**
- Consumes: a téma-sor JSON (Task 2).
- Produces: `kovetkezoTema(temaSor, { ma: Date }) → { pick: item|null, ranked: item[], skipped: [{ id, ok }] }`; CLI: `node tools/kovetkezo-tema.mjs [--datum ÉÉÉÉ-HH-NN]` ugyanezt JSON-ként az stdoutra.

- [ ] **Step 1: Tesztek**

`tests/valaszto.test.mjs`:

```js
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
```

Futtasd: `npm test`
Elvárt: FAIL, a modul hiányzik.

- [ ] **Step 2: A választó**

`tools/lib/valaszto.mjs`:

```js
// Választó (spec 2.3): topic, nincs kizárva, szezonban (ez vagy a következő hónap);
// sorrend: gsc elöl megjelenés szerint, aztán bokor-váltás, aztán a tömb sorrendje.
export function kovetkezoTema(temaSor, { ma = new Date() } = {}) {
  const honap = ma.getMonth() + 1;
  const kovetkezo = (honap % 12) + 1;
  const skipped = [];
  const jeloltek = [];
  temaSor.items.forEach((t, i) => {
    if (t.allapot !== 'topic') return skipped.push({ id: t.id, ok: `allapot: ${t.allapot}` });
    if (t.kizarva) return skipped.push({ id: t.id, ok: `kizárva: ${t.kizarva.ok}` });
    if (!t.szezon.includes(honap) && !t.szezon.includes(kovetkezo)) {
      return skipped.push({ id: t.id, ok: `nem szezon (${honap}. és ${kovetkezo}. hónap)` });
    }
    jeloltek.push({ t, i });
  });
  const utolso = temaSor.items
    .filter((t) => (t.allapot === 'draft' || t.allapot === 'live') && t.allapotDatum)
    .sort((a, b) => b.allapotDatum.localeCompare(a.allapotDatum))[0];
  const utolsoBokor = utolso?.bokor ?? null;
  const kulcs = ({ t, i }) => [
    t.forras === 'gsc' ? 0 : 1,
    t.forras === 'gsc' ? -(t.adat?.megjelenes ?? 0) : 0,
    t.bokor === utolsoBokor ? 1 : 0,
    i,
  ];
  const ranked = jeloltek
    .sort((a, b) => {
      const ka = kulcs(a); const kb = kulcs(b);
      for (let j = 0; j < ka.length; j++) if (ka[j] !== kb[j]) return ka[j] - kb[j];
      return 0;
    })
    .map(({ t }) => t);
  return { pick: ranked[0] ?? null, ranked, skipped };
}
```

`tools/kovetkezo-tema.mjs`:

```js
#!/usr/bin/env node
// node tools/kovetkezo-tema.mjs [--datum ÉÉÉÉ-HH-NN] [--tema-sor <fájl>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kovetkezoTema } from './lib/valaszto.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (nev, alap) => { const i = process.argv.indexOf(nev); return i > -1 ? process.argv[i + 1] : alap; };
const temaSor = JSON.parse(fs.readFileSync(arg('--tema-sor', path.join(ROOT, 'src/data/tema-sor.json')), 'utf8'));
const ma = arg('--datum') ? new Date(arg('--datum')) : new Date();
process.stdout.write(`${JSON.stringify(kovetkezoTema(temaSor, { ma }), null, 2)}\n`);
```

Futtasd: `npm test && node tools/kovetkezo-tema.mjs --datum 2026-10-26 | head -5`
Elvárt: minden teszt zöld; a `pick.id` `futesre-optimalizalt-klima-oszi-tisztitas` (az első októberi téma; nincs még draft/live, ezért nincs bokor-váltás).

- [ ] **Step 3: Commit**

```bash
git add tools/lib/valaszto.mjs tools/kovetkezo-tema.mjs tests/valaszto.test.mjs
git commit -m "feat(cikk-kor): választó szezon-ablakkal, gsc-elsőbbséggel és bokor-váltással"
```

---

### Task 4: Gépi kapu

**Files:**
- Create: `tools/lib/kapu.mjs`, `tools/cikk-kapu.mjs`
- Test: `tests/kapu.test.mjs`

**Interfaces:**
- Consumes: `szetszed` (Task 2), `tools/tiltott-kifejezesek.json`.
- Produces: `kapu(szoveg, { slug, letezik: (utvonal) => boolean, tiltott, hirszavak }) → { pass, failures: string[], warnings: string[] }`; CLI: `node tools/cikk-kapu.mjs <fájl>` → JSON az stdoutra, kilépési kód 1, ha `pass: false`.

- [ ] **Step 1: Tesztek**

`tests/kapu.test.mjs`:

```js
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
```

Futtasd: `npm test`
Elvárt: FAIL, a modul hiányzik.

- [ ] **Step 2: A kapu**

`tools/lib/kapu.mjs`:

```js
import { szetszed } from './frontmatter.mjs';

const BOKROK = ['napelem', 'klima', 'terulet'];
const BELSO = /(?:\]\(|href=")(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)/g;
const KULSO = /https?:\/\/[^\s)"'>]+/;
const SZAM = /\d\s?%|\d[\d\s.]*\s?Ft\b/;

const kisbetu = (s) => s.toLowerCase();
const to = (szo) => kisbetu(szo).slice(0, 5);

export function kapu(szoveg, { slug, letezik, tiltott, hirszavak }) {
  const failures = [];
  const warnings = [];
  let fejlec; let torzs;
  try { ({ fejlec, torzs } = szetszed(szoveg)); } catch (e) { return { pass: false, failures: [e.message], warnings }; }

  // 1. fejléc
  const f = fejlec;
  if (typeof f.title !== 'string' || !f.title || f.title.length > 62) failures.push('title hiányzik vagy 62 karakternél hosszabb');
  if (typeof f.description !== 'string' || !f.description || f.description.length > 160) failures.push('description hiányzik vagy 160 karakternél hosszabb');
  if (typeof f.elsodleges !== 'string' || !f.elsodleges) failures.push('elsodleges hiányzik');
  if (!BOKROK.includes(f.bokor)) failures.push(`bokor nem napelem/klima/terulet: ${f.bokor}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.datePublished ?? '').slice(0, 10))) failures.push('datePublished hiányzik vagy nem ÉÉÉÉ-HH-NN');
  if (!Array.isArray(f.faq) || f.faq.length < 2 || f.faq.length > 4 || f.faq.some((x) => !x?.q || !x?.a)) failures.push('faq: 2–4 elem kell, mindegyik q és a mezővel');
  if (!Array.isArray(f.forrasok) || !f.forrasok.length || f.forrasok.some((x) => !x?.nev || !/^https?:\/\//.test(x?.url ?? ''))) failures.push('forrasok: legalább 1 elem nev és http(s) url mezővel');
  if (typeof f.cta !== 'string' || !/^call-[a-z0-9-]+$/.test(f.cta)) failures.push('cta hiányzik vagy nem call- kezdetű');

  // 2. slug egyedi
  if (letezik(`/tudastar/${slug}/`)) failures.push(`a slug már létezik: ${slug}`);

  // 3. tiltott kifejezések (fejléc + törzs, kisbetűsen; a ragozott alakot az includes fogja)
  const teljes = kisbetu(szoveg);
  for (const t of tiltott) if (teljes.includes(kisbetu(t.kifejezes))) failures.push(`tiltott kifejezés: „${t.kifejezes}” (${t.ok})`);

  // 4. belső linkek
  const belso = [...new Set([...torzs.matchAll(BELSO)].map((m) => m[1]))];
  if (belso.length < 2) failures.push(`legalább 2 belső link kell, most ${belso.length}`);
  for (const p of belso) if (!letezik(p)) failures.push(`belső link célja nem létezik: ${p}`);

  // 5. szám forrás nélkül
  const bekezdesek = torzs.split(/\n\s*\n/);
  for (const b of bekezdesek) {
    if (b.trim().startsWith('#')) continue;
    for (const mondat of b.split(/(?<=[.!?])\s+/)) {
      if (SZAM.test(mondat) && !KULSO.test(b) && !/tapasztalat/i.test(mondat)) failures.push(`szám forráslink nélkül: „${mondat.trim().slice(0, 60)}…”`);
    }
  }

  // 6. elsődleges kulcsszó a címben vagy a ledében (szótövek első 5 karaktere)
  const lede = bekezdesek.find((b) => b.trim() && !b.trim().startsWith('#')) ?? '';
  const mezo = kisbetu(`${f.title ?? ''} ${lede}`);
  const szavak = String(f.elsodleges ?? '').split(/\s+/).filter((s) => s.length >= 4);
  if (szavak.length && !szavak.every((sz) => mezo.includes(to(sz)))) failures.push(`az elsődleges kulcsszó („${f.elsodleges}”) nincs a címben vagy az első bekezdésben`);

  // 7. hírszavak: figyelmeztetés
  for (const h of hirszavak) if (kisbetu(torzs).includes(h)) warnings.push(`hírértelmű szó: „${h.trim()}”`);

  return { pass: failures.length === 0, failures, warnings };
}
```

`tools/cikk-kapu.mjs`:

```js
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
```

Futtasd: `npm test`
Elvárt: minden teszt zöld (frontmatter 2, választó 5, kapu 8).

- [ ] **Step 3: Commit**

```bash
git add tools/lib/kapu.mjs tools/cikk-kapu.mjs tests/kapu.test.mjs
git commit -m "feat(cikk-kor): gépi kapu – fejléc, tiltólista, belső linkek, forrás a számok mellett"
```

---

### Task 5: Dist-ellenőrzés

**Files:**
- Create: `tools/lib/dist.mjs`, `tools/dist-ellenorzes.mjs`
- Test: `tests/dist.test.mjs`

**Interfaces:**
- Produces: `distEllenorzes({ dist, slug, siteUrl }) → { rendben, hibak: string[] }`; CLI: `node tools/dist-ellenorzes.mjs <slug>` (dist = `./dist`, siteUrl = `https://fejersolarclean.hu`), kilépési kód 1, ha nem rendben.

- [ ] **Step 1: Teszt egy hamis dist-tel**

`tests/dist.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { distEllenorzes } from '../tools/lib/dist.mjs';

const ld = (t) => `<script type="application/ld+json">${JSON.stringify({ '@type': t })}</script>`;
function hamisDist({ sema = ['Article', 'FAQPage', 'BreadcrumbList'], hub = true, sitemap = true } = {}) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'));
  fs.mkdirSync(path.join(d, 'tudastar/proba'), { recursive: true });
  fs.writeFileSync(path.join(d, 'tudastar/proba/index.html'), `<html>${sema.map(ld).join('')}</html>`);
  fs.writeFileSync(path.join(d, 'tudastar/index.html'), hub ? '<a href="/tudastar/proba/">x</a>' : '<a href="/tudastar/mas/">x</a>');
  fs.writeFileSync(path.join(d, 'sitemap-0.xml'), sitemap ? '<loc>https://example.hu/tudastar/proba/</loc>' : '<loc>https://example.hu/</loc>');
  return d;
}
const opts = (dist) => ({ dist, slug: 'proba', siteUrl: 'https://example.hu' });

test('teljes dist rendben', () => {
  const r = distEllenorzes(opts(hamisDist()));
  assert.deepEqual(r.hibak, []);
  assert.equal(r.rendben, true);
});

test('hiányzó oldal, hub-link, sitemap és séma külön hibák', () => {
  const r1 = distEllenorzes({ ...opts(hamisDist()), slug: 'nincs' });
  assert.ok(r1.hibak.some((h) => /nem létezik/.test(h)));
  const r2 = distEllenorzes(opts(hamisDist({ hub: false })));
  assert.ok(r2.hibak.some((h) => /hub/.test(h)));
  const r3 = distEllenorzes(opts(hamisDist({ sitemap: false })));
  assert.ok(r3.hibak.some((h) => /sitemap/.test(h)));
  const r4 = distEllenorzes(opts(hamisDist({ sema: ['Article'] })));
  assert.ok(r4.hibak.some((h) => /FAQPage/.test(h)));
});
```

Futtasd: `npm test`
Elvárt: FAIL, a modul hiányzik.

- [ ] **Step 2: Az ellenőrző**

`tools/lib/dist.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';

const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

export function distEllenorzes({ dist, slug, siteUrl }) {
  const hibak = [];
  const oldal = path.join(dist, 'tudastar', slug, 'index.html');
  if (!fs.existsSync(oldal)) return { rendben: false, hibak: [`az oldal nem létezik a buildben: ${oldal}`] };
  const html = fs.readFileSync(oldal, 'utf8');
  const tipusok = [];
  for (const m of html.matchAll(LD)) {
    try { tipusok.push(JSON.parse(m[1])['@type']); } catch { hibak.push('érvénytelen JSON-LD blokk'); }
  }
  for (const t of ['Article', 'FAQPage', 'BreadcrumbList']) if (!tipusok.includes(t)) hibak.push(`hiányzó séma: ${t}`);
  const hub = fs.readFileSync(path.join(dist, 'tudastar/index.html'), 'utf8');
  if (!hub.includes(`href="/tudastar/${slug}/"`)) hibak.push('a hub nem linkeli az új cikket');
  const sitemap = fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');
  if (!sitemap.includes(`${siteUrl}/tudastar/${slug}/`)) hibak.push('a sitemap nem tartalmazza az új cikket');
  return { rendben: hibak.length === 0, hibak };
}
```

`tools/dist-ellenorzes.mjs`:

```js
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
```

Futtasd: `npm test`
Elvárt: zöld.

- [ ] **Step 3: Commit**

```bash
git add tools/lib/dist.mjs tools/dist-ellenorzes.mjs tests/dist.test.mjs
git commit -m "feat(cikk-kor): a kész build ellenőrzése (oldal, hub-link, sitemap, séma)"
```

---

### Task 6: PR-rendezés és GSC-javaslat

**Files:**
- Create: `tools/lib/rendezes.mjs`, `tools/pr-rendezes.mjs`, `tools/lib/javaslat.mjs`, `tools/gsc-javaslat.mjs`
- Test: `tests/rendezes.test.mjs`, `tests/javaslat.test.mjs`

**Interfaces:**
- Consumes: a téma-sor (Task 2).
- Produces:
  - `rendez(temaSor, { prs, agak, eloRendben, ma, maxNyitott = 2, emlekeztetoNap = 21 }) → { temaSor, teendok, nyitott, irhat }`. `prs`: `[{ number, state: 'OPEN'|'MERGED'|'CLOSED', headRefName, createdAt, zaroKomment }]`; `agak`: a távoli `cikk/*` ágak nevei; `eloRendben`: `{ [slug]: boolean }` a merge-elt témákra. `teendok` elemei: `{ tipus: 'ag-torles'|'emlekezteto'|'felbemaradt'|'ujra-nez', slug|number }`.
  - CLI `node tools/pr-rendezes.mjs` – maga hívja a `gh`-t és az élő ellenőrzést, átírja a téma-sort, a teendőket JSON-ként kiírja. `--proba`: nem ír fájlt.
  - `javaslatok(sorok, { temaSor, oldalak, ma, max = 3 }) → item[]`; `sorok`: `[{ query, page, impressions, clicks, position }]`; `oldalak`: `[{ cim, elsodleges }]`.
  - CLI `node tools/gsc-javaslat.mjs <sorok.json>` – beolvassa a repó oldalait, hozzáfűzi a javaslatokat a téma-sorhoz, a felvett témákat JSON-ként kiírja. `--proba`: nem ír fájlt.

- [ ] **Step 1: Tesztek a rendezésre**

`tests/rendezes.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rendez } from '../tools/lib/rendezes.mjs';

const tema = (id, allapot = 'draft') => ({ id, kerdes: id, elsodleges: id, bokor: 'klima', szezon: [1], forras: 'szezon', allapot, allapotDatum: '2026-10-19', adat: null, kizarva: null });
const pr = (number, state, slug, extra = {}) => ({ number, state, headRefName: `cikk/${slug}`, createdAt: '2026-10-19T09:00:00Z', zaroKomment: null, ...extra });
const ma = new Date('2026-10-26');

test('merge-elt és élő → live', () => {
  const r = rendez({ items: [tema('a')] }, { prs: [pr(1, 'MERGED', 'a')], agak: [], eloRendben: { a: true }, ma });
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
```

- [ ] **Step 2: Tesztek a javaslatra**

`tests/javaslat.test.mjs`:

```js
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
  const r = javaslatok(sorok, { temaSor: { items: [{ id: 'a-klima-b', adat: { lekerdezes: 'a klíma b' } }] }, oldalak, ma, max: 2 });
  assert.deepEqual(r.map((x) => x.id), ['g-klima-h', 'e-klima-f']);
});
```

Futtasd: `npm test`
Elvárt: FAIL, a két modul hiányzik.

- [ ] **Step 3: A rendezés**

`tools/lib/rendezes.mjs`:

```js
// A rész (spec 3.A): PR-állapotok → téma-sor állapotok + teendők. Fájlt nem ír, hálózatot nem hív.
const iso = (d) => d.toISOString().slice(0, 10);
const slugOf = (ag) => (ag.startsWith('cikk/') ? ag.slice(5) : null);

export function rendez(temaSor, { prs, agak, eloRendben, ma = new Date(), maxNyitott = 2, emlekeztetoNap = 21 }) {
  const items = temaSor.items.map((t) => ({ ...t }));
  const byId = Object.fromEntries(items.map((t) => [t.id, t]));
  const teendok = [];
  const prAgak = new Set(prs.map((p) => p.headRefName));
  let nyitott = 0;

  for (const p of prs) {
    const slug = slugOf(p.headRefName);
    if (!slug) continue;
    const t = byId[slug];
    if (p.state === 'OPEN') {
      nyitott++;
      const kor = (ma - new Date(p.createdAt)) / 86_400_000;
      if (kor > emlekeztetoNap) teendok.push({ tipus: 'emlekezteto', number: p.number, slug });
    } else if (p.state === 'MERGED') {
      if (t && t.allapot === 'draft') {
        if (eloRendben[slug]) { t.allapot = 'live'; t.allapotDatum = iso(ma); teendok.push({ tipus: 'ag-torles', slug }); }
        else teendok.push({ tipus: 'ujra-nez', slug });
      }
    } else if (p.state === 'CLOSED') {
      if (t && t.allapot === 'draft') {
        t.allapot = 'topic'; t.allapotDatum = null;
        t.kizarva = { datum: iso(ma), ok: p.zaroKomment || 'bezárva indoklás nélkül' };
      }
      teendok.push({ tipus: 'ag-torles', slug });
    }
  }
  for (const ag of agak) {
    const slug = slugOf(ag);
    if (slug && !prAgak.has(ag)) teendok.push({ tipus: 'felbemaradt', slug });
  }
  return { temaSor: { ...temaSor, items }, teendok, nyitott, irhat: nyitott < maxNyitott };
}
```

`tools/pr-rendezes.mjs`:

```js
#!/usr/bin/env node
// node tools/pr-rendezes.mjs [--proba]  – gh + élő ellenőrzés + téma-sor írása
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { rendez } from './lib/rendezes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://fejersolarclean.hu';
const proba = process.argv.includes('--proba');
const temaSorUt = path.join(ROOT, 'src/data/tema-sor.json');
const temaSor = JSON.parse(fs.readFileSync(temaSorUt, 'utf8'));

const gh = JSON.parse(execFileSync('gh', ['pr', 'list', '--label', 'cikk-kor', '--state', 'all', '--limit', '30', '--json', 'number,state,headRefName,createdAt,comments'], { cwd: ROOT, encoding: 'utf8' }));
const prs = gh.map((p) => ({ number: p.number, state: p.state, headRefName: p.headRefName, createdAt: p.createdAt, zaroKomment: p.comments?.at(-1)?.body?.trim() || null }));
const agak = execFileSync('git', ['ls-remote', '--heads', 'origin', 'refs/heads/cikk/*'], { cwd: ROOT, encoding: 'utf8' })
  .split('\n').filter(Boolean).map((s) => s.split('refs/heads/')[1]);

async function el(slug) {
  try {
    const r = await fetch(`${SITE}/tudastar/${slug}/`, { method: 'HEAD' });
    if (r.status !== 200) return false;
    const sm = await (await fetch(`${SITE}/sitemap-0.xml`)).text();
    return sm.includes(`${SITE}/tudastar/${slug}/`);
  } catch { return false; }
}
const eloRendben = {};
for (const p of prs) if (p.state === 'MERGED') { const slug = p.headRefName.slice(5); eloRendben[slug] = await el(slug); }

const r = rendez(temaSor, { prs, agak, eloRendben, ma: new Date() });
const valtozott = JSON.stringify(r.temaSor.items) !== JSON.stringify(temaSor.items);
if (valtozott && !proba) fs.writeFileSync(temaSorUt, `${JSON.stringify({ ...r.temaSor, frissitve: new Date().toISOString().slice(0, 10) }, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ nyitott: r.nyitott, irhat: r.irhat, temaSorValtozott: valtozott, teendok: r.teendok, proba }, null, 2)}\n`);
```

- [ ] **Step 4: A javaslat**

`tools/lib/javaslat.mjs`:

```js
// C rész (spec 3.C): GSC lekérdezés × oldal sorokból új témák.
export const slugosit = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const to = (szo) => szo.toLowerCase().slice(0, 5);
const szavak = (q) => q.split(/\s+/).filter((s) => s.length >= 4);
const bokor = (q) => (/klím|klim/i.test(q) ? 'klima' : /napelem/i.test(q) ? 'napelem' : 'terulet');

export function javaslatok(sorok, { temaSor, oldalak, ma = new Date(), max = 3, minMegjelenes = 5 }) {
  const osszes = new Map();
  for (const s of sorok) {
    const q = s.query.trim().toLowerCase();
    const e = osszes.get(q) ?? { lekerdezes: q, megjelenes: 0, kattintas: 0, poziciok: [] };
    e.megjelenes += s.impressions; e.kattintas += s.clicks; e.poziciok.push(s.position);
    osszes.set(q, e);
  }
  const megvan = new Set(temaSor.items.map((t) => t.adat?.lekerdezes).filter(Boolean));
  const ids = new Set(temaSor.items.map((t) => t.id));
  const lefedett = (q) => oldalak.some((o) => { const m = `${o.cim} ${o.elsodleges ?? ''}`.toLowerCase(); return szavak(q).every((sz) => m.includes(to(sz))); });
  return [...osszes.values()]
    .filter((e) => e.megjelenes >= minMegjelenes && e.kattintas === 0 && !megvan.has(e.lekerdezes) && !ids.has(slugosit(e.lekerdezes)) && !lefedett(e.lekerdezes))
    .sort((a, b) => b.megjelenes - a.megjelenes)
    .slice(0, max)
    .map((e) => ({
      id: slugosit(e.lekerdezes),
      kerdes: `${e.lekerdezes.charAt(0).toUpperCase()}${e.lekerdezes.slice(1)}?`,
      elsodleges: e.lekerdezes,
      bokor: bokor(e.lekerdezes),
      szezon: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      forras: 'gsc',
      allapot: 'topic',
      allapotDatum: null,
      adat: { lekerdezes: e.lekerdezes, megjelenes: e.megjelenes, kattintas: e.kattintas, pozicio: Math.round((e.poziciok.reduce((a, b) => a + b, 0) / e.poziciok.length) * 10) / 10, ablak: `28 nap, ${ma.toISOString().slice(0, 10)}-ig` },
      kizarva: null,
    }));
}
```

`tools/gsc-javaslat.mjs`:

```js
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
  temaSor.frissitve = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(temaSorUt, `${JSON.stringify(temaSor, null, 2)}\n`);
}
process.stdout.write(`${JSON.stringify({ felvett: uj, proba }, null, 2)}\n`);
```

Futtasd: `npm test`
Elvárt: minden zöld (frontmatter 2, választó 5, kapu 8, dist 2, rendezés 5, javaslat 3).

- [ ] **Step 5: Commit**

```bash
git add tools/lib/rendezes.mjs tools/pr-rendezes.mjs tools/lib/javaslat.mjs tools/gsc-javaslat.mjs tests/rendezes.test.mjs tests/javaslat.test.mjs
git commit -m "feat(cikk-kor): PR-rendezés a téma-sorban + GSC-témajavaslatok"
```

---

### Task 7: Projektlap, írás-utasítás, PR-sablon, engedélyek

**Files:**
- Create: `cikk-kor.md`, `docs/cikk-kor/iras-utasitas.md`, `docs/cikk-kor/pr-sablon.md`, `.claude/settings.json`
- Modify: `README.md` (Status és Commands), `content-backlog.md` (egy új szakasz)

**Interfaces:**
- Consumes: a Task 3–6 CLI-jei pontosan a fenti kapcsolókkal.
- Produces: a futás egyetlen forgatókönyve (a projektlap), amit a Task 8 ütemezett feladata végrehajt.

- [ ] **Step 1: A projektlap**

`cikk-kor.md`:

````md
# Heti cikk-kör – fejersolarclean.hu

> A hétfői ütemezett feladat ezt hajtja végre, lépésről lépésre. A döntéseket a szkriptek hozzák; amit a lap nem tartalmaz, azt a kör nem csinálja. Terv: `docs/superpowers/specs/2026-10-23-heti-cikk-kor-design.md`.

## Tudnivalók

- A `main`-re a kör soha nem ír: minden változás egy `cikk/<slug>` ágon, pull requestben megy, a merge Márton igene. A GitHub Actions a merge után kiad.
- A fő checkout a `riportok/` mappában mentetlen fájlokat tart; ez nem akadály, mert a kör worktree-ben dolgozik (`.worktrees/cikk-<slug>`).
- Tiltott és helyes megfogalmazások: `tools/tiltott-kifejezesek.json` és a `content-backlog.md` „Trust signals confirmed by owner” szakasza. Szám csak letöltéssel ellenőrzött elsődleges forrással.
- Ha egy parancsot az engedélykezelés megállít: ne kerüld meg, írd a naplóba, melyik, és állj meg.
- Próba mód: `PROBA=1` a lap elején → a 9. lépés (push, PR) kimarad, a worktree és az ág helyben marad, a napló neve `proba-<ma>.md`.

## Beállítások

```json
{
  "projekt": "fejersolarclean.hu",
  "ag": "main",
  "sajatUtvonalak": ["src/content/tudastar", "src/data/tema-sor.json", "public/llms.txt", "src/pages"],
  "worktree": ".worktrees/cikk-{slug}",
  "cikkAg": "cikk/{slug}",
  "naploMappa": "riportok/cikk-kor",
  "plafon": { "nyitottPr": 2, "emlekeztetoNap": 21 },
  "parancsok": {
    "rendezes": "node tools/pr-rendezes.mjs",
    "valaszto": "node tools/kovetkezo-tema.mjs",
    "kapu": "node tools/cikk-kapu.mjs src/content/tudastar/{slug}.md",
    "build": "npm run build",
    "teszt": "npm test",
    "distEllenorzes": "node tools/dist-ellenorzes.mjs {slug}",
    "javaslat": "node tools/gsc-javaslat.mjs {sorokFajl}"
  },
  "utasitasok": { "iras": "docs/cikk-kor/iras-utasitas.md", "pr": "docs/cikk-kor/pr-sablon.md" },
  "site": { "url": "https://fejersolarclean.hu", "utvonal": "/tudastar/{slug}/" },
  "gsc": { "property": "sc-domain:fejersolarclean.hu", "napok": 28, "minMegjelenes": 5 },
  "prCimke": "cikk-kor"
}
```

## Egy futás

Minden lépés után egy sor a naplóba (`riportok/cikk-kor/<ma>.md`): `- <lépés>: siker | kimaradt | hiba – <ok>`.

**0. Zár és előfeltételek**
1. Ha `riportok/cikk-kor/<ma>.md` létezik → írd ki, hogy ma már futott, és állj meg.
2. `git -C <repó> status --porcelain -- src/content/tudastar src/data/tema-sor.json public/llms.txt src/pages` legyen üres, és `git rev-parse --abbrev-ref HEAD` = `main`. Ha nem: napló `hiba`, állj meg.
3. `git fetch origin main`.

**A. Rendezés**
4. `node tools/pr-rendezes.mjs` → `{ nyitott, irhat, temaSorValtozott, teendok }`. Teendők:
   - `ag-torles` → `git push origin --delete cikk/<slug>` (ha az ág létezik);
   - `emlekezteto` → `gh pr comment <number> --body "Emlékeztető: ez a cikk <N> napja vár jóváhagyásra. Merge = kiadás, bezárás = a téma kizárása."`;
   - `ujra-nez` → csak napló (a merge kint van, de az élő oldal még nem válaszol; a következő futás újra nézi);
   - `felbemaradt` → `git worktree add .worktrees/cikk-<slug> cikk/<slug>`, ott `npm run build && node tools/dist-ellenorzes.mjs <slug>`; ha zöld, folytasd a 9. lépéstől ezzel a sluggal; ha piros, `git push origin --delete cikk/<slug>`, worktree törlése.
   Ha `temaSorValtozott`, a módosított `src/data/tema-sor.json` a B rész ágára kerül (ha nincs B rész, a C rész kis PR-jába).

**B. Írás** (csak ha `irhat: true`)
5. `node tools/kovetkezo-tema.mjs` → `pick`. Ha `null`: napló `kimaradt – nincs szezonban lévő téma`, ugrás a C részre.
6. `git worktree add .worktrees/cikk-<slug> -b cikk/<slug> origin/main`. Innen minden parancs a worktree-ben fut (`cd`). Ha az A rész módosította a téma-sort, másold át a worktree-be.
7. A téma-sorban a téma `allapot: "draft"`, `allapotDatum: <ma>`.
8. Írd meg a cikket `src/content/tudastar/<slug>.md`-be a `docs/cikk-kor/iras-utasitas.md` szerint. Utána `humanizer` audit (magyar modul, file mode), majd `node tools/cikk-kapu.mjs src/content/tudastar/<slug>.md`. Ha piros: javíts legfeljebb kétszer; ha még mindig piros: napló `hiba` a failures-szel, `git worktree remove --force .worktrees/cikk-<slug>`, `git branch -D cikk/<slug>`, ugrás a C részre (a téma-sor a worktree-vel eldobódott, a téma `topic` marad).
9. Belső linkek: a `belso-linkterv` skill repo-módjával 2–3 forrásoldal; mindegyikbe egy mondat egy linkkel (`.astro`: `withBase('/tudastar/<slug>/')`). `public/llms.txt` Tudástár-listájába egy sor: `- https://fejersolarclean.hu/tudastar/<slug>/ – <title>: <description>`.
10. `npm run build && npm test && node tools/dist-ellenorzes.mjs <slug>`. Piros → mint a 8. lépés bukása.
11. Commit a worktree-ben, csak a saját útvonalak fájljaival: `git add src/content/tudastar/<slug>.md src/data/tema-sor.json public/llms.txt <a módosított .astro fájlok>` és `git commit -m "cikk-kor: <slug>"`.
12. `PROBA` nélkül: `git push -u origin cikk/<slug>`, majd `gh pr create --base main --head cikk/<slug> --label cikk-kor --title "Cikk: <title>" --body-file <a pr-sablon szerint kitöltött fájl a naplómappában>`. Napló: a PR linkje.
13. `git worktree remove .worktrees/cikk-<slug>` (próba módban marad).

**C. Visszacsatolás**
14. A `gsc` MCP `get_search_analytics` eszközével: property `sc-domain:fejersolarclean.hu`, `dimensions: "query,page"`, `days: 28`, `row_limit: 100`. A sorokat írd `riportok/cikk-kor/gsc-<ma>.json`-ba `[{ "query", "page", "impressions", "clicks", "position" }]` alakban. Ha az MCP nem elérhető: napló `kimaradt`, ugrás a D részre.
15. `node tools/gsc-javaslat.mjs riportok/cikk-kor/gsc-<ma>.json` → `felvett`. Ha nem üres, vagy az A rész téma-sor-változása még nincs PR-ban:
   - ha ma nyílt cikk-PR: a worktree-ben (vagy újra hozzáadva) commit `cikk-kor: téma-sor <ma>`, push, és a PR leírásához „Új témajavaslatok” szakasz (`gh pr edit <number> --body-file …`);
   - különben új ág `cikk/tema-sor-<ma>`, worktree, commit, push, `gh pr create --label cikk-kor --title "Téma-sor: <ma>"`.
   Ha semmi nem változott: nincs PR.

**D. Befejezés**
16. A napló végére: a PR linkjei, a kapu `failures`/`warnings` száma, a humanizer-leletek száma. A futás záró üzenete magyarul, 3–5 mondat: milyen cikk készült, hol a PR, mi akadt el, hány PR vár Mártonra.
````

- [ ] **Step 2: Az írás-utasítás**

`docs/cikk-kor/iras-utasitas.md`:

```md
# Írás-utasítás – heti cikk-kör

Olvasd el előbb: `ugyfel-brief.md` (hangnem, olvasó, tiltott állítások), `content-backlog.md` „Trust signals confirmed by owner” és „Sourced statistics bank”, és egy meglévő cikket mintának (`src/pages/tudastar/hosegben-tobbet-termel-a-napelem.astro`). A módszer a `seo-tartalom` skillé; ez a lap a projekt sajátosságait adja.

## Fájl

`src/content/tudastar/<slug>.md`, a slug a téma-sor `id`-ja. Fejléc pontosan ezekkel a mezőkkel:

```yaml
---
title: "<a téma kérdése, legfeljebb 62 karakter>"
description: "<válasz-először meta-leírás, legfeljebb 160 karakter>"
elsodleges: "<a téma elsodleges mezője>"
bokor: <napelem | klima | terulet, a téma bokra>
datePublished: <ma, ÉÉÉÉ-HH-NN>
dateModified: <ma>
faq:
  - q: "<kérdés>"
    a: "<2–3 mondatos válasz>"
forrasok:
  - nev: "<kiadó, cím>"
    url: "<https://…>"
cta: "call-<slug rövidítve, legfeljebb 30 karakter>"
---
```

## Szerkezet (700–1200 szó)

1. **Lede** HTML-blokkban: `<p class="lede">…</p>`. Az első mondat válaszol a cím kérdésére. Tartalmazza az elsődleges kulcsszót és legalább egy belső linket.
2. **3–5 H2** (`## …`), a kérdések természetes sorrendjében: mi az ok, mit jelent a tulajdonosnak, mit tehet maga, mikor kell szakember, mikor és hogyan végezzük.
3. **Táblázat**, ha számok vannak (beavatkozás → várható hatás, forrással).
4. **Kapcsolódó cikk** ajánlása a szövegben, mondatba ágyazva (`[…](/tudastar/<slug>/)`), nem lista.
5. A FAQ-t, a szolgáltatás-kártyát, a CTA-sávot és a Források blokkot a sablon teszi ki a fejlécből: a törzsbe ne írd.

## Szabályok

- Belső linkek gyökér-útvonallal, perjellel a végén: `/klimatisztitas/`, `/arak/`, `/tudastar/<slug>/`, `/teruletek/<varos>/`. Legalább 2, legfeljebb 6. A bokor pénzoldalára mindig.
- Külső forrás HTML-horgonnyal: `<a href="…" rel="nofollow">…</a>`. Minden százalékos vagy forintos állítás mellett ugyanabban a bekezdésben forráslink. A forrást nyisd meg (WebFetch) és csak azt idézd, ami a letöltött szövegben áll. Ha nincs forrás, nincs szám.
- Saját állítás csak a backlog megerősített listájából: szennyezettségtől függően akár 15–20% többlettermelés (Péter tapasztalata, így is jelölve); a veszteség évente újratermelődik; szűrt, pH-semleges víz és lágy kefe; a gyártó által ajánlott tisztítószerek; zsákos-átmosásos klímatisztítás; tűző napon nem dolgozunk; számlaképes, lakossági és céges ügyfelek; előre kalkulálható ár, állvány vagy emelőkosár külön.
- Tilos (a kapu is nézi): vegyszermentes, vegyszer nélkül, garancia, garantál, biztosítás, biztosított, évek száma, megtérül, hőszivattyús, „fűtésre is használt”, kimondott ár. Helyette: fűtésre optimalizált készülék; előre kalkulálható ár; a veszteség évente újratermelődik.
- Nincs dátumhoz kötött hír, nincs „ma”, „a héten”, „jelenleg”; a cikk jövőre is igaz.
- Hangnem: tényszerű, közvetlen, megnyugtató; az olvasó laikus háztulajdonos. Magázás végig. Nincs „mi vagyunk a legjobbak”, nincs felsőfok bizonyíték nélkül.
- Tipográfia: magyar idézőjel „…”, gondolatjel ( – ) legfeljebb elvétve, em dash (—) soha. Számtartomány: 15–20%.
- Végül `humanizer` audit, magyar modul, file mode; a leleteket javítsd, de tényhez, számhoz, forráshoz, linkhez ne nyúlj.
```

- [ ] **Step 3: A PR-sablon**

`docs/cikk-kor/pr-sablon.md`:

```md
## Mi ez

<3 mondat: mire válaszol a cikk, kinek, és melyik oldalra tereli az olvasót. Merge = kiadás a fejersolarclean.hu-n; bezárás = a téma kizárása a téma-sorból (a záró komment az indoklás).>

**Cím:** <title> · **Kulcsszó:** <elsodleges> · **Bokor:** <bokor> · **Szezon:** <a téma szezon-hónapjai>

## Források

- <nev> – <url>

## Belső linkek a cikkre

- `<fájl>` – „<horgonyszöveg>”

## Ellenőrzések

- Gépi kapu: <pass/fail>, figyelmeztetések: <n> (<melyek>)
- Humanizer-leletek: <n>, javítva: <n>
- Build + tesztek + dist-ellenőrzés: zöld

## Új témajavaslatok (Search Console)

<nincs | sorok: „<lekérdezés>” – <megjelenés> megjelenés, <pozíció>. hely>
```

- [ ] **Step 4: Engedélyek**

`.claude/settings.json` (új, commitolva; a `settings.local.json` marad a riportnak):

```json
{
  "permissions": {
    "allow": [
      "Bash(node tools/*)",
      "Bash(npm run build)",
      "Bash(npm test)",
      "Bash(git fetch *)",
      "Bash(git status *)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git rev-parse *)",
      "Bash(git ls-remote *)",
      "Bash(git worktree *)",
      "Bash(git branch -D cikk/*)",
      "Bash(git add *)",
      "Bash(git commit -m cikk-kor:*)",
      "Bash(git push -u origin cikk/*)",
      "Bash(git push origin --delete cikk/*)",
      "Bash(gh pr create *)",
      "Bash(gh pr list *)",
      "Bash(gh pr view *)",
      "Bash(gh pr edit *)",
      "Bash(gh pr comment *)",
      "Bash(curl -sI https://fejersolarclean.hu/*)",
      "Bash(rm -rf .worktrees/*)",
      "Bash(mkdir -p riportok/cikk-kor)",
      "Bash(cd .worktrees/*)",
      "Edit(src/content/tudastar/**)",
      "Edit(src/data/tema-sor.json)",
      "Edit(src/pages/**)",
      "Edit(public/llms.txt)",
      "Edit(riportok/cikk-kor/**)",
      "Write(src/content/tudastar/**)",
      "Write(riportok/cikk-kor/**)",
      "mcp__gsc__get_search_analytics",
      "WebFetch"
    ],
    "deny": [
      "Bash(git push origin main*)",
      "Bash(git push -f *)",
      "Bash(gh pr merge *)",
      "Bash(git commit --amend*)",
      "Bash(git reset *)"
    ]
  }
}
```

- [ ] **Step 5: README és backlog**

`README.md` `## Commands` blokkjába új sor: `npm test        # a cikk-kör szkriptjeinek tesztjei (node --test)`.
`README.md` `## Status` végére: `- 🟡 Heti cikk-kör (hétfő 09:00): Markdown-cikk PR-ban, merge = kiadás — lásd cikk-kor.md`.
`content-backlog.md` végére:

```md
## Heti cikk-kör (2026-10-23)

A Tudástár új cikkei a heti cikk-körből jönnek: `src/data/tema-sor.json` a téma-sor, `cikk-kor.md` a futás, a PR-merge a kiadás. Szezon-témák és Search Console-rések; hírhorog nincs. Új tiltott vagy helyes megfogalmazás ide ÉS a `tools/tiltott-kifejezesek.json`-ba.
```

- [ ] **Step 6: Címke és ellenőrzés**

Futtasd: `gh label create cikk-kor --description "Heti cikk-kör PR-jai" --color 1D76DB`
Elvárt: a címke létrejön (ha már létezik, a parancs hibát ad; az is rendben).
Futtasd: `node tools/pr-rendezes.mjs --proba`
Elvárt: `{ "nyitott": 0, "irhat": true, "temaSorValtozott": false, "teendok": [], "proba": true }`.

- [ ] **Step 7: Commit**

```bash
git add cikk-kor.md docs/cikk-kor/iras-utasitas.md docs/cikk-kor/pr-sablon.md .claude/settings.json README.md content-backlog.md
git commit -m "docs(cikk-kor): projektlap, írás-utasítás, PR-sablon, engedélyek"
```

---

### Task 8: Próbafutás, ütemezett feladat, riport-sor

**Files:**
- Create: `~/.claude/scheduled-tasks/heti-cikk-kor-fejersolarclean/SKILL.md` (a scheduled-tasks MCP hozza létre)
- Modify: `~/.claude/scheduled-tasks/heti-seo-riport-fejersolarclean/SKILL.md` (egy új bekezdés)

**Interfaces:**
- Consumes: a `cikk-kor.md` futás-forgatókönyve (Task 7).

- [ ] **Step 1: Próbafutás Mártonnal**

Ebben a sessionben, `PROBA=1`-gyel hajtsd végre a `cikk-kor.md` „Egy futás” részét a 0. lépéstől a 16.-ig (a 12. kimarad). Az első cikk a választó szerint: `futesre-optimalizalt-klima-oszi-tisztitas`.
Ellenőrzés: `ls .worktrees/`, `git -C .worktrees/cikk-futesre-optimalizalt-klima-oszi-tisztitas log --oneline -1` → `cikk-kor: futesre-optimalizalt-klima-oszi-tisztitas`; `cat riportok/cikk-kor/proba-<ma>.md` minden lépésnél `siker` vagy indokolt `kimaradt`.
Márton elolvassa a cikket a worktree-ben (`.worktrees/…/src/content/tudastar/<slug>.md`). Javítás a cikkben a worktree-ben, újra kapu + build. Ha Márton igent mond: `git -C .worktrees/… push -u origin cikk/<slug>` és `gh pr create` a 12. lépés szerint: ez az első valódi PR. Ha nemet: worktree és ág törlése, a téma `kizarva` indoklással a `main`-en egy `docs:` commitban.

- [ ] **Step 2: Az ütemezett feladat**

A `scheduled-tasks` MCP `create_scheduled_task` eszközével (az eszköz sémáját `ToolSearch`-csel töltsd be), **letiltva** létrehozva, Márton az első PR után engedélyezi:
- taskId: `heti-cikk-kor-fejersolarclean`
- title: `Heti cikk-kör – fejersolarclean.hu (hétfő 9:00)`
- description: `Heti cikk-kör: szezon-téma → Markdown-cikk → gépi kapu → belső linkek → PR; Márton merge-dzsel ad ki`
- cron: `0 9 * * 1`
- prompt:

```
Futtasd a heti cikk-kört a peter-klima repóban.

Fontos keretek:
- A repó a FŐ checkout: /Users/martonszentpali/claude code projects/peter-klima. Kezdj `cd`-vel ide; a kör maga nyit worktree-t a cikknek (.worktrees/cikk-<slug>).
- Pontosan a repó gyökerében lévő cikk-kor.md projektlap „Egy futás” része szerint dolgozz, a 0. lépéstől a 16.-ig. A döntéseket a szkriptek hozzák (tools/), te végrehajtod. Amit a lap nem tartalmaz, azt nem csinálod.
- Íráshoz: docs/cikk-kor/iras-utasitas.md, a seo-tartalom skill módszere, a humanizer skill magyar modulja. Belső linkekhez: belso-linkterv skill, repo-mód.
- A main ágra soha ne pusholj, PR-t soha ne merge-elj. A kiadás Márton döntése a GitHubon.
- Ha egy parancsot az engedélykezelés megállít, ne kerüld meg: írd a naplóba, melyik, és állj meg.

A végén röviden, magyarul: milyen cikk készült és hol a PR, milyen témajavaslat ment a téma-sorba, mi akadt el és miért, és hány PR vár Mártonra.
```

Ellenőrzés: `list_scheduled_tasks` mutatja a feladatot `enabled: false`-szal, és a `SKILL.md` a fenti szöveget tartalmazza.

- [ ] **Step 3: A pénteki riport egy új sora**

`~/.claude/scheduled-tasks/heti-seo-riport-fejersolarclean/SKILL.md`, a „2. Bokor-bontás” lista végére új elem:

```
   - cikk-kör cikkei (/tudastar/ alatti Markdown-cikkek: a repó src/content/tudastar/ mappájának fájljai) — első megjelenések cikkenként; plusz egy sor: hány cikk-kör PR vár nyitva (`gh pr list --label cikk-kor --state open` a repóban)
```

Ellenőrzés: `grep -n "cikk-kör" ~/.claude/scheduled-tasks/heti-seo-riport-fejersolarclean/SKILL.md` → 1 találat.

- [ ] **Step 4: Záró ellenőrzés és commit**

Futtasd a repóban: `npm test && npm run build && git status --short | grep -v '^?? riportok' | grep -v '^?? .worktrees'`
Elvárt: tesztek és build zöld; a `main` munkafája tiszta (a riportok és a worktree-k kivételével).
Ha a próbafutás `kizarva`-t írt a téma-sorba: `git add src/data/tema-sor.json && git commit -m "docs(cikk-kor): próbafutás eredménye a téma-sorban"`.

---

## Ön-ellenőrzés (a terv írójától)

- **Spec-lefedettség:** 2.1 → Task 1; 2.2 → Task 2; 2.3 → Task 3; 2.4 → Task 4; 2.5 → Task 7 (projektlap 9. lépés, írás-utasítás); 2.6 → Task 7; 2.7 → Task 7 (settings), Task 8 (feladat); 3.0–3.D → Task 7 projektlap + Task 5/6 szkriptek; 4 (hibakezelés) → projektlap 8/10/14, rendezés `felbemaradt`/`ujra-nez`; 5 (tesztek, próbafutás) → Task 2–6 tesztek, Task 8/1; a pénteki riport sora → Task 8/3.
- **Eltérés a spectől:** a `title` határa 62 karakter (nem 70), mert a sablon „ | Péter”-t fűz hozzá; a téma-sor kap egy `allapotDatum` mezőt a bokor-váltáshoz; a C rész kis PR-ja `cikk/tema-sor-<ma>` ágon jön (a rendezés az ilyen ágat slugként kezeli, de a téma-sorban nincs ilyen id, így nem ír rá semmit).
- **Nevek egyeztetve:** `szetszed`, `kovetkezoTema`, `kapu`, `distEllenorzes`, `rendez`, `javaslatok`, `slugosit`; CLI-k: `kovetkezo-tema`, `cikk-kapu`, `dist-ellenorzes`, `pr-rendezes`, `gsc-javaslat`, a projektlap `parancsok` mezője ugyanezeket hívja.
