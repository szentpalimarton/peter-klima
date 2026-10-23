<!-- A kitöltött példányt a kör a naplómappába menti, és így adja át (az út idézőjelben, mert szóköz van benne):
gh pr create --base main --head cikk/<slug> --label cikk-kor --title "Cikk: <title>" --body-file "/Users/martonszentpali/claude code projects/peter-klima/riportok/cikk-kor/pr-<slug>.md"
Ez a megjegyzés a kitöltött példányba nem kerül bele. -->
## Mi ez

<3 mondat: mire válaszol a cikk, kinek, és melyik oldalra tereli az olvasót. Merge = kiadás a fejersolarclean.hu-n; bezárás = a téma kizárása a téma-sorból (a záró komment az indoklás).>

**Cím:** <title> · **Kulcsszó:** <elsodleges> · **Bokor:** <bokor> · **Szezon:** <a téma szezon-hónapjai>

## Források

- <nev> – <url>

## Belső linkek a cikkre

- `<fájl>` – „<horgonyszöveg>”

## Ellenőrzések

- Gépi kapu: <pass/fail>, figyelmeztetések: <n> (<melyek>)
- Humanizer-leletek: <n>, javítva: <n>
- Build + tesztek + dist-ellenőrzés: zöld

## Codex-review (1 kör)

**Verdikt:** <MEHET | JAVÍTANDÓ | ÚJRAÍRANDÓ – a review indoklása> · vagy: nem futott: <ok>

| # | Pont | Döntés | Indoklás | Mi változott |
|---|---|---|---|---|
| <P1-1> | <röviden> | <Elfogadva / Elutasítva / Márton dönt> | <forrásidézet vagy utasítás-sor> | <a javítás helye> |

A review és a válasz fájlja: `riportok/cikk-kor/reviews/<ma>-<slug>-codex-1.md`, `…-valasz-1.md` (helyben, nincs a gitben).

## Új témajavaslatok (Search Console)

<nincs | sorok: „<lekérdezés>” – <megjelenés> megjelenés, <pozíció>. hely>
