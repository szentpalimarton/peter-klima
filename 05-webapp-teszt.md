# Funkcionális site-teszt — fejersolarclean.hu

> Készült: 2026-08-03 · Eszköz: Playwright (headless Chromium), élő oldal ellen
> Lefedettség: a sitemap mind a 26 oldala + az összes egyedi belső link

## Eredmény: zöld

| Ellenőrzés | Eredmény |
|-----------|----------|
| Oldalak betöltése | **26/26 HTTP 200** |
| Konzolhibák (JS) | **0** az összes oldalon |
| Törött belső link | **0** (26 egyedi cél, mind él) |
| `tel:` CTA | minden oldalon jelen, egységesen +36 20 495 4171 |
| Canonical | minden oldalon önmagára mutat |
| Meta description | minden oldalon van, egyik sem lóg túl (≤170) |
| Title | minden oldalon van |
| Képek | mind érvényes és betölt (lásd a jegyzetet) |

## Leletek

1. **JSON-LD hiányzik 3 oldalról:** `/adatkezeles/`, `/impresszum/` (jogi oldalak —
   rendben van így), és **`/tudastar/`** (a hub). Ez utóbbira érdemes
   `CollectionPage` + `BreadcrumbList` sémát tenni — P3, kis munka.

2. **Teszt-módszertani jegyzet (nem site-hiba):** az első futás 3 „törött képet"
   jelzett a főoldalon. Mindhárom álpozitív volt — a `loading="lazy"` képek a
   viewporton kívül nem töltődnek be, és az azonnali aljára-ugrás átugorja a lap
   közepét, így az ott lévő kép sosem kerül képbe. Ellenőrizve: mindhárom fájl
   érvényes WebP, bájtra azonos a repóval, és nézetbe kerülve betölt.
   **Tanulság a jövő tesztjeihez: lazy képeknél lépcsőzetes görgetés kell, vagy
   HTTP-státusz ellenőrzés, nem `naturalWidth`.**

## Következtetés

A site technikai állapota kifogástalan — a 2026-07-26-i optimalizálás (WebP, 136 kB
összsúly, 0 kB JS) óta nincs regresszió. Egyetlen apró teendő került a backlogba
(tudástár-hub séma); minden más zöld.
