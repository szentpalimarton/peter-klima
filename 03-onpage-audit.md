# On-page audit — /tudastar/miert-budos-a-klima/

> Készült: 2026-08-03 · Mód: repo (`src/pages/tudastar/miert-budos-a-klima.astro`) + GSC-réteg
> Oldaltípus: **cikk / tudástár (A ág)** — bizonyíték: `/tudastar/` URL, `Article`+`FAQPage`
> séma (29–56. sor), magyarázó szándék, egyetlen puha CTA a végén. A jelek nem mondanak ellent.

## 0. GSC-réteg — tényadat

| Kérdés | Válasz |
|--------|--------|
| Indexelve? | **IGEN** — „Submitted and indexed", verdict PASS |
| Utolsó crawl | 2026-07-25 — a megerősítés publikálása után **kérj újraindexelést** |
| Canonical | rendben — a Google ugyanazt látja, amit mi állítunk |
| Rich results | PASS, de csak **Breadcrumbs** detektálva — az FAQ rich result a Google-nél globálisan megszűnt a nem-egészségügyi/kormányzati oldalakra, tehát ez várható, nem hiba |
| Mire jelenik meg? | `büdös klíma` (6 megj., 56.8.) · `klíma gomba` (1 megj., **10. — karnyújtásnyi**) |
| Szándék-egyezés? | ✓ — információs cikk, információs lekérdezések |
| Kannibalizáció? | nincs — más oldal nem jelenik meg ezekre |

## Az ellenőrzések (A ág)

| # | Ellenőrzés | Állapot | Részlet |
|---|-----------|---------|---------|
| 1 | Témahűség | **megfelelt** | a lede az első mondatban válaszol a „miért büdös" kérdésre; nincs elkalandozás |
| 2 | Frissesség | figyelem | nincs látható „frissítve" dátum az oldalon; `dateModified` = `datePublished` (35–36. sor). Elavult tétel nincs. |
| 3 | Belső linkek | figyelem | Bejövő: **6 oldal** ✓ (index, gyik, klimatisztitas, tudastár-hub, balatonfüred, siófok). Kimenő szövegközi: **csak 1** (crosslink → `/klimatisztitas/`, 118. sor) — a szabály szerint 2 alatt kevés. Konkrét pótlás: a 113. sor „Évente 1–2 tisztítás" szövege linkeljen a `/tudastar/milyen-gyakran-kell-klimat-tisztittatni/` cikkre. |
| 4 | Forrásolt állítások | figyelem | A „2–5-ször szennyezettebb" állítás (88. sor) forrása meg van nevezve, de a link **csak a lap alji blokkban** él (134. sor, ráadásul `rel="nofollow"`). Szövegközi link kell az állítás mellé — a draft.md ezt már tartalmazza. Forrás nélküli szám nincs. |
| 5 | Szerzői doboz | nem értelmezhető | nincs szerzői doboz; a brief szerint a szerző-mező ⚠️ HIÁNYZIK (Péter hitelesítése nem megerősített) — amíg ez így van, nem pótolható becsületesen |
| 6 | Séma | **megfelelt** | Article + FAQPage + BreadcrumbList (29–56. sor), a Google validálta. Teendő publikáláskor: `dateModified` frissítése + az új FAQ-elem felvétele (draft.md). |
| 7 | Válaszkapszula | figyelem | 3 H2 kapszula-helyes — pl. „Miért nem elég a légfrissítő vagy a spray?" alatt azonnali teljes válasz (97–100. sor) ✓. **Bukó példa: „Hogyan előzhető meg?"** (111. sor) — kapszula nélkül, rögtön felsorolás jön; két bevezető mondat kell elé. A draft két új kapszula-H2-t is hoz. |

## Pontszám

**megfelelt 3 / figyelem 3 / nem értelmezhető 1** (7-ből).

**~68/100** — súlyozás: témahűség 20, kapszula 20, séma 15, források 15, linkek 15,
frissesség 10, szerző 5 (n.é. — kivéve a nevezőből). A kapszula- és forrás-tételek
húzzák le, pont azok, amiket a `draft.md` javít.

## Teendők, hatás szerint

1. **Publikáld a draft.md megerősítést** (klíma gomba kapszula + táblázat + szövegközi
   EPA-linkek + „Hogyan előzhető meg?" kapszula) — a 4., 7. és részben a 3. tételt javítja.
2. **113. sor:** link a milyen-gyakran cikkre az „Évente 1–2 tisztítás" szövegen.
3. **Látható „Frissítve: …" dátum** a lede alá + `dateModified` a sémában.
4. Publikálás után **újraindexelés kérése** a Search Console-ban (utolsó crawl: 07-25).
5. A szerzői doboz **várólistán** marad, míg Péter meg nem erősíti a hitelesítését —
   kitalálni tilos.

## Továbbadás

Következő: `belso-linkterv` — a cikk bejövő linkjei rendben (6), de a linkterv
megmondja, honnan hiányzik még, és a kimenő oldalt is rendezi.
