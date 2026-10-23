// Választó (spec 2.3): topic, nincs kizárva, szezonban (ez vagy a következő hónap);
// sorrend: gsc elöl megjelenés szerint, aztán bokor-váltás, aztán a tömb sorrendje.
export function kovetkezoTema(temaSor, { ma = new Date() } = {}) {
  const honap = ma.getMonth() + 1;
  const kovetkezo = (honap % 12) + 1;
  const skipped = [];
  const jeloltek = [];
  temaSor.items.forEach((t, i) => {
    if (t.allapot !== 'topic') return skipped.push({ id: t.id, ok: `allapot: ${t.allapot}` });
    if (t.kizarva) return skipped.push({ id: t.id, ok: `kizárva: ${t.kizarva.ok}` });
    if (!t.szezon.includes(honap) && !t.szezon.includes(kovetkezo)) {
      return skipped.push({ id: t.id, ok: `nem szezon (${honap}. és ${kovetkezo}. hónap)` });
    }
    jeloltek.push({ t, i });
  });
  const utolso = temaSor.items
    .filter((t) => (t.allapot === 'draft' || t.allapot === 'live') && t.allapotDatum)
    .sort((a, b) => b.allapotDatum.localeCompare(a.allapotDatum))[0];
  const utolsoBokor = utolso?.bokor ?? null;
  const kulcs = ({ t, i }) => [
    t.forras === 'gsc' ? 0 : 1,
    t.forras === 'gsc' ? -(t.adat?.megjelenes ?? 0) : 0,
    t.bokor === utolsoBokor ? 1 : 0,
    i,
  ];
  const ranked = jeloltek
    .sort((a, b) => {
      const ka = kulcs(a); const kb = kulcs(b);
      for (let j = 0; j < ka.length; j++) if (ka[j] !== kb[j]) return ka[j] - kb[j];
      return 0;
    })
    .map(({ t }) => t);
  return { pick: ranked[0] ?? null, ranked, skipped };
}
