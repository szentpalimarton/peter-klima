# Heti cikk-kör – design (2026-10-23)

> **Státusz:** tervezet, Márton átnézésére vár. A brainstorming három szakaszát Márton 2026-10-23-án jóváhagyta (1. tartalom-forma és téma-sor, 2. a kör lépései és a PR-kapu, 3. visszacsatolás, hibakezelés, tesztek). Ez a fájl a jóváhagyott tervet rögzíti; a megvalósítási terv ebből készül.
> **Minta:** a Morning Mirror napi útmutató-köre (`../morning-proof/napi-kor.md`, `napi-utmutato-kor` skill), ami a Vaultaire reggeli körét követi: egy kérdés → egy cikk → belső linkek a meglévő oldalakról → kiadás → visszacsatolás a Search Console-ból. Itt egy nyelven, hetente, és a jóváhagyás egy GitHub pull request merge-e.

## 0. Mit építünk

Minden hétfő reggel egy helyi ütemezett feladat fut a Macen ebben a repóban:

1. rendezi az előző heti cikk-PR-okat (merge-elt → élő, bezárt → kizárt téma);
2. a téma-sorból kiválaszt egy, a következő hetekben aktuális kérdést;
3. megír rá egy magyar Tudástár-cikket Markdownban, a projekt tény- és hangnem-szabályai szerint;
4. átviszi a gépi kapun és a humanizer-auditon;
5. belső linkeket tesz rá 2–3 meglévő oldalról;
6. buildel, ellenőrzi a kimenetet, és pull requestet nyit;
7. a Search Console-ból új témajavaslatokat tesz a téma-sorba, ugyanabban a PR-ban.

Márton a GitHubon olvassa a PR-t, a merge az igene; a GitHub Actions kiadja az oldalt. Hetente egy cikk, legfeljebb két nyitott PR.

## 1. Döntések (Márton, 2026-10-23)

| # | Kérdés | Döntés |
|---|---|---|
| D1 | Mit jelent a „backlink”? | **Belső linkek**: az új cikket a meglévő, forgalmat kapó oldalakról linkeljük, a cikk a pénzoldalakra mutat. Külső backlink, FB-poszt nem része. |
| D2 | Honnan jönnek a témák? | **Szezon + Search Console-rés**: évente újra aktuális evergreen kérdések szezon-ablakkal, plusz a GSC-ben megjelenést kapó, kattintás nélküli lekérdezések. Dátumhoz kötött hírhorog nincs (a Paks-blokk tanulsága: elavult, és 0 megjelenést hozott). |
| D3 | Ütem és kapu | **Heti 1 cikk, Márton igenével.** |
| D4 | Megközelítés | **Saját heti kör, PR a kapu.** A `napi-utmutato-kor` skillt nem módosítjuk (angol eredeti + fordítás mintára épül, wrangler-kitelepítéssel); az adatformák vele kompatibilisek maradnak, hogy később átvihető legyen. |

## 2. Komponensek

### 2.1 Cikkek Markdownban (Astro content collection)

- Mappa: `src/content/tudastar/<slug>.md`. Séma a `src/content.config.ts`-ben (Astro 5 content layer, `glob` loader).
- Fejléc (frontmatter):

```yaml
title: "Fűtésre használt klímát ősszel is kell tisztíttatni?"   # H1 és title-alap
description: "…"            # meta description, legfeljebb 160 karakter
elsodleges: "klíma tisztítás ősszel"
bokor: klima                # napelem | klima | terulet
datePublished: 2026-10-27
dateModified: 2026-10-27
faq:
  - q: "…"
    a: "…"
forrasok:
  - nev: "US DOE, energy.gov – Air conditioner maintenance"
    url: "https://www.energy.gov/energysaver/air-conditioner-maintenance"
cta: "call-<slug>"          # a data-cta érték a telefonos gombon
```

