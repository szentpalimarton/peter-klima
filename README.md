# Péter · Napelem- és Klímatisztítás — website

Mobile-first, Hungarian lead-generation site for solar panel cleaning (core service)
and AC (klíma) cleaning in Fejér county. Static Astro site; the phone call is the
only conversion. **Positioning: solar-first** — solar leads the hero, card order,
price tables, FAQ order, metadata, and keyword targeting; klíma is the strong second.

Full project plan (architecture, SEO/AIO/GEO strategy, content backlog, phases):
see the "Klíma & napelem tisztítás — website project plan" artifact from the planning session.

## Commands

```bash
npm install      # first time
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview
```

## Status: Phase 1 (MVP one-pager)

Done:
- One-page landing: hero, services, price tables, why-us, mini-FAQ, contact
- `LocalBusiness` + `FAQPage` JSON-LD, OG tags, sitemap (`@astrojs/sitemap`), robots.txt, llms.txt
- Legal skeletons: `/impresszum`, `/adatkezeles` (with `[KITÖLTENDŐ]` placeholders)
- Sticky mobile call bar; all `tel:` links tagged with `data-cta` for later GA4 event wiring

## Before go-live (blockers)

1. **Domain**: register the chosen `.hu` domain, then update `site` in `astro.config.mjs`
   and the Sitemap URL in `public/robots.txt`.
2. **Impresszum data** from Péter: official name, seat, registration + tax number.
   Fill every `[KITÖLTENDŐ]` in `src/pages/impresszum.astro` and `adatkezeles.astro`.
3. **Photos**: the hero and OG image is `public/images/peter-kabala.jpg` — an approved
   AI caricature of Péter (recognizable likeness, "Péter" on the shirt, brush + panels +
   AC unit; deliberately no chemical bottle — they clean with filtered, pH-neutral water
   only, no chemicals claim must stay consistent). Real job photos live in the "Munkáink"
   gallery (`napelem-*.jpg`, `klima-*.jpg`, sourced from ~/Documents/OP_képek). More are
   welcome for GBP and future before/after pairs. Keep files ≤ 250 KB.
4. **Google Business Profile**: create as service-area business, same name/phone as the site.

## Phase 2 backlog (see project plan §4–§8)

- `/klimatisztitas`, `/napelem-tisztitas`, `/arak`, `/gyik` full pages
- Verified, cited stats (NREL soiling, Google flat-panel study, DOE 5–15% filter figure)
- Tudástár articles (flagship: "Mennyivel termel többet a tiszta napelem?")
- GA4 (or cookieless analytics) + tel: click events on the `data-cta` attributes
- Bing Webmaster Tools + Google Search Console submission after domain is live

## Content rules

- Prices and the service list come from Péter only — never invent facts
  (no "számlával", "biztosítással", experience claims until he confirms them).
- Every published statistic must be verified against its primary source and cited.
- Copy is Hungarian, answer-first (first sentence answers the question) — this is the
  AIO/GEO strategy; keep it when editing.
