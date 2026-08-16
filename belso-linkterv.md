# Belső linkterv – Miért büdös a klíma?

> Céloldal: `/tudastar/miert-budos-a-klima/`
> Készült: 2026-08-03 · Üzemmód: **repo** (a forrás nálunk van – pontosabb és ingyenes)
> Átnézett oldalak: 22 (26 route, kihagyva: impresszum, adatkezelés, 404, maga a céloldal)
> Link-idióma: `withBase('/…/')` – minden új link EZZEL készüljön, ne nyers `href`-fel.
> Dinamikus route nincs a repóban, a leltár teljes.

Munkalap – pipáld ki, ahogy elhelyezed. A globális nav (9 cél) külön kezelve, nem
számít szövegközi linknek.

---

## 1. Bejövő linkek – 5 új javaslat

Jelenleg 6 oldal linkeli a cikket (index, gyik, klimatisztitas, tudastár-hub,
balatonfüred, siófok). Az alábbi 5 oldal **érinti a témát, de nem linkel** – csak
ezeket javaslom; a többi települési oldal klíma-említése generikus bevezető, oda
linket erőltetni mintázat-szagú lenne.

### 1. `src/pages/tudastar/milyen-gyakran-kell-klimat-tisztittatni.astro` – MAGAS

- [ ] **Horgony:** `dohos szag`
- **Ebbe a mondatba:** „…a hűtési szezon beindulása előtt, így a nyarat tiszta,
  fertőtlenített készülékkel kezdi." – a mondat után egy fél mondat: *(ha a készülék
  már most dohos szagot fúj, annak külön oka van)* linkkel a cikkre.
- **Miért:** testvércikk, ugyanaz a bokor – és jelenleg **a két klíma-cikk nem
  linkeli egymást.** Ez a terv legfontosabb sora.

### 2. `src/pages/teruletek/velence.astro` – MAGAS

- [ ] **Horgony:** `megtelepedhet a gomba és a baktérium`
- **Ebbe a mondatba:** „…a klíma hónapokig áll; a nedves hőcserélőn megtelepedhet a
  gomba és a baktérium, ezért a szezonnyitás előtti tisztítás és fertőtlenítés a
  legjobb időzítés."
- **Miért:** szó szerint a cikk mechanizmusát írja le – a link itt magyarázatot ad,
  nem SEO-dísz.

### 3. `src/pages/teruletek/gardony-velencei-to.astro` – MAGAS

- [ ] **Horgony:** `megtelepedhet a gomba és a baktérium`
- **Ebbe a mondatba:** „…a klíma állva marad, a nedves hőcserélőn pedig
  megtelepedhet a gomba és a baktérium, ezért érdemes…"
- **Miért:** ugyanaz a valódi tematikus kapcsolat, a legerősebb települési oldalról
  (az első, legrégebben indexelt városoldal).

### 4. `src/pages/teruletek/budaors.astro` – KÖZEPES

- [ ] **Horgony:** `klímaszag`
- **Ebbe a mondatba:** „(irodák, üzlethelyiségek, raktárak) klímatisztítása és
  napelemtisztítása." – kiegészítő fél mondattal: *(irodában a dohos klímaszag
  a kollégákat is zavarja)* linkkel.
- **Miért:** a budaörsi oldal klíma-elsődlegességű (irodai ügyfelek), a szag-téma
  ott üzletileg is releváns – de a mondatot ki kell egészíteni, ezért csak közepes.

### 5. `src/pages/teruletek/erd.astro` – KÖZEPES

- [ ] **Horgony:** `fertőtlenítéssel`
- **Ebbe a mondatba:** „Kíméletes napelemtisztítás szűrt, pH-semleges vízzel és
  klímatisztítás fertőtlenítéssel, Érd mind a kilenc városrészében."
- **Miért:** a `klímatisztítás érd` lekérdezés 10. helyen áll – a kimenő tematikus
  link az érdi oldalnak IS jelzésérték, nem csak a cikknek.

**Nem javaslom:** biatorbágy/tatabánya/veszprém (csak generikus bevezető-említés),
ároldal-cikk (téma-kapcsolat gyenge). 5 valódi link > 10 erőltetett.

---

## 2. Kimenő linkek a céloldalról – 1 új (jelenleg 1 van)

- [ ] → `/tudastar/milyen-gyakran-kell-klimat-tisztittatni/` · horgony:
  `Évente 1–2 tisztítás` · a 113. sor meglévő szövegén – a pár visszairánya,
  ezzel zárul a bokor. *(Az audit 2. teendőjével azonos.)*
- meglévő: crosslink → `/klimatisztitas/` (pénzoldal) – marad, nem duplikáljuk.
- külső: 2 szövegközi EPA-link a draft.md-ből (forrás-linkek, nem belső terv).

Pénzoldal-linket többet nem erőltetek: a crosslink + a CTA már viszi a konverziós utat.

---

## 3. Árva oldalak

**Nincs árva oldal.** Mind a 22 vizsgált oldalra mutat legalább egy szövegközi link
(a korábbi gráf-ellenőrzés szerint a legkisebb bejövő érték is 1, a jogi oldalakat
a lábléc viszi). Ez a done-lista érdeme – a backlog „belső linkelés rendben" tétele
tényleg igaz.

---

## 4. Témabokrok

### klíma-bokor – GYENGE → a terv ezt javítja

- **Hub:** `/klimatisztitas` (pénzoldal)
- **Tagok (2 cikk):** miert-budos-a-klima · milyen-gyakran-kell-klimat-tisztittatni
- **Lelet:** a hub mindkét cikket linkeli, de **a két cikk egymást NEM** – az 1. és a
  kimenő 1. sor pont ezt a kölcsönös párt hozza létre.

### napelem-bokor – nem vizsgáltam

A céloldal nem ide tartozik; külön futás dolga. Nem állítok róla semmit.

### terület-siló – rendben

Hub → mind a 10 városoldal, régiónként; városoldalak → szolgáltatás-oldalak.
Tömeges város-város keresztlinkelés nincs (a veszprém–balatonfüred „egy irányban
járjuk" említés természetes, nem mintázat).

### Kannibalizáció-gyanú

Nincs – a kulcsszótérkép szerint minden lekérdezésre egyértelműen egy oldal jön be.
(A `napelem` generikus szórása nem kannibalizáció, lásd a térkép 5. szakaszát.)

---

## 5. Amit nem tudtam megnézni

Semmi nem maradt ki: 22/22 oldal forrása átnézve, dinamikus route nincs.

---

## Következő lépés

A 6 pipa elhelyezése után (5 be + 1 ki) újraindexelés-kérés a céloldalra és a
`milyen-gyakran` cikkre. A klíma-bokor ezzel zárt kör: hub ↔ két, egymást is
linkelő cikk – pontosan az a jelzés, amiből a Google témamélységet olvas.