- A cikk állapota **nem** a fejlécben él: a fájl csak merge után kerül a `main`-re, tehát ami a kollekcióban van, az élő. Az állapotot a téma-sor viszi.
- Törzs: Markdown, válasz-először (az első bekezdés válaszol a címbeli kérdésre). Belső linkek a `/…/` gyökér-útvonalakkal (`/klimatisztitas/`), a sablon nem alakítja át őket; a site gyökéren fut, `withBase` csak a `.astro` oldalakon kell. Külső forráslink `rel="nofollow"`-val a sablon utólag nem tud jelölni, ezért a Markdownban HTML-horgony áll a forrásokon (`<a href="…" rel="nofollow">`), ahogy a meglévő cikkekben.
- Sablon: `src/pages/tudastar/[slug].astro` a `getStaticPaths`-szal a kollekcióból; a meglévő cikkek kinézete (`page-hero`, `prose`, `crosslink`, `cta-band`), és ugyanaz a séma-hármas: `Article` (szerző és kiadó: `BRAND`), `FAQPage` a `faq` tömbből, `BreadcrumbList`. `ogType="article"`. A telefonos gomb `data-cta` értéke a fejléc `cta` mezője.
- A **8 meglévő `.astro` cikk marad**. A `src/pages/tudastar/index.astro` a kézi lista mellé a kollekció cikkeit `datePublished` szerint csökkenő sorrendben listázza (új cikk elöl). A sitemap integráció magától felveszi az új oldalakat. Az `llms.txt` a build idején készül (`src/pages/llms.txt.ts`) a `src/data/llms-base.txt` alapból és a kollekcióból; a kör nem szerkeszti.

### 2.2 Téma-sor

- Fájl: `src/data/tema-sor.json`.

```json
{
  "frissitve": "2026-10-23",
  "items": [
    {
      "id": "klima-futesre-oszi-tisztitas",
      "kerdes": "Fűtésre használt klímát ősszel is kell tisztíttatni?",
      "elsodleges": "klíma tisztítás ősszel",
      "bokor": "klima",
      "szezon": [9, 10, 11],
      "forras": "szezon",
      "allapot": "topic",
      "adat": null,
      "kizarva": null
    }
  ]
}
```

- Mezők: `id` = a cikk slugja; `szezon` = hónapok (1–12), amikor a kérdés aktuális; `forras` = `szezon` | `gsc` | `ugyfel`; `allapot` = `topic` → `draft` (PR nyitva) → `live` (merge-elve); `adat` = GSC-forrású témánál `{ "lekerdezes", "megjelenes", "kattintas", "pozicio", "ablak" }`; `kizarva` = `null` vagy `{ "datum", "ok" }` (bezárt PR-nál a záró komment).
- Induló töltés: kb. 12 téma a `content-backlog.md` ügyfélkérdéseiből és a szezonból. Javasolt lista (a megvalósítás pontosítja, a bokrok váltakozásával):
  - ősz: fűtésre optimalizált klíma tisztítása a fűtési szezon előtt (klima); lehullott lomb, pollenréteg és madárürülék a napelemen ősszel (napelem); mi történik, ha nem tisztíttatom a klímát (klima)
  - tél: hó és jég a napelemen, le kell-e takarítani (napelem); a klíma fűtés közben penészszagú (klima)
  - tavasz: tavaszi pollen és virágpor a napelemen (napelem); klímatisztítás a hűtési szezon előtt, mikor foglaljak időpontot (klima); nem sérül a panel tisztítás közben (napelem)
  - nyár: a klíma csöpög vagy gyengén hűt, mikor a kosz az ok (klima); nyaraló és apartman klímája a szezon előtt (klima / terulet)
  - egész évben: kapok-e számlát, cégeknek is dolgoznak-e (ugyfel); hogyan zajlik az időpont-egyeztetés és a munka (ugyfel)
- **Tartalmi határ**: csak olyan állítás, amit a `content-backlog.md` „Trust signals confirmed by owner” szakasza enged; a tiltott megfogalmazások a kapu listájában (2.4).

### 2.3 Választó – `tools/kovetkezo-tema.mjs`

- Bemenet: a téma-sor és a mai dátum (`--datum` kapcsolóval felülírható a teszthez). Kimenet (stdout, JSON): `{ "pick": {…} | null, "ranked": […], "skipped": [{ "id", "ok" }] }` – ugyanaz az alak, mint a Morning Mirror választójáé.
- Szabály: `allapot: "topic"` és `kizarva: null`; a `szezon` tartalmazza a mai vagy a következő hónapot (a következő 6 hét). Sorrend: `forras: "gsc"` elöl (megjelenés szerint csökkenő), utána a bokor-váltás (a legutóbb `draft`/`live` állapotba került téma bokrától eltérő bokor előre), végül a tömb sorrendje. Ha nincs jelölt: `pick: null`, a kör cikk nélkül, csak a rendezéssel és a visszacsatolással fut.

### 2.4 Gépi kapu – `tools/cikk-kapu.mjs <fájl>`

Kimenet: `{ "pass": true|false, "failures": ["…"] }`, kilépési kód 1, ha bukik. Ellenőrzések:

