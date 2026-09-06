# Content backlog — Péter · Napelem- és Klímatisztítás

_Last updated: 2026-09-06_
_Built with the `local-business-seo-geo` skill._

## Positioning reminder
Helyi, megbízható szakember Fejér megyében — kíméletes napelemtisztítás szűrt,
pH-semleges vízzel, előre kalkulálható árakkal, gyors időpont-egyeztetéssel. Solar-first;
klíma erős második. Cél: csörögjön a telefon.

## Keyword map (primary → secondaries, per page)
| Page | Primary keyword | Secondary keywords | Status |
|------|-----------------|--------------------|--------|
| / (home) | napelemtisztítás Fejér megye | klímatisztítás Fejér megye, napelem és klíma tisztítás | live |
| /napelem-tisztitas | napelemtisztítás Székesfehérvár | napelem tisztítás ár, napelem mosás, napelem karbantartás | live |
| /klimatisztitas | klímatisztítás Székesfehérvár | klíma tisztítás ár, klíma fertőtlenítés, split klíma tisztítás | live |
| /arak | napelem tisztítás árak | klímatisztítás árak 2026 | live |
| /gyik | question long-tails | „milyen gyakran…”, „mennyivel termel többet…”, „miért büdös a klíma” | live |
| /teruletek | kiszolgált terület (hub) | Fejér megye települései | live |
| /teruletek/gardony-velencei-to | napelemtisztítás Gárdony | klímatisztítás Velencei-tó, napelemtisztítás Agárd/Dinnyés | live |
| /teruletek/velence | napelemtisztítás Velence | klímatisztítás Velence, napelemtisztítás Kápolnásnyék/Sukoró | live |
| /teruletek/siofok | klímatisztítás Siófok | napelemtisztítás Siófok, apartman/panzió klímatisztítás Balaton | live |
| /teruletek/erd | napelemtisztítás Érd | klímatisztítás Érd, Parkváros/Érdliget | live |
| /teruletek/budaors | klímatisztítás Budaörs | irodai klímatisztítás, céges klímatisztítás Budaörs | live |
| /teruletek/biatorbagy | napelemtisztítás Biatorbágy | klímatisztítás Biatorbágy | live |
| /teruletek/martonvasar | napelemtisztítás Martonvásár | klímatisztítás Martonvásár | live |
| /teruletek/balatonfured | klímatisztítás Balatonfüred | napelemtisztítás Balatonfüred, szálláshely klímatisztítás | live |
| /teruletek/tatabanya | napelemtisztítás Tatabánya | klímatisztítás Tatabánya | live |
| /teruletek/veszprem | napelemtisztítás Veszprém | klímatisztítás Veszprém | live |

## Pages to build (priority order)
- [x] **/napelem-tisztitas** — fő szolgáltatás oldal (Service+FAQPage+BreadcrumbList séma) — 2026-07-23
- [x] **Zászlóshajó cikk**: „Mennyivel termel többet a tiszta napelem?” (answer-first, forrásolt, HUF példa) — 2026-07-23
- [x] /tudastar — Tudástár hub — 2026-07-23
- [x] /klimatisztitas — klíma szolgáltatás oldal (EPA+DOE forrásokkal) — 2026-07-24
- [x] fejerklimaclean.hu (+www) átirányítva → /klimatisztitas — 2026-07-25
- [ ] ⚠️ 2026-09-06 mérés: a fejerklimaclean.hu átirányítás CSAK http-n él; a
      **https://fejerklimaclean.hu és https://www.… 521-et ad** (Cloudflare nem ér
      el origint). Ok: NINCS Cloudflare-redirect, a 301-et a régi tárhely
      (79.172.252.205) adja, https-en nincs origin. Javítás: Redirect Rule a
      fejerklimaclean.hu zónában (Marton-fiók). 2026-09-06: API-ból nem ment —
      a mentett token csak olvas, a wrangler a loomiosa-fiókba van belépve.
      Dashboardból 1 perc, vagy „Zone · Dynamic Redirect · Edit" token kell.
- [x] /arak — kombinált árlista oldal (OfferCatalog séma) — 2026-07-24
- [x] /gyik — teljes GYIK (14 kérdés, csoportosítva) — 2026-07-24

