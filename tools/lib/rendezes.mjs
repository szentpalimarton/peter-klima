// A rész (spec 3.A): PR-állapotok → téma-sor állapotok + teendők. Fájlt nem ír, hálózatot nem hív.
const iso = (d) => d.toISOString().slice(0, 10);
const slugOf = (ag) => (ag.startsWith('cikk/') ? ag.slice(5) : null);

export function rendez(temaSor, { prs, agak, eloRendben, ma = new Date(), maxNyitott = 2, emlekeztetoNap = 21 }) {
  const items = temaSor.items.map((t) => ({ ...t }));
  const byId = Object.fromEntries(items.map((t) => [t.id, t]));
  const teendok = [];
  const prAgak = new Set(prs.map((p) => p.headRefName));
  let nyitott = 0;

  // Slugonként a legújabb PR (legnagyobb number) dönt; a régebbiek figyelmen kívül maradnak.
  const legujabb = new Map();
  for (const p of prs) {
    const slug = slugOf(p.headRefName);
    if (!slug) continue;
    const elozo = legujabb.get(slug);
    if (!elozo || p.number > elozo.number) legujabb.set(slug, p);
  }
  const agVan = new Set(agak);

  // A `draft` állapot csak a PR-ágon van meg, a main-en a téma még `topic`: ezért a PR állapota
  // a `topic` témán is dönt (nyitott → draft, bezárt → kizárva, merge-elt és élő → live).
  for (const [slug, p] of legujabb) {
    const temaSorAg = slug.startsWith('tema-sor-'); // a C-rész PR-ja: csak a téma-sort viszi, témája nincs
    const t = temaSorAg ? undefined : byId[slug];
    if (p.state === 'OPEN') {
      if (!temaSorAg) nyitott++;
      if (t && t.allapot === 'topic') { t.allapot = 'draft'; t.allapotDatum = p.createdAt.slice(0, 10); }
      const kor = (ma - new Date(p.createdAt)) / 86_400_000;
      if (kor > emlekeztetoNap) teendok.push({ tipus: 'emlekezteto', number: p.number, slug });
    } else if (p.state === 'MERGED') {
      let torles = false;
      if (temaSorAg) torles = true;
      else if (t && (t.allapot === 'draft' || t.allapot === 'topic')) {
        if (eloRendben[slug]) { t.allapot = 'live'; t.allapotDatum = iso(ma); torles = true; }
        else teendok.push({ tipus: 'ujra-nez', slug });
      }
      if (torles && agVan.has(p.headRefName)) teendok.push({ tipus: 'ag-torles', slug });
    } else if (p.state === 'CLOSED') {
      // már kizárt topic témát nem írunk újra (különben minden futás új dátumot írna)
      const marKizarva = t && t.allapot === 'topic' && t.kizarva;
      if (t && t.allapot !== 'live' && !marKizarva) {
        t.allapot = 'topic'; t.allapotDatum = null;
        t.kizarva = { datum: iso(ma), ok: p.zaroKomment || 'bezárva indoklás nélkül' };
      }
      if (agVan.has(p.headRefName)) teendok.push({ tipus: 'ag-torles', slug });
    }
  }
  for (const ag of agak) {
    const slug = slugOf(ag);
    if (slug && !slug.startsWith('tema-sor-') && !prAgak.has(ag)) teendok.push({ tipus: 'felbemaradt', slug });
  }
  return { temaSor: { ...temaSor, items }, teendok, nyitott, irhat: nyitott < maxNyitott };
}