1. Fejléc teljes és érvényes: `title` (≤ 70 karakter), `description` (≤ 160), `elsodleges`, `bokor` a három értékből, `datePublished`, `faq` 2–4 elem, `forrasok` legalább 1, `cta` `call-` kezdetű.
2. Slug egyedi: nincs ilyen fájl a kollekcióban, és nincs ilyen `.astro` a `src/pages/tudastar/` alatt.
3. Tiltott kifejezések (kis-nagybetű és ragozás nélkül, szótő szerint): `vegyszermentes`, `vegyszer nélkül`, `garancia`, `garantál`, `biztosítás`, `biztosított`, `éve dolgoz`, `éves tapasztalat`, `megtérül`, `hőszivattyús`, `fűtésre is használt`, `kimondott ár`. A listát a repó `tools/tiltott-kifejezesek.json` fájlja tartja, hogy a backlog „owner-confirmed” szakaszával együtt bővüljön.
4. Legalább 2 belső link a szövegben a `/napelem-tisztitas/`, `/klimatisztitas/`, `/arak/`, `/tudastar/…/` vagy `/teruletek/…/` útvonalak valamelyikére, és a linkek célja létezik (a `src/pages` vagy a kollekció alapján).
5. Minden mondatban, ahol `%` vagy `Ft` és számjegy áll, van külső forráslink ugyanabban a bekezdésben, **vagy** a mondat a backlog „Sourced statistics bank” tábla saját állításai közül való (a 15–20% többlettermelés Péter tapasztalataként jelölve).
6. Az elsődleges kulcsszó szerepel a címben vagy az első bekezdésben.
7. Nincs dátumhoz kötött hír-mondat: a szövegben nem áll a `ma`, `tegnap`, `a héten`, `idén nyáron`, `jelenleg` kifejezés hírértelemben, és nincs 2026-os hírre mutató külső link (heurisztika: a forrás-URL-ben hírportál-domain). Ez figyelmeztetés, nem bukás.

### 2.5 Belső linkek

- A `belso-linkterv` skill adja: 2–3 meglévő oldal (a cikk bokrának szolgáltatás-oldala és 1–2 rokon cikk vagy területi oldal, elsősorban azok, amik a GSC szerint megjelenést kapnak), oldalanként a pontos horgonyszöveg és az a mondat, ahova a link kerül.
- A kör csak **egy mondatot szúr be vagy egészít ki** az adott `.astro` fájlban, a projekt idiómájával (`withBase('/tudastar/<slug>/')` konstans a frontmatterben, `<a href={…}>` a szövegben). Nem ír át meglévő mondatot. A változás a PR része.
- Az új cikk maga legalább 2 linket ad a pénzoldalakra vagy rokon cikkekre (a kapu 4. pontja), a `crosslink` kártya a bokor szolgáltatás-oldalára mutat.

### 2.6 Projektlap és írás-utasítás

- `cikk-kor.md` a repó gyökerében: tudnivalók + egy JSON beállítás-blokk (ág, saját útvonalak, parancsok, plafonok, GSC property, PR-címke). Az ütemezett feladat promptja erre mutat.
- `docs/cikk-kor/iras-utasitas.md`: a cikk szerkezete (lede, 3–5 H2, táblázat ha számok vannak, FAQ, crosslink, CTA-sáv), a hangnem az `ugyfel-brief.md`-ből (tényszerű, közvetlen, megnyugtató; laikus olvasó), a tény-szabály (szám csak letöltéssel ellenőrzött elsődleges forrással; ha nincs forrás, nincs szám), a helyes megfogalmazások (szűrt, pH-semleges víz; előre kalkulálható ár; zsákos-átmosásos technika; fűtésre optimalizált készülék), hossz 700–1200 szó, a `humanizer` magyar modul végén.
- PR-leírás sablon: a cikk három mondatos kivonata; a források listája; a beszúrt belső linkek (fájl + horgony); a kapu eredménye; a humanizer-leletek száma és mi lett javítva; az új GSC-témajavaslatok, ha vannak.

### 2.7 Ütemezett feladat és engedélyek

