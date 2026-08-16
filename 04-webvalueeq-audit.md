# webvalueEQ audit — fejersolarclean.hu (főoldal)

> Készült: 2026-08-03 · Bemenet: élő oldal, desktop (1440) + mobil (390) képernyőkép + teljes szöveg
> Célközönség: napelemes háztulajdonos / klímás kisvállalkozó (Fejér megye + 4 szomszédos megye)
> Konverziós cselekvés: **telefonhívás** (`tel:` kattintás)
>
> ⚠️ **MÉRÉSI JEGYZET (2026-08-10, javítás):** a 63 `data-cta` attribútum elő van
> készítve, de **jelenleg semmi nem méri őket.** Az oldalon Cloudflare Web Analytics
> fut, ami oldalmegtekintést és Core Web Vitals-t mér, **custom eventet nem tud.**
> A lenti split-tesztek tehát addig nem értékelhetők, amíg a kattintás-mérés nem
> él (CRO-07). Ez az audit korábbi állítása („a mérés már él") téves volt.
> Az oldal ígérete: „Tiszta napelem, teljes hozam" — kíméletes tisztítás, előre kalkulálható áron

## Verdict

**68/100 — szilárd, a felső két karon érdemes optimalizálni.** A hajtás feletti rész
szövegesen kiváló (kimenet-első headline, telefonszám mint CTA, bizalmi chipek a gomb
mellett, mobilon ragadós hívósáv), és az ár-átláthatóság ritka erős fegyver. A legnagyobb
lyuk a **bizonyíték-oszlop**: nulla külső társadalmi bizonyíték (vélemény, értékelés,
ügyfélszám) — ez most a hitelesség egyetlen hiányzó lába, és pont az, amit a GBP-ügy
blokkol.

## Scorecard

| Dimenzió | Pont | Kulcsbizonyíték |
|---|---|---|
| 1. Hajtás felett (35%) | 7 | „Tiszta napelem, teljes hozam" — kimenet-első ✓; CTA = telefonszám ✓; de a hero **AI-kabala, nem valódi munkafotó** |
| 2. Értékegyenlet (30%) | 6.5 | átlaga a négy al-pontnak: |
| — 2a. Vágyott kimenet | 8 | headline + „akár 15–20% teljesítménynövekedés" + „friss, egészséges levegő" |
| — 2b. Észlelt valószínűség | **4** | nincs vélemény, értékelés, ügyfélszám, garancia — a bizonyíték csak saját (fotó, forrásolt cikk) |
| — 2c. Idő | 7 | oldal gyors (136 kB, mért 527 ms), ajánlat másodpercek alatt érthető; „egy telefon, és már tudja is az időpontot" — de kiszállási időtáv nincs |
| — 2d. Erőfeszítés | 7 | nincs űrlap, ár előre ismert, folyamat elmagyarázva; DE hívás-kerülőknek nincs üzenet-gomb |
| 3. Cselekvési küszöb (20%) | 7 | chipek közvetlenül a CTA mellett ✓; „a telefonban megbeszélt ár nem változik a helyszínen" — becsületes kockázat-csökkentés; GYIK lefedi a fő ellenvetéseket |
| 4. Megkülönböztetés (15%) | 7 | kabala + nevesített technika (zsákos-átmosás) + kimondott álláspont („tűző napon nem tisztítunk") — logó-csere teszten átmegy |
| **Súlyozott összesen** | **68/100** | |

## Findings by dimension

### 1. Hajtás felett
- A headline („Tiszta napelem, teljes hozam") 5 másodperc alatt átmegy, a kicker viszi
  a földrajzot, a lede a módszert. Szövegesen 8-9-es.
- **A hero-kép AI-rajzolt kabala.** Szándékos márkadöntés (személyesség az arctalan
  Kft.-k ellen), és rajzként nem kelt „kamu fotó" gyanút — de a rubrika szerint a
  valódi munkafotó a bizalmi maximum, és az VAN lent a Munkáink szekcióban. Tesztet érdemel.
- Mobil fold: headline + lede + hívógomb + ragadós alsó hívósáv egy képernyőn — mintaszerű.

### 2. Értékegyenlet
- **2b a szűk keresztmetszet.** A „Miért minket?" szekció csupa saját állítás; egyetlen
  külső hang sincs az oldalon. Fiatal vállalkozásnál ez becsületes (kitalálni tilos),
  de ez az első számú konverziós plafon: a látogató mástól akarja hallani, hogy működik.
- 2c/2d: az időpont-ígéret jó, de nincs kimondva, milyen gyorsan jön a kiszállás; és aki
  nem szeret telefonálni (jelentős szegmens!), annak a „vagy üzenetben" ígérethez nincs gomb.

### 3. Cselekvési küszöb
- A hero-CTA mellett ott a négy chip — pontosan ott válaszol a kételyre, ahol az felmerül.
- Az ártartási ígéret és az „egy perc alatt kiderül" jó küszöbcsökkentők. Garancia nincs
  (nem is állítható owner-megerősítés nélkül) — a jelenlegi becsületes maximum megvan.

### 4. Megkülönböztetés
- A „tűző napon nem tisztítunk" kimondott szakmai álláspont, amit versenytárs nem mer
  szó szerint átvenni; a zsákos-átmosás nevesített folyamat. A kabala felismerhető identitás.

## Top 3 fixes (do these, ignore the rest)

**1. Hero-kép split-teszt: kabala vs. valódi munkafotó.**
(a) A hero illusztráció helyére a Munkáink szekció valódi napelemtisztítási fotója.
(b) A hajtás a legnagyobb súlyú elem, és ott a kép a leggyengébb láncszem — a headline ≥8, azt nem bántjuk.
(c) 1 hét kabala vs. 1 hét fotó, mért változó: `tel:` kattintás. ⚠️ **Előfeltétel: a kattintás-mérés még NINCS bekötve** — lásd lent a mérési jegyzetet. Addig a teszt nem értékelhető.

**2. Az első 3–5 Google-vélemény megszerzése, majd CTA melletti idézet-teszt.**
(a) A backlog vélemény-rutinja (munka után SMS-ben értékelő link) élesítése; amint van 3+ vélemény, egy névvel vállalt idézet + csillagok a hero-CTA blokkba.
(b) A 2b=4 a legnagyobb mérhető lyuk, és a CTA melletti bizalmi elem a legolcsóbb nagy kar.
(c) Teszt: CTA-blokk vélemény-idézettel vs. anélkül, mért változó ugyanaz. **Előfeltétel a GBP-ügy** — addig ez a fix várakozik, kitalált vélemény szóba sem jöhet.

**3. Üzenet-gomb a hívás mellé.**
(a) A hero és a kapcsolat szekció „vagy üzenetben" ígérete mellé tényleges `sms:+36204954171` gomb („✉️ Írok üzenetet").
(b) A hívás magas küszöb a telefon-kerülőknek — jelenleg nekik nincs alacsony küszöbű útjuk, ez tiszta 2d-nyereség.
(c) Teszt: gombbal vs. gomb nélkül; mért változó: összes kapcsolatfelvétel (tel: + sms: kattintás együtt).

## Backlog items (for merging with SEO findings)

| ID | Dimenzió | Lelet | Súly | Erőf. | Várt hatás |
|---|---|---|---|---|---|
| CRO-01 | Fold | hero: kabala vs. valódi munkafotó teszt | P1 | S | tel: kattintás ↑ |
| CRO-02 | 2b | vélemény-rutin élesítése → 3-5 Google-vélemény → CTA melletti idézet | P1 | M | bizalom, hívási arány ↑ |
| CRO-03 | 2d | sms: üzenet-gomb a hívógomb mellé (hero + kapcsolat) | P2 | S | kapcsolatfelvételek ↑ |
| CRO-04 | 2c | kiszállási időtáv kimondása („jellemzően X napon belül") — Péter megerősítésével | P2 | S | döntési sebesség ↑ |
| CRO-05 | 2b | valódi munkafotó-galéria bővítése (gombás lamella előtte/utána, ha vállalható) | P3 | M | bizonyíték-mélység |
| CRO-06 | 3 | GYIK-ből 1-2 ellenvetés (sérülés, számla) átemelése az árlista mellé | P3 | S | küszöb ↓ az ár-döntésnél |
| **CRO-07** | mérés | **`tel:` kattintás-mérés bekötése** (a 63 `data-cta` ma nincs mérve; Cloudflare Web Analytics nem tud custom eventet) | **P1** | S | **ez teszi értékelhetővé az összes fenti tesztet** |

**Összefésülés a SEO-backloggal:** a CRO-05 fotó-tétel ugyanaz a fotó, amit a
`draft.md` a büdös-klíma cikkbe kér (SEO/GEO oldalról) — egy Péter-jóváhagyás,
két felhasználás. A CRO-02 előfeltétele azonos a SEO-lánc GBP-teendőjével.
A headline-t egyik oldal sem bántja: SEO-célnak és konverziós ígéretnek is jó.
