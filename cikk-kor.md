# Heti cikk-kör – fejersolarclean.hu

> A hétfői ütemezett feladat ezt hajtja végre, lépésről lépésre. A döntéseket a szkriptek hozzák; amit a lap nem tartalmaz, azt a kör nem csinálja. Terv: `docs/superpowers/specs/2026-10-23-heti-cikk-kor-design.md`.

## Tudnivalók

- A `main`-re a kör soha nem ír: minden változás egy `cikk/<slug>` ágon, pull requestben megy, a merge Márton igene. A GitHub Actions a merge után kiad.
- A fő checkout a `riportok/` mappában mentetlen fájlokat tart; ez nem akadály, mert a kör a fő checkout fájljait nem olvassa és nem írja: minden munka a `.worktrees/cikk-<ma>` worktree-ben megy, a fő checkoutba csak a napló (`riportok/cikk-kor/`) kerül.
- Tiltott és helyes megfogalmazások: `tools/tiltott-kifejezesek.json` és a `content-backlog.md` „Trust signals confirmed by owner” szakasza. Szám csak letöltéssel ellenőrzött elsődleges forrással.
- Ha egy parancsot az engedélykezelés megállít: ne kerüld meg, írd a naplóba, melyik, és állj meg.
- Próba mód: `PROBA=1`: a `pr-rendezes` és a `gsc-javaslat` `--proba`-val fut, az ág-törlés, a PR-komment, a push és a PR-nyitás kimarad, a worktree és az ág helyben marad, a napló neve `proba-<ma>.md`. A próba külön neveket használ (worktree `.worktrees/proba-<ma>`, ág `cikk/proba-<ma>`, nincs átnevezés), hogy ugyanaznap egy éles futással ne ütközzön.
- A `cikk/tema-sor-<dátum>` ág (a C rész téma-sor PR-ja) nem számít a nyitott cikk-PR plafonba, és a rendezés nem kezeli félbemaradtként; merge vagy zárás után az ágat a kör törli, ha még létezik.

## Beállítások

```json
{
  "projekt": "fejersolarclean.hu",
  "ag": "main",
  "sajatUtvonalak": ["src/content/tudastar", "src/data/tema-sor.json", "public/llms.txt", "src/pages"],
  "worktree": ".worktrees/cikk-{ma}",
  "probaWorktree": ".worktrees/proba-{ma}",
  "munkaAg": "cikk/munka-{ma}",
  "probaAg": "cikk/proba-{ma}",
  "cikkAg": "cikk/{slug}",
  "temaSorAg": "cikk/tema-sor-{ma}",
  "naploMappa": "riportok/cikk-kor",
  "plafon": { "nyitottPr": 2, "emlekeztetoNap": 21 },
  "parancsok": {
    "rendezes": "node tools/pr-rendezes.mjs",
    "valaszto": "node tools/kovetkezo-tema.mjs",
    "kapu": "node tools/cikk-kapu.mjs src/content/tudastar/{slug}.md",
    "build": "npm run build",
    "teszt": "npm test",
    "distEllenorzes": "node tools/dist-ellenorzes.mjs {slug}",
    "javaslat": "node tools/gsc-javaslat.mjs {sorokFajl}"
  },
  "utasitasok": { "iras": "docs/cikk-kor/iras-utasitas.md", "pr": "docs/cikk-kor/pr-sablon.md" },
  "site": { "url": "https://fejersolarclean.hu", "utvonal": "/tudastar/{slug}/" },
  "gsc": { "property": "sc-domain:fejersolarclean.hu", "napok": 28, "minMegjelenes": 5 },
  "prCimke": "cikk-kor"
}
```

## Egy futás

Jelölések: `<repó>` = `/Users/martonszentpali/claude code projects/peter-klima` (a fő checkout; a parancsokban mindig a literal, idézőjeles alakban áll, lásd lent), `<ma>` = a mai dátum (ÉÉÉÉ-HH-NN), `<wt>` = `<repó>/.worktrees/cikk-<ma>` (a futás munka-worktree-je; próba módban `<repó>/.worktrees/proba-<ma>`). A munka-ág `cikk/munka-<ma>` (próba módban `cikk/proba-<ma>`). A kör a fő checkout fájljait nem olvassa és nem írja (a napló mappája kivétel): minden további parancs `cd "<wt>" && …` alakban fut (a `<wt>` helyén a literal abszolút út, idézőjelben); a napló, a GSC-sorok és a PR-leírás fájlja mindig `<repó>/riportok/cikk-kor/…` abszolút úton van. A fő checkout elleni git-parancsok kizárólag ebben az alakban futnak: `git -C "/Users/martonszentpali/claude code projects/peter-klima" …`.