- Ütemezett feladat (`~/.claude/scheduled-tasks/heti-cikk-kor-fejersolarclean/SKILL.md`): hétfő 09:00, a fő checkoutban. A prompt rövid: nyisd meg a `cikk-kor.md`-t, és hajtsd végre a futást; a döntési szabályok a projektlapban és a szkriptekben vannak, nem a promptban.
- `.claude/settings.json` engedélyek (a projektben, commitolva): `node tools/*`, `npm run build`, `git worktree *`, `git switch -c cikk/*`, `git push -u origin cikk/*`, `git status *`, `git log *`, `git diff *`, `gh pr create *`, `gh pr list *`, `gh pr view *`, `gh pr edit *`, `curl -sI https://fejersolarclean.hu/*`, `rm -rf .worktrees/*`, a `gsc` MCP olvasó eszközei, `WebFetch`. **Nem engedélyezett:** `git push` a `main`-re, `gh pr merge`, `git commit --amend`, `git reset`.
- A `.worktrees/` mappa a `.gitignore`-ba kerül.

## 3. Egy futás lépései

**0. Zár és előfeltételek.** Ha `riportok/cikk-kor/<ma>.md` létezik → kilép (egy napon egy futás). A fő checkout a `main` ágon áll, a saját útvonalakon (`src/content/tudastar`, `src/data/tema-sor.json`, a belső linkek miatt `src/pages/**`) nincs mentetlen módosítás; a `riportok/` mentetlen fájljai nem számítanak. `git fetch origin main`.

**A. Rendezés.** `gh pr list --label cikk-kor --state all` az utolsó 30 napra.
- Merge-elt PR, a téma `draft`: `curl -sI` az élő URL-re (200), és a `https://fejersolarclean.hu/sitemap-0.xml` tartalmazza. Ha igen: a téma `live`. Ha nem: a napló jelzi, a következő futás újra nézi. A rendezés minden téma-sor-változása (a `live` és a `kizarva` beírása) a futás PR-jába kerül: az aznapi cikk-PR-ba, vagy ha nincs, a C rész kis téma-sor PR-jába (a C rész akkor is nyit ilyet, ha csak a rendezés változtatott a fájlon).
- Bezárt, nem merge-elt PR: a téma `kizarva` a záró komment (vagy „bezárva indoklás nélkül”) szövegével; a `cikk/<slug>` ág törlése a távoli tárolóból.
- Nyitott PR-ok száma ≥ 2: a kör nem ír új cikket; ha egy PR 21 napnál régebbi, kommentben emlékeztet.
- Félbemaradt futás (létezik `cikk/<slug>` ág PR nélkül): PR-t nyit rá, ha a build átmegy; különben törli az ágat.

**B. Írás.**
1. `node tools/kovetkezo-tema.mjs` → `pick`. Ha `null`, ugrás a C részre.
2. `git worktree add .worktrees/cikk-<slug> -b cikk/<slug> origin/main`. Minden további lépés a worktree-ben.
3. A téma `allapot: "draft"`.
4. Cikk megírása a `docs/cikk-kor/iras-utasitas.md` szerint a `seo-tartalom` skill módszerével, az `ugyfel-brief.md` hangnemével. A forrásokat a kör `WebFetch`-csel megnyitja, és csak azt idézi, ami a letöltött szövegben áll.
5. `humanizer` audit (magyar modul), a leletek javítása; tényhez, számhoz, forráshoz nem nyúl.
6. `node tools/cikk-kapu.mjs src/content/tudastar/<slug>.md`. Piros → a worktree és az ág törlése, napló, futás vége cikk nélkül (a téma visszaáll `topic`-ra, mert a worktree-vel a módosítás is eldobódik).
7. Belső linkek a `belso-linkterv` szerint (2.5).
8. `npm run build`, majd `node tools/dist-ellenorzes.mjs <slug>`: a `dist/tudastar/<slug>/index.html` létezik, a hub HTML-je linkeli, a `dist/sitemap-0.xml` tartalmazza, a három JSON-LD blokk érvényes JSON és a típusok stimmelnek. Piros → mint a 6. pont.
9. Commit az ágon (`cikk-kor: <slug>` előtaggal, csak a saját útvonalak fájljai), `git push -u origin cikk/<slug>`, `gh pr create --label cikk-kor` a 2.6 sablonjával. A címke egyszer, kézzel jön létre (`gh label create cikk-kor`), a megvalósítás része.
10. Worktree eltávolítása (`git worktree remove`), az ág a távoli tárolóban marad.