## Articles / knowledge base (flagship first)
- [x] „Mennyivel termel többet a tiszta napelem? — számok és források” (Google/NREL, HUF példa) — 2026-07-23
- [x] „Miért büdös a klíma, és mit lehet tenni ellene?” (EPA forrás, FAQ) — 2026-07-24
- [x] „Napelem tisztítás házilag: mikor szabad, és mikor veszélyes?” (DIY konverzió; hősokk) — 2026-07-24
- [x] „Milyen gyakran kell klímát tisztíttatni?” (DOE forrás, FAQ) — 2026-07-24
- [x] „Napelem tisztítás árak 2026-ban — mitől függ?” — 2026-07-25 (ÉVENTE FRISSÍTENDŐ)
- [x] „Tűző napon miért nem szabad napelemet tisztítani?” — 2026-07-25
- [x] „Aszályos évben gyakrabban kell napelemet tisztítani?” — 2026-07-26 (Velencei-tó
      2022-es rekord vízszintje mint helyi illusztráció; megyei érvényű tartalom)
- [x] „Hőségben többet termel a napelem?” — publikálva 2026-08-16 (DOE-forrású
      evergreen mag: hő rontja a hatásfokot; klímaszűrő 5–15%). A Paks-leállás
      hírblokkját 2026-09-06-án LEVETTÜK (Márton döntése: nem múlt idő, hanem
      törlés) — a cikk mostantól tisztán evergreen, meta + hub-teaser átírva.

## Sourced statistics bank (verify each at primary source before use)
| Claim | Source (named — VERIFY) | Use on |
|-------|-------------------------|--------|
| Lapos panel tisztítása ~megduplázta a termelést 15 hónap kosz után; eső önmagában nem elég | Google hivatalos blog, 2009-es Mountain View tanulmány | napelem oldal + cikk |
| Soiling-veszteség mérsékelt klímán jellemzően pár %, poros/mezőgazdasági környezetben több | NREL soiling kutatás; Solar Energy folyóirat | napelem oldal |
| Madárürülék/pollen részleges árnyékolás → aránytalanul nagy veszteség | IEA PVPS / PV soiling szakirodalom | napelem oldal |
| Koszos klímaszűrő/hőcserélő 5–15%-kal növeli a fogyasztást | US DOE, energy.gov | klíma oldal |
| Nedves párologtatón gomba/baktérium telepszik meg, allergént fúj a szobába | US EPA IAQ; ha van, magyar NNGYK forrás (GEO-értékesebb) | klíma oldal |
| Saját, ellenőrzött állítás: szennyeződéstől függően akár 15–20% teljesítménynövekedés | Péter tapasztalata (már fent van) | napelem oldal |

## Customer questions to turn into FAQ/content
- Kell-e egyáltalán tisztítani a napelemet? Nem elég az eső?
- Nem sérül a panel tisztítás közben? (pH-semleges víz, karcmentes)
- Tűző napon is lehet? (hősokk, elpattanhat)
- Milyen gyakran? (napelem évente; klíma évente 1–2×)
- Miért büdös a klíma?
- Mi történik, ha nem tisztíttatom a klímát?
- Kapok számlát? Cégeknek is dolgoznak? (igen mindkettő)
- Hova mentek ki? Hogyan zajlik az időpont? (telefon/üzenet)
- Hogyan lehet fizetni?

## Competitor gaps to exploit
- Országos vezetők (cleansolar, solarclean) + helyi partnervill: **rejtett ár / „kérjen ajánlatot”** → Péter átlátható ára a főoldalon nyer a „mennyibe kerül” keresőnél.
- **Minden versenytárs gyenge a látható véleményekben** → Google-vélemények + oldalra kirakott badge komoly előny lehet.
- Nincs erős **székesfehérvári GBP** helyi véleményekkel → a térképes találat megnyerhető.
- Arctalan Kft.-k → Péter arca/kabalája + személyesség.
- Csak napelem VAGY csak klíma → Péter mindkettő (kereszt-értékesítés, dupla kulcsszófelület).

## Trust signals confirmed by owner (only publish these)
- Számlaképes szolgáltatás ✓
- Lakossági és céges ügyfelek ✓
- Szűrt, pH-semleges víz + lágy kefe ✓
- **HASZNÁLNAK tisztítószert** (Péter, 2026-07-27): „a gyártó által ajánlott anyagok,
  amelyek kíméletesen oldják fel a szennyeződéseket". TILOS a „vegyszermentes",
  „vegyszer nélkül" megfogalmazás — sem a klímánál, sem a napelemnél! ✓
