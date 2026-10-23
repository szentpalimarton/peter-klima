// C rész (spec 3.C): GSC lekérdezés × oldal sorokból új témák.
export const ekezetlen = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const slugosit = (s) => ekezetlen(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const to = (szo) => szo.toLowerCase().slice(0, 5);
const szavak = (q) => q.split(/\s+/).filter((s) => s.length >= 4);
const bokor = (q) => (/klím|klim/i.test(q) ? 'klima' : /napelem/i.test(q) ? 'napelem' : 'terulet');

export function javaslatok(sorok, { temaSor, oldalak, ma = new Date(), max = 3, minMegjelenes = 5 }) {
  const osszes = new Map();
  for (const s of sorok) {
    const q = s.query.trim().toLowerCase();
    const e = osszes.get(q) ?? { lekerdezes: q, megjelenes: 0, kattintas: 0, poziciok: [] };
    e.megjelenes += s.impressions; e.kattintas += s.clicks; e.poziciok.push(s.position);
    osszes.set(q, e);
  }
  const megvan = new Set(temaSor.items.map((t) => t.adat?.lekerdezes).filter(Boolean));
  const ids = new Set(temaSor.items.map((t) => t.id));
  const lefedett = (q) => oldalak.some((o) => { const m = ekezetlen(`${o.cim} ${o.elsodleges ?? ''}`).toLowerCase(); return szavak(ekezetlen(q)).every((sz) => m.includes(to(sz))); });
  return [...osszes.values()]
    .filter((e) => e.megjelenes >= minMegjelenes && e.kattintas === 0 && !megvan.has(e.lekerdezes) && !ids.has(slugosit(e.lekerdezes)) && !lefedett(e.lekerdezes))
    .sort((a, b) => b.megjelenes - a.megjelenes)
    .slice(0, max)
    .map((e) => ({
      id: slugosit(e.lekerdezes),
      kerdes: `${e.lekerdezes.charAt(0).toUpperCase()}${e.lekerdezes.slice(1)}?`,
      elsodleges: e.lekerdezes,
      bokor: bokor(e.lekerdezes),
      szezon: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      forras: 'gsc',
      allapot: 'topic',
      allapotDatum: null,
      adat: { lekerdezes: e.lekerdezes, megjelenes: e.megjelenes, kattintas: e.kattintas, pozicio: Math.round((e.poziciok.reduce((a, b) => a + b, 0) / e.poziciok.length) * 10) / 10, ablak: `28 nap, ${ma.toISOString().slice(0, 10)}-ig` },
      kizarva: null,
    }));
}