**C. Visszacsatolás a Search Console-ból.** A `gsc` MCP-ből (`sc-domain:fejersolarclean.hu`) az elmúlt 28 nap `query,page` bontása. Jelölt: megjelenés ≥ 5, kattintás 0, és a lekérdezésre nincs olyan oldal, aminek a címe vagy elsődleges kulcsszava tartalmazza a lekérdezés szavait (egyszerű szó-egyezés a kollekció és a téma-sor alapján). Legfeljebb 3 új téma kerül a téma-sorba `forras: "gsc"`, `allapot: "topic"`, `szezon: [1..12]`, `adat`-tal. Ha ezen a futáson nyílt PR, ugyanabba kerül (külön commit az ágon, a PR-leírás „Új témajavaslatok” szakasza); ha nem, és a téma-sor a rendezéstől vagy a javaslatoktól változott, külön kis PR nyílik csak a téma-sorral (`cikk-kor: téma-sor <dátum>`); ha semmi nem változott, nincs PR. Márton a merge-dzsel fogadja el; a bezárás a javaslatot elveti.

**D. Napló.** `riportok/cikk-kor/<ma>.md`: lépésenként egy sor (`siker` | `kimaradt` | `hiba`, okkal), a PR linkje, a kapu és a humanizer számai. Nem commitolt (a `riportok/` mappa ma sincs a gitben).

## 4. Hibakezelés

- Bármely lépés hibája a B részben: worktree és helyi ág törlése; ha a push már megtörtént, az ág megmarad, a következő futás félbemaradt tételként rendezi (A rész). A `main`-re a kör soha nem ír.
- Ha a `gsc` MCP nem elérhető: a C rész `kimaradt`, a futás többi része megy.
- Ha a `gh` nincs bejelentkezve vagy a push bukik: a napló `hiba`, az ág helyben marad a következő futásig.
- A heti pénteki riport-feladat egy új sort kap: a kollekció cikkeinek első megjelenései és a nyitott cikk-PR-ok száma.

## 5. Tesztek

- `tests/kovetkezo-tema.test.mjs` (node beépített `node:test`): szezon-ablak, gsc-elsőbbség, bokor-váltás, kizárt és nem-topic elemek kihagyása, üres eredmény.
- `tests/cikk-kapu.test.mjs`: minden kapu-pont egy zöld és egy piros példával (fejléc-hiány, tiltott szó ragozva, szám forrás nélkül, kevés belső link, dupla slug).
- `tests/dist-ellenorzes.test.mjs` egy kész `dist` ellen (a build tesztben fut).
- `npm test` futtatja mindet; a GitHub Actions deploy-munkafolyamat **nem** változik (a tesztek helyben futnak, a kör 8. lépésében).
- **Próbafutás** (`cikk-kor.md` „próba” mód): minden lépés PR nélkül, a worktree és az ág helyben marad, a napló `proba-<ma>.md`. Az első cikk így készül, Mártonnal; az ütemezés csak utána élesedik.

## 6. Nem része

Külső backlinkek, FB-poszt és katalógus-megkeresések; fordítás; helyi átnéző oldal és kanban; a 8 régi cikk migrálása Markdownra; dátumhoz kötött hírblokk; Google Cégprofil-posztok; DataForSEO-volumen (a fiók felfüggesztve); a deploy-munkafolyamat módosítása.

## 7. Kockázatok és nyitott pontok

- **Kevés GSC-adat.** Heti ~50 megjelenéssel a C rész ritkán ad jelöltet; az indulás a szezon-témákból él. Ez nem hiba, a napló mondja ki.
- **Tény-szabály LLM-oldalon.** A kapu csak azt látja, hogy van-e forráslink a szám mellett; hogy a forrás tényleg azt mondja, a kör WebFetch-ellenőrzése és Márton olvasása fedi. Ezért marad a PR-kapu.
- **Belső link `.astro` fájlba.** Egy mondat beszúrása kézi szerkesztés a kör részéről; a build és a `dist`-ellenőrzés fogja a szintaktikai hibát, a PR-diff a tartalmit.
- **`datePublished`.** A PR nyitásának napja; ha a merge hetekkel később jön, a dátum régebbi a valós kiadásnál. Elfogadott egyszerűsítés.
- **A `draft` csak a PR-ágon él.** A main-en a nyitott PR témája még `topic`, ezért a rendezés a nyitott PR-ok témáit a worktree-ben `draft`-ra jelöli (a PR nyitásának dátumával), hogy a választó kihagyja őket. Ez könyvelés: a jelölés csak egy amúgy is nyíló PR-ral megy a main-re, magában nem nyit téma-sor PR-t; ahhoz élővé vált vagy kizárt téma, vagy új GSC-javaslat kell.
- **Engedélyek.** A `git push` és a `gh pr create` felügyelet nélkül fut; a `main`-re push és a merge nincs engedélyezve, így a kiadás Márton kezében marad.
