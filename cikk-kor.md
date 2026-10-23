# Heti cikk-kör – fejersolarclean.hu

> A hétfői ütemezett feladat ezt hajtja végre, lépésről lépésre. A döntéseket a szkriptek hozzák; amit a lap nem tartalmaz, azt a kör nem csinálja. Terv: `docs/superpowers/specs/2026-10-23-heti-cikk-kor-design.md`.

## Tudnivalók

- A `main`-re a kör soha nem ír: minden változás egy `cikk/<slug>` ágon, pull requestben megy, a merge Márton igene. A GitHub Actions a merge után kiad.
- A fő checkout a `riportok/` mappában mentetlen fájlokat tart; ez nem akadály, mert a kör worktree-ben dolgozik (`.worktrees/cikk-<slug>`).
- Tiltott és helyes megfogalmazások: `tools/tiltott-kifejezesek.json` és a `content-backlog.md` „Trust signals confirmed by owner” szakasza. Szám csak letöltéssel ellenőrzött elsődleges forrással.
- Ha egy parancsot az engedélykezelés megállít: ne kerüld meg, írd a naplóba, melyik, és állj meg.
- Próba mód: `PROBA=1` a lap elején → a 9. lépés (push, PR) kimarad, a worktree és az ág helyben marad, a napló neve `proba-<ma>.md`.
- A `cikk/tema-sor-<dátum>` ág (a C rész téma-sor PR-ja) nem számít a nyitott cikk-PR plafonba, és a rendezés nem kezeli félbemaradtként; merge vagy zárás után az ágat a kör törli, ha még létezik.

## Beállítások

```json
{
  "projekt": "fejersolarclean.hu",
  "ag": "main",
  "sajatUtvonalak": ["src/content/tudastar", "src/data/tema-sor.json", "public/llms.txt", "src/pages"],
  "worktree": ".worktrees/cikk-{slug}",
  "cikkAg": "cikk/{slug}",
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

Minden lépés után egy sor a naplóba (`riportok/cikk-kor/<ma>.md`): `- <lépés>: siker | kimaradt | hiba – <ok>`.

**0. Zár és előfeltételek**
1. Ha `riportok/cikk-kor/<ma>.md` létezik → írd ki, hogy ma már futott, és állj meg.
2. `git -C <repó> status --porcelain -- src/content/tudastar src/data/tema-sor.json public/llms.txt src/pages` legyen üres, és `git rev-parse --abbrev-ref HEAD` = `main`. Ha nem: napló `hiba`, állj meg.
3. `git fetch origin main`.

**A. Rendezés**
4. `node tools/pr-rendezes.mjs` → `{ nyitott, irhat, temaSorValtozott, teendok }`. Teendők:
   - `ag-torles` → `git push origin --delete cikk/<slug>` (ha az ág létezik);
   - `emlekezteto` → `gh pr comment <number> --body "Emlékeztető: ez a cikk <N> napja vár jóváhagyásra. Merge = kiadás, bezárás = a téma kizárása."`;
   - `ujra-nez` → csak napló (a merge kint van, de az élő oldal még nem válaszol; a következő futás újra nézi);
   - `felbemaradt` → `git worktree add .worktrees/cikk-<slug> cikk/<slug>`, majd a worktree-ben `npm ci`, utána `npm run build && node tools/dist-ellenorzes.mjs <slug>`; ha zöld, folytasd a 9. lépéstől ezzel a sluggal; ha piros, `git push origin --delete cikk/<slug>`, worktree törlése.
   Ha `temaSorValtozott`, a módosított `src/data/tema-sor.json` a B rész ágára kerül (ha nincs B rész, a C rész kis PR-jába).

**B. Írás** (csak ha `irhat: true`)
5. `node tools/kovetkezo-tema.mjs` → `pick`. Ha `null`: napló `kimaradt – nincs szezonban lévő téma`, ugrás a C részre.
6. `git worktree add .worktrees/cikk-<slug> -b cikk/<slug> origin/main`, majd a worktree-ben `npm ci` (az új worktree-ben nincs `node_modules`; nélküle a build és a kapu, amely a `yaml` csomagot használja, nem fut). Innen minden parancs a worktree-ben fut (`cd`). Ha az A rész módosította a téma-sort, másold át a worktree-be.
7. A téma-sorban a téma `allapot: "draft"`, `allapotDatum: <ma>`.
8. Írd meg a cikket `src/content/tudastar/<slug>.md`-be a `docs/cikk-kor/iras-utasitas.md` szerint. Utána `humanizer` audit (magyar modul, file mode), majd `node tools/cikk-kapu.mjs src/content/tudastar/<slug>.md`. Ha piros: javíts legfeljebb kétszer; ha még mindig piros: napló `hiba` a failures-szel, `git worktree remove --force .worktrees/cikk-<slug>`, `git branch -D cikk/<slug>`, ugrás a C részre (a téma-sor a worktree-vel eldobódott, a téma `topic` marad).
9. Belső linkek: a `belso-linkterv` skill repo-módjával 2–3 forrásoldal; mindegyikbe egy mondat egy linkkel (`.astro`: `withBase('/tudastar/<slug>/')`). `public/llms.txt` Tudástár-listájába egy sor: `- https://fejersolarclean.hu/tudastar/<slug>/ – <title>: <description>`.
10. `npm run build && npm test && node tools/dist-ellenorzes.mjs <slug>`. Piros → mint a 8. lépés bukása.
11. Commit a worktree-ben, csak a saját útvonalak fájljaival: `git add src/content/tudastar/<slug>.md src/data/tema-sor.json public/llms.txt <a módosított .astro fájlok>` és `git commit -m "cikk-kor: <slug>"`.
12. `PROBA` nélkül: `git push -u origin cikk/<slug>`, majd `gh pr create --base main --head cikk/<slug> --label cikk-kor --title "Cikk: <title>" --body-file <a pr-sablon szerint kitöltött fájl a naplómappában>`. Napló: a PR linkje.
13. `git worktree remove .worktrees/cikk-<slug>` (próba módban marad).

**C. Visszacsatolás**
14. A `gsc` MCP `get_search_analytics` eszközével: property `sc-domain:fejersolarclean.hu`, `dimensions: "query,page"`, `days: 28`, `row_limit: 100`. A sorokat írd `riportok/cikk-kor/gsc-<ma>.json`-ba `[{ "query", "page", "impressions", "clicks", "position" }]` alakban. Ha az MCP nem elérhető: napló `kimaradt`, ugrás a D részre.
15. `node tools/gsc-javaslat.mjs riportok/cikk-kor/gsc-<ma>.json` → `felvett`. Ha nem üres, vagy az A rész téma-sor-változása még nincs PR-ban:
   - ha ma nyílt cikk-PR: a worktree-ben (vagy újra hozzáadva) commit `cikk-kor: téma-sor <ma>`, push, és a PR leírásához „Új témajavaslatok” szakasz (`gh pr edit <number> --body-file …`);
   - különben új ág `cikk/tema-sor-<ma>`, worktree, commit, push, `gh pr create --label cikk-kor --title "Téma-sor: <ma>"`.
   Ha semmi nem változott: nincs PR.

**D. Befejezés**
16. A napló végére: a PR linkjei, a kapu `failures`/`warnings` száma, a humanizer-leletek száma. A futás záró üzenete magyarul, 3–5 mondat: milyen cikk készült, hol a PR, mi akadt el, hány PR vár Mártonra.
