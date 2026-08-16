---
# draft – /tudastar/miert-budos-a-klima/ MEGERŐSÍTÉSE (nem új oldal)
# Célfájl: src/pages/tudastar/miert-budos-a-klima.astro
# Linkek a projekt idiómájával: withBase('/…/') – NE nyers href!
title: "Miért büdös a klíma, és mit lehet tenni ellene? | Péter"   # 54 kar., marad
description: "Miért büdös a klíma? A dohos szagot a nedves hőcserélőn megtelepedő gomba és baktérium okozza. Így szüntethető meg tartósan – tisztítással és fertőtlenítéssel."  # marad
elsodleges: "büdös klíma"        # H1-ben és a lede-ben ✓ (változatlan)
masodlagos: "klíma gomba"        # ÚJ H2 kapszula – GSC 10. hely
schema: "Article + FAQPage + BreadcrumbList – megvan; TEENDŐ: dateModified frissítése publikáláskor + 1 új FAQ-elem (lásd lent)"
minoseg: "7/7 – a tapasztalat-szakasz Péter megerősített megfigyelésével kitöltve (2026-08-03)"
---

## Mi változik és miért (szerkesztői összefoglaló)

A cikk válasz-első szerkezete jó, marad. Négy beavatkozás:

1. **ÚJ H2 kapszula: „Gombás a klíma? Veszélyes ez?"** – a `klíma gomba` lekérdezés
   10. helyen áll, saját szakasz nélkül. Ez a leggyorsabb első-oldal esély.
2. **ÚJ H2 + az egyetlen táblázat: „Mi történik, ha nem tisztíttatom a klímát?"** –
   valódi ügyfélkérdés a backlogból; a tünet→ok→megoldás táblázat gépi kiemelésre ideális.
3. **A meglévő EPA-állítás linkje bekerül a szövegbe** – most csak a lap alji
   Források-blokkban van link; a kiemelt statisztika mellett nincs. Az AI a
   szövegközi linket köti az állításhoz.
4. **Tapasztalat-jelölő** Péter válaszáig.

A lap alji „Források" blokk **maradhat** (a site 7 cikkének közös konvenciója),
de a linkek mostantól a szövegben IS ott vannak – a blokk kiegészítés, nem pótlék.

---

## A módosított/új szakaszok szövege

### (lede – VÁLTOZATLAN)

### Honnan jön a szag? (meglévő H2 – csak a forrás-link változik)

A `.stat` blokk szövege marad, de a „2–5-ször szennyezettebb" állítás linket kap a
szövegben:

> Az [EPA szerint a beltéri levegő egyes szennyezői 2–5-ször töményebbek
> lehetnek](https://www.epa.gov/report-environment/indoor-air-quality) a kültérinél…

*(Forrás letöltve, ellenőrizve 2026-08-03: „the concentrations of some pollutants are
often 2 to 5 times higher than typical outdoor concentrations." Ugyanez az oldal említi,
hogy a Legionárius-betegség „rosszul karbantartott klíma- és fűtésrendszerű
épületekhez" köthető – ezt NEM tesszük be riogatásnak, a meglévő visszafogott hangnem
marad.)*

### ÚJ H2: Gombás a klíma? Veszélyes ez?

**Kapszula (az első két mondat önmagában válaszol):**

> A klímában megjelenő fekete pöttyök vagy dohos szag valóban gombát jeleznek: a
> hűtéskor lecsapódó pára miatt a hőcserélő nedves, és [az EPA szerint a gomba
> gyakorlatilag bármilyen felületen megtelepszik, ahol nedvesség
> van](https://www.epa.gov/mold/mold-course-chapter-2). Egészséges felnőttnél ez
> jellemzően kellemetlenség, érzékenyeknél, allergiásoknál és gyerekeknél viszont
> légúti panaszt válthat ki, ezért nem érdemes együtt élni vele.

Utána egy rövid bekezdés: a ventilátor a spórákat a szobába fújja – ugyanazon EPA-anyag
szerint a légtechnikai rendszer az egész helyiségben szét tudja teríteni a gombát.
A megoldás nem a felület áttörlése, hanem a hőcserélő mélytisztítása.

**Péter tapasztalata (megerősítve 2026-08-03, munkafotók alapján):**

> A gombás fertőzést a helyszínen nem a szagról ismerjük fel, hanem látványról:
> a beltéri egység lamelláin **vastag, barna lerakódás** ül. Kívülről ebből semmi
> nem látszik, a fedél alatt viszont ez a kép fogad.

*(Szerkesztői megjegyzés: ha van olyan munkafotó a lerakódásról, ami vállalható,
tegyük be ide – a valódi fotó többet ér bármilyen illusztrációnál, bizalomnak és
AI-idézhetőségnek egyaránt. Csak Péter jóváhagyásával.)*

*(Ellenőrzött idézetek 2026-08-03: „Mold can grow on virtually any organic material
as long as moisture and oxygen are present." · „The HVAC system has the potential to
spread mold throughout a building." · egészséghatás: „trigger allergic reactions".)*

### ÚJ H2: Mi történik, ha nem tisztíttatom a klímát?

**Kapszula:**

> Rövid távon a szag erősödik, és a készülék a mikrobákat fújja a szobába; hosszabb
> távon a lerakódás a hőcserélő hatásfokát is rontja. A szag magától nem múlik el,
> mert a forrása (a nedves felületen élő telep) a helyén marad.

Az egyetlen táblázat:

| Tünet | Valószínű ok | Mi szünteti meg tartósan |
|-------|--------------|--------------------------|
| Dohos, savanyú szag bekapcsoláskor | Gomba/baktérium a nedves hőcserélőn | Mélytisztítás + fertőtlenítés |
| Fekete pöttyök a kifúvónál | Gombatelep a levegőútban | Mélytisztítás (a letörlés kevés) |
| A szag spray után visszatér | A forrás a helyén maradt | A forrás eltávolítása, nem elfedése |
| Gyengébb hűtés + szag együtt | Lerakódás a hőcserélőn | Tisztítás (a fertőtlenítés önmagában kevés) |

*(A táblázat állításai a cikk már forrásolt tényeiből következnek; új szám nincs
benne, ezért új forrás sem kell.)*

### (Miért nem elég a légfrissítő vagy a spray? – VÁLTOZATLAN)
### (Mit lehet tenni ellene? – VÁLTOZATLAN, zsákos-átmosás)
### (Hogyan előzhető meg? – VÁLTOZATLAN)
### (crosslink + CTA – VÁLTOZATLAN)

---

## FAQ-bővítés (a `faq` tömbbe + FAQPage sémába)

```
q: 'Veszélyes a gombás klíma?',
a: 'Egészséges felnőttnél jellemzően kellemetlenség, de a gomba spórái allergiás
és légúti panaszt válthatnak ki, különösen érzékenyeknél és gyerekeknél. A tartós
megoldás a hőcserélő mélytisztítása és fertőtlenítése, a felület áttörlése kevés.'
```

## Séma-teendő

- `dateModified` → a publikálás napja (a `datePublished` marad 2026-07-24)
- a Sources-blokkba az EPA mold-course link is kerüljön be a meglévő IAQ mellé

## Minőségi pontszám – becsületesen

| # | Ellenőrzés | Állapot |
|---|-----------|---------|
| 1 | Minden állítás forrása letöltve, ellenőrizve | ✓ (EPA IAQ + EPA Mold Course, 2026-08-03) |
| 2 | Minden H2 kérdés, alatta kétmondatos kapszula | ✓ |
| 3 | Pontosan egy táblázat | ✓ (új) |
| 4 | Tapasztalat embertől | ✓ – Péter megfigyelése munkafotók alapján (2026-08-03) |
| 5 | Title (54) és meta (~155) hossz | ✓ |
| 6 | Séma érvényes az oldaltípushoz | ✓ (+2 teendő fent) |
| 7 | Elsődleges a H1-ben és az első 100 szóban | ✓ |

**7/7** – a tapasztalat-szakasz valódi, megerősített megfigyeléssel telt ki, nem
kitalált anekdotával. A draft publikálásra kész.
