# Péter · Napelem- és Klímatisztítás — website

Mobile-first, Hungarian lead-generation site for solar panel cleaning (core service)
and AC (klíma) cleaning in Fejér county. Static Astro site; **the phone call is the
only conversion**. Positioning is solar-first — solar leads the hero, card order,
price tables, FAQ order, metadata, and keyword targeting; klíma is a strong second.

**Live:** https://fejersolarclean.hu
`fejerklimaclean.hu` (+ its `www`) 301-redirects to `/klimatisztitas/`.

Built with the `local-business-seo-geo` skill. Content planning lives in
[`content-backlog.md`](content-backlog.md) — read that before adding pages.

## Commands

```bash
npm install      # first time
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview
```

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages (~1 min).
No manual step. `public/CNAME` pins the custom domain; HTTPS is enforced.

## Site structure (14 pages)

```
/                          Home — hero, services, prices, gallery, FAQ, Tudástár, contact
/napelem-tisztitas         Solar service page (sourced stats, FAQ)
/klimatisztitas            AC service page (sourced stats, FAQ)
/arak                      Combined price list (OfferCatalog schema)
/gyik                      Full FAQ, 14 grouped Q&A
/tudastar                  Knowledge-base hub
/tudastar/…                6 articles (see content-backlog.md)
/impresszum, /adatkezeles  Legal (real data, no placeholders)
```

Every page carries JSON-LD: `LocalBusiness` / `Service` / `FAQPage` /
`BreadcrumbList` / `Article`. `public/llms.txt` lists all URLs for AI crawlers.

## Status

- ✅ Live on the custom domain with HTTPS; Search Console verified + sitemap submitted
- ✅ Impresszum/adatkezelés filled with real business data
- ✅ Content engine: 6 service/price/FAQ pages + 6 sourced articles
- 🟡 Google Business Profile created 2026-07-14, **awaiting verification** (video)
- ⬜ Analytics not yet installed (planned: cookieless + `data-cta` call-click events)
- ⬜ Bing Webmaster Tools not yet submitted (feeds ChatGPT/Copilot)

## Content rules (important)

- **Only publish facts Péter confirms.** No invented claims (guarantees, insurance,
  years of experience). See "Trust signals confirmed by owner" in `content-backlog.md`.
- Say **"szűrt, pH-semleges víz"**, never "vegyszermentes"; prices are
  **"előre kalkulálható"**, never "kimondott" — these are the owner's wordings.
- **Every statistic needs a named, verified source** (Google 2009, NREL, US DOE, EPA).
  Never publish an unverified number — it undermines both trust and AI citations.
- Copy is Hungarian and **answer-first** (the first sentence answers the question).
  This is the GEO strategy — keep it when editing.
- The `napelem-tisztitas-arak-2026` article needs a **yearly title/content refresh**.

## Assets

- `public/images/peter-kabala.jpg` — approved AI caricature of Péter; hero + OG image.
  Deliberately shows no chemical bottle (consistent with the pH-neutral-water claim).
- `public/images/napelem-*.jpg`, `klima-*.jpg` — real job photos (Munkáink gallery).