Minden lépés után egy sor a naplóba (`<repó>/riportok/cikk-kor/<ma>.md`, próba módban `proba-<ma>.md`): `- <lépés>: siker | kimaradt | hiba – <ok>`.

**0. Zár és előfeltételek**
1. Ha `<repó>/riportok/cikk-kor/<ma>.md` (próba módban `proba-<ma>.md`) létezik → írd ki, hogy ma már futott, és állj meg. A mappát `mkdir -p "/Users/martonszentpali/claude code projects/peter-klima/riportok/cikk-kor"` hozza létre, ha nincs.
2. `git -C "/Users/martonszentpali/claude code projects/peter-klima" rev-parse --abbrev-ref HEAD` legyen `main` (csak ellenőrzés: a fő checkout fájljait nem nézzük és nem módosítjuk). Ha nem: napló `hiba`, állj meg.
3. `git -C "/Users/martonszentpali/claude code projects/peter-klima" fetch origin main`.
4. `git -C "/Users/martonszentpali/claude code projects/peter-klima" worktree add "/Users/martonszentpali/claude code projects/peter-klima/.worktrees/cikk-<ma>" -b cikk/munka-<ma> origin/main` (próba módban `…/.worktrees/proba-<ma>` és `-b cikk/proba-<ma>`), majd `cd "<wt>" && npm ci` (az új worktree-ben nincs `node_modules`; nélküle a build és a kapu, amely a `yaml` csomagot használja, nem fut).

**A. Rendezés** (`<wt>`-ben)
5. `cd "<wt>" && node tools/pr-rendezes.mjs` (próba módban `--proba`-val) → `{ nyitott, irhat, temaSorValtozott, teendok }`. A szkript a téma-sort (`src/data/tema-sor.json`) csak a worktree-ben írja. Teendők:
   - `ag-torles` → PROBA nélkül `git push origin --delete cikk/<slug>` (ha az ág létezik); próba módban napló `kimaradt – próba`;
   - `emlekezteto` → PROBA nélkül `gh pr comment <number> --body "Emlékeztető: ez a cikk <N> napja vár jóváhagyásra. Merge = kiadás, bezárás = a téma kizárása."`; próba módban napló `kimaradt – próba`;
   - `ujra-nez` → csak napló (a merge kint van, de az élő oldal még nem válaszol; a következő futás újra nézi);
   - `felbemaradt` (az ág pusholva van, de nincs hozzá PR). A `<fw>` jelölés: `/Users/martonszentpali/claude code projects/peter-klima/.worktrees/cikk-<slug>` (próba módban `…/.worktrees/proba-<slug>`):
     1. `git -C "/Users/martonszentpali/claude code projects/peter-klima" fetch origin cikk/<slug>`, majd `git -C "/Users/martonszentpali/claude code projects/peter-klima" worktree add "<fw>" cikk/<slug>` (az origin ágat követve), majd `cd "<fw>" && npm ci`;
     2. `cd "<fw>" && npm run build && node tools/dist-ellenorzes.mjs <slug>`;
     3. ha zöld: PROBA nélkül azonnal PR-t nyiss (az ág már commitolva és pusholva van): a cím a cikk fejlécének `title` mezőjéből, a leírás a `docs/cikk-kor/pr-sablon.md` szerint, a cikkből kitöltve (források a fejlécből, belső linkek a `git show --stat` alapján), a fájlja a `<repó>/riportok/cikk-kor/` mappában; `cd "<fw>" && gh pr create --base main --head cikk/<slug> --label cikk-kor --title "Cikk: <title>" --body-file <leírás-fájl>`; napló: a PR linkje;
     4. ha piros: PROBA nélkül `git push origin --delete cikk/<slug>`; napló `hiba` a kimenettel;
     5. végül `git -C "/Users/martonszentpali/claude code projects/peter-klima" worktree remove --force "<fw>"` (próba módban is: a worktree nem maradhat, mert az ágat foglalná; a PR-nyitás és az ág-törlés kimarad).

