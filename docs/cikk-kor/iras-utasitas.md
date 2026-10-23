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