- Zsákos-átmosásos klímatisztítási technika (a szennyvizet zsák fogja fel) ✓
- Ár normál körülmények között; állvány/emelőkosár külön (előre egyeztetve) ✓
- Tűző napon nem tisztít (hősokk elkerülése) ✓
- Klíma gyakoriság: hűtési szezon előtt, és **fűtésre optimalizált** készüléknél ősszel is
  (NEM „fűtésre is használt" / „hőszivattyús") ✓
- NE állítsuk, hogy a tisztítás „1–2 szezon alatt megtérül" — ez ellentmond az évi
  rendszeres tisztítás ajánlásának. Helyette: a veszteség **évente újratermelődik**,
  és kézzelfoghatóan ~2–3 téli hónap termelésének felel meg. ✓
- NEM megerősített (ne publikáld, míg Péter nem mondja): évek száma, biztosítás, garancia

## Területek-silo terv (videó-tanulságok alapján, 2026-07-26 — módszer: skill area-pages.md)
Városonként EGY kombinált oldal (/teruletek/<varos>/), valódi helyi ground-truth
kutatással (40–50% egyedi tartalom, csak ellenőrizhető tények). Székesfehérvár NEM
kap városoldalt — azt a szolgáltatás-oldalak célozzák (kannibalizáció-védelem).
Rollout: kutatás → 1 oldal → indexelés-visszajelzés → többi.
- [x] Kutatási fájlok: research/teruletek/*.md (5 város, forrásokkal) — 2026-07-26
- [x] /teruletek/ hub + Gárdony–Velencei-tó oldal — 2026-07-26 (madárrezervátum + nyaralók az angle)
- [x] Gárdony-oldal **indexelése végigment** (Márton, 2026-07-26) → a rollout feloldva
- [x] /teruletek/velence — 2026-07-26 (angle: 1930-as villakertek, beállt fák szerves
      szennyeződése + 7 fürdővíz; 78% egyedi tartalom a Gárdony-oldalhoz képest)
- [x] Aszály-angle kutatva és felhasználva: 2022-es rekord vízszint (53 cm, agárdi
      vízmérce), külön Tudástár-cikk + blokk a Gárdony/Velence oldalakon
- [ ] Dunaújváros (ipari por/vasmű) · Mór (bor/mezőgazdaság) · Bicske (M1 agglomeráció) · Sárbogárd (mezőgazdaság) — task #11, az első oldal indexelése UTÁN
- [x] Térkép: OSM embed (sütimentes) — a Gárdony-oldalon él, minta a többihez

## Technical / SEO todos
- [x] **Képek WebP-re + favicon zsugorítás — 2026-07-26.** Képek 817→291 KB (61–73%
      megtakarítás/kép), favicon 269→52 KB. OG-képek szándékosan JPG maradtak
      (peter-kabala.jpg = oldal-OG + LocalBusiness séma; napelem-tisztitas-kozben.jpg
      = zászlóshajó cikk OG) — a social scraperek megbízhatatlanok WebP-vel.
      **Éles mérés (főoldal, CDN-en keresztül):** 136 kB összes súly, 7 erőforrás,
      load 527 ms, DOMContentLoaded 360 ms, 0 kB JS. Bontás: betűtípus 67 kB,
      kép 60 kB, CSS 3 kB, HTML 5 kB. (A hivatalos PageSpeed pontszám azért nem
      került ide, mert a publikus PSI API napi kvótája elfogyott — érdemes majd
      kézzel lefuttatni a pagespeed.web.dev-en.)
      Megjegyzés: a betűtípus már nagyobb tétel, mint a kép — ha valaha optimalizálni
      kell, ott van a következő nyerhető kB (a böngésző a felesleges vietnami
      subsetet unicode-range alapján eleve nem tölti le, tehát az nem probléma).
- [ ] GBP feltöltéskor: a GBP-szolgáltatáslista tükrözze a weboldal szolgáltatásait (név szerint egyezzen)
- [x] Meta description-ök ~155 karakterre rövidítve minden oldalon
- [x] Belső linkelés rendben: minden cikkre 2–4 oldalról mutat link (Tudástár a navban is)
- [x] Strukturált adat minden oldalon (LocalBusiness/Service/FAQPage/Article/BreadcrumbList)
- [x] Search Console: minden oldal beküldve; 7 oldal már indexelve (2026-07-25)
- [ ] „…árak 2026” évenkénti frissítés
- [x] CTA-mérés ellenőrizve élőben (2026-09-06): az Umami betölt, a data-cta
      kattintás `cta-call-header` eseményt küld — a mérés MŰKÖDIK. A 30 napos
      nulla esemény tehát valódi: 28 látogató, 0 CTA-kattintás.

## Márton kézi teendői (review 2026-07-24 alapján)
- [x] GBP igazolás — kész (Márton, 2026-09). Nyitott: név, duplikátum, kategória, fotók — lásd Local SEO
- [x] Facebook-oldal — KIDERÜLT: Péterék maguktól létrehozták (2026. jún. 10.),
      45 követő, **4 vélemény**, aktív posztok a kabalával. Séma `sameAs` bekötve — 2026-08-16
- [ ] FB-oldal névsorrend egységesítése: „Péter Klíma és Napelem Tisztítás" →
      „Péter Napelem- és Klímatisztítás" (a GBP-vel és a site-tal egyezően)
- [ ] A 4 FB-vélemény tükrözése az oldalra (Péter + a véleményezők hozzájárulásával) —
      ez a CRO-02 első valódi bizonyíték-anyaga
- [ ] FB „Mindig nyitva" → valós nyitvatartásra állítani

## Local SEO
- [x] Google Cégprofil — igazolva és claimelve, területek beállítva (Márton, 2026-09)
- [ ] **GBP név egységesítése** — most „Oroszi Péter egyéni vállalkozó, Fejér megye";
      cél „Péter Napelem- és Klímatisztítás" (a site-tal és a séma `name`-mel egyezően)
- [ ] **Duplikált GBP-listing megszüntetése** — „Oroszi Péter Egyéni Válalkozó",
      cid 7424532218163484891, kategória „Tisztítás", weboldal a halott
      fejérklimaclaer.hu. Ha a saját fiókban van: összevonás/eltávolítás; ha nem:
      „Duplikátum jelentése". Amíg él, a NAP-jel kettéoszlik.
- [x] GBP elsődleges kategória: **Klíma- és fűtésszerelő** marad (Márton döntése,
      2026-09-06: most a klíma-karbantartás a cél), Napelem-karbantartás másodlagos.
      Nyitott: szolgáltatáslista = a site szolgáltatásai (név szerint egyezzen)
- [ ] GBP fotók: 3 db — legalább 10 valódi munkafotó (előtte/utána, kabala, Péter)
- [ ] Vélemény-rutin: minden munka után SMS-ben a Google-értékelő link
      (2026-09-06: **1 db** 5★ Google-vélemény; a FB-en 4)
- [ ] Katalógus-idézetek: Cylex, Aranyoldalak, joszaki.hu, qjob.hu — NAP-konzisztensen
- [ ] Google-vélemények kirakása az oldalra (badge), amint van néhány
- [x] Bing Webmaster Tools: importálva a Search Console-ból — 2026-07-25 (ChatGPT/Copilot ebből táplálkozik)
- Térképes helyzet 2026-09-06 (Székesfehérvár környéki Maps-keresés): „napelem
  tisztítás" → **8. hely** (előtte telepítők és egy balatonvilágosi tisztító 47
  véleménnyel); „klímatisztítás" → **nincs a top 20-ban** (7 székesfehérvári
  klímás cég 4–180 véleménnyel). A térképes rangsort most a vélemények száma dönti.

## Done
- Egyoldalas MVP + élesítés fejersolarclean.hu-n, HTTPS-sel — 2026-07-13
- Search Console verifikáció + sitemap beküldés — 2026-07-14
- Impresszum/adatkezelés valós adatokkal — 2026-07-14

## Székesfehérvár a hubon (döntés, 2026-08-16)

Márton jelezte, hogy a megyeszékhely láthatatlan volt a Területek alatt. Megoldás:
**kiemelt blokk a hubon** két crosslink-kártyával a szolgáltatás-oldalakra
(cél-kulcsszavas horgonnyal) — külön városoldal továbbra sem készül
(kannibalizáció-védelem). Újranyitás feltétele: ha a GSC székesfehérvári
lekérdezéseket kezd mutatni, adatból döntünk — addig a kérdés zárva.

## Tóparti kisfalvak — miért NINCS külön oldaluk (döntés, 2026-07-26)
Kápolnásnyék, Sukoró, Pákozd, Pázmánd, Lovasberény: a **szolgáltatás szempontjából
releváns** helyi jellemzőik (vízimadarak, nyaralók, aszály) gyakorlatilag azonosak a
tóparti profillal — külön oldalt írni nekik klónozás lenne. A látnivalóik (ingókövek,
arborétum, Vörösmarty-emlékház) turisztikai színezet, nem befolyásolják, miért és
mikor kell tisztítani. Ezért: **a hubon és a Velence/Gárdony oldalakon nevesítve
vannak**, saját oldalt csak akkor kapnak, ha a Search Console tényleges
megjelenéseket (impressions) mutat rájuk. Lovasberény profilja eltér (nem tóparti,
mezőgazdasági) — ha lesz oldala, azt az agrár-porral kell megalapozni.

## ⚠️ TERÜLETI TERJESZKEDÉS (2026-07-28) — 5 megyére nőtt a szolgáltatási terület

Márton/Péter döntése: Fejér megyén túl **Budaörs, Érd, Biatorbágy, Martonvásár,
Tatabánya, Veszprém, Siófok, Balatonfüred**. Ez **Fejér, Pest, Komárom-Esztergom,
Veszprém és Somogy** megyét érinti.

**Megcsinálva:**
- [x] Pozicionálás javítva az egész oldalon (a „Fejér megye" 20 helyen szerepelt; egy
      budaörsi látogató visszapattant volna). consts.ts: AREA_SHORT / AREA_PROSE /
      AREAS_SERVED (15 terület, központi séma-lista). Lábléc, főoldal (desc + séma +
      „miért mi" + kapcsolat), GYIK „hova mentek ki", kickerek, llms.txt.
- [x] **A szolgáltatás-oldalak CÍMÉT szándékosan NEM bántottuk** — azok a bejáratott,
      már indexelt „Székesfehérvár" kulcsszót célozzák. Az új helyszínek kulcsszavait a
      városoldalak viszik.
- [x] Hub régiók szerint átstrukturálva (hazai terep / Fejér / agglomeráció / Balaton /
      megyeszékhelyek).
- [x] Kutatási fájlok: budapesti-agglomeracio.md, balaton.md, tatabanya-veszprem.md
- [x] /teruletek/siofok — 2026-07-28 (angle: ötszörös nyári népesség, 903e vendégéjszaka;
      84% egyedi a Gárdony-oldalhoz képest)

- [x] **Mind a 8 új városoldal elkészült — 2026-07-29.** Érd, Budaörs, Biatorbágy,
      Martonvásár, Balatonfüred, Tatabánya, Veszprém (+ Siófok korábban). Mért páronkénti
      egyediség a 10 városoldal között: **minimum 75%** (küszöb 40–50%).
      Angle-ök: Érd = leggyorsabban növő város, 9 városrész, lejtős telkek · Budaörs =
      BITEP + üzleti parkok → CÉGES ügyfelek, több egység · Biatorbágy = M1-bővítés
      2028-ig (lakói nézőpontból, hogy ne ütközzön a bicskei oldallal) · Martonvásár =
      HUN-REN ATK kísérleti szántóföldek + kastélypark · Balatonfüred = gyógyfürdő-város,
      hosszabb szezon → MÁS időzítés, mint Siófokon · Tatabánya = a bányászat 1987/2004-ben
      MEGSZŰNT (múlt idő!), élő angle a LIFE-projekt levegőminőség-mérés · Veszprém =
      a téli lakossági fűtés lerakódása → tavaszi tisztítás.
- [x] Hub minden városoldalt linkel, régiók szerint. Sitemap: 26 oldal.

**⚠️ MÁRTON TEENDŐJE — enélkül a helyi SEO nem működik az új területeken:**
A **Google Cégprofilban bővíteni kell a kiszolgált területeket** ugyanezekkel a
településekkel! A Google csak azokra a területekre rangsorol a térképes találatokban,
amelyek a GBP-ben szerepelnek — a weboldal önmagában ezt nem pótolja.

**Nyitott stratégiai kérdés:** a domain `fejersolarclean.hu`, miközben már öt megyét
szolgálunk ki. Nem sürgős (a domain nem korlátoz), de ha valaha újramárkázás merül fel,
ez az érv mellette. Domaint NE cseréljünk — az indexelt oldalak elvesznének.