**B. Írás** (csak ha `irhat: true`; `<wt>`-ben)
6. `cd "<wt>" && node tools/kovetkezo-tema.mjs` → `pick`. Ha `null`: napló `kimaradt – nincs szezonban lévő téma`, ugrás a C részre.
7. PROBA nélkül `git branch -m cikk/<slug>` (a munka-ág átnevezése; próba módban az ág `cikk/proba-<ma>` marad), a téma-sorban a téma `allapot: "draft"`, `allapotDatum: <ma>`.
8. Írd meg a cikket `src/content/tudastar/<slug>.md`-be a `docs/cikk-kor/iras-utasitas.md` szerint. Utána `humanizer` audit (magyar modul, file mode), majd `node tools/cikk-kapu.mjs src/content/tudastar/<slug>.md`. Ha piros: javíts legfeljebb kétszer; ha még mindig piros: **bukás** (lásd lent).
9. Belső linkek (a kapu után): a `belso-linkterv` skill repo-módjával 2–3 forrásoldal; mindegyikbe egy mondat egy linkkel (`.astro`: `withBase('/tudastar/<slug>/')`). `public/llms.txt` Tudástár-listájába egy sor: `- https://fejersolarclean.hu/tudastar/<slug>/ – <title>: <description>`. Ezeket a 10. lépés build-je és a PR-diff ellenőrzi.
10. `npm run build && npm test && node tools/dist-ellenorzes.mjs <slug>`. Piros → **bukás**.
11. Commit a worktree-ben, csak a saját útvonalak fájljaival: `git add src/content/tudastar/<slug>.md src/data/tema-sor.json public/llms.txt <a módosított .astro fájlok>` és `git commit -m "cikk-kor: <slug>"`.
12. PROBA nélkül: `git push -u origin cikk/<slug>`, majd `gh pr create --base main --head cikk/<slug> --label cikk-kor --title "Cikk: <title>" --body-file <a pr-sablon szerint kitöltött fájl a <repó>/riportok/cikk-kor/ mappában>`. Napló: a PR linkje. Próba módban napló `kimaradt – próba`.

**Bukás** (a 8. vagy a 10. lépésben): napló `hiba` a failures-szel; `git -C "/Users/martonszentpali/claude code projects/peter-klima" worktree remove --force "<wt>"` és `git -C "/Users/martonszentpali/claude code projects/peter-klima" branch -D cikk/<slug>` (próba módban `cikk/proba-<ma>`). Nincs mit továbbvinni (a téma-sor és a rendezés változása a worktree-vel eldobódott, a téma `topic` marad, a következő futás újra számolja), ezért a C rész is kimarad: ugrás a 15. lépésre (napló és záró üzenet; a worktree ekkor már nincs meg).

**C. Visszacsatolás** (csak ha a `<wt>` még létezik; `<wt>`-ben)
13. A `gsc` MCP `get_search_analytics` eszköze a saját sémája szerinti paraméternevekkel (property: `sc-domain:fejersolarclean.hu`, dimensions `query,page`, 28 nap, row_limit 100); a kimenetet alakítsd a `[{ "query", "page", "impressions", "clicks", "position" }]` JSON-ra, és írd `<repó>/riportok/cikk-kor/gsc-<ma>.json`-ba. Ha az MCP nem elérhető: napló `kimaradt`, ugrás a D részre.
14. `cd "<wt>" && node tools/gsc-javaslat.mjs "<repó>/riportok/cikk-kor/gsc-<ma>.json"` (próba módban `--proba`-val) → `felvett`. Utána, PROBA nélkül:
   - ha ezen az ágon van cikk-commit (a 11. lépésből): még egy commit `cikk-kor: téma-sor <ma>` (`git add src/data/tema-sor.json`), `git push origin cikk/<slug>`, és a PR leírásához „Új témajavaslatok” szakasz (`gh pr edit <number> --body-file …`);
   - különben, ha a `src/data/tema-sor.json` változott (a rendezés vagy a javaslat miatt): `git branch -m cikk/tema-sor-<ma>`, commit `cikk-kor: téma-sor <ma>`, `git push -u origin cikk/tema-sor-<ma>`, `gh pr create --base main --head cikk/tema-sor-<ma> --label cikk-kor --title "Téma-sor: <ma>" --body-file <leírás-fájl a naplómappában>`;
   - különben nincs PR.
   Próba módban nincs átnevezés, push és PR (az ág `cikk/proba-<ma>` marad); napló: mit tenne a kör.

**D. Befejezés**
15. Ha a `<wt>` még létezik: PROBA nélkül `git -C "/Users/martonszentpali/claude code projects/peter-klima" worktree remove "<wt>"`, és ha a `cikk/munka-<ma>` ág még létezik (nem lett átnevezve), `git -C "/Users/martonszentpali/claude code projects/peter-klima" branch -D cikk/munka-<ma>`; próba módban a worktree és a `cikk/proba-<ma>` ág helyben marad. A napló végére: a PR linkjei, a kapu `failures`/`warnings` száma, a humanizer-leletek száma.
16. A futás záró üzenete magyarul, 3–5 mondat: milyen cikk készült, hol a PR, mi akadt el, hány PR vár Mártonra.
