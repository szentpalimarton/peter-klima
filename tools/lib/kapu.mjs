import { szetszed } from './frontmatter.mjs';

const BOKROK = ['napelem', 'klima', 'terulet'];
const BELSO = /(?:\]\(|href=")(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)/g;
const KULSO = /https?:\/\/[^\s)"'>]+/;
const SZAM = /\d[\d\s.,–-]*\s?%|\d[\d\s.,]*\s?(?:ezer|millió)?\s?(?:Ft\b|forint)|\d[\d\s.,–-]*\s?százalék/i;

const kisbetu = (s) => s.toLowerCase();
const to = (szo) => kisbetu(szo).slice(0, 5);

export function kapu(szoveg, { slug, letezik, tiltott, hirszavak }) {
  const failures = [];
  const warnings = [];
  let fejlec; let torzs;
  try { ({ fejlec, torzs } = szetszed(szoveg)); } catch (e) { return { pass: false, failures: [e.message], warnings }; }

  // 1. fejléc
  const f = fejlec;
  if (typeof f.title !== 'string' || !f.title || f.title.length > 62) failures.push('title hiányzik vagy 62 karakternél hosszabb');
  if (typeof f.description !== 'string' || !f.description || f.description.length > 160) failures.push('description hiányzik vagy 160 karakternél hosszabb');
  if (typeof f.elsodleges !== 'string' || !f.elsodleges) failures.push('elsodleges hiányzik');
  if (!BOKROK.includes(f.bokor)) failures.push(`bokor nem napelem/klima/terulet: ${f.bokor}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.datePublished ?? '').slice(0, 10))) failures.push('datePublished hiányzik vagy nem ÉÉÉÉ-HH-NN');
  if (!Array.isArray(f.faq) || f.faq.length < 2 || f.faq.length > 4 || f.faq.some((x) => !x?.q || !x?.a)) failures.push('faq: 2–4 elem kell, mindegyik q és a mezővel');
  if (!Array.isArray(f.forrasok) || !f.forrasok.length || f.forrasok.some((x) => !x?.nev || !/^https?:\/\//.test(x?.url ?? ''))) failures.push('forrasok: legalább 1 elem nev és http(s) url mezővel');
  if (typeof f.cta !== 'string' || !/^call-[a-z0-9-]+$/.test(f.cta)) failures.push('cta hiányzik vagy nem call- kezdetű');

  // 2. slug egyedi
  if (letezik(`/tudastar/${slug}/`)) failures.push(`a slug már létezik: ${slug}`);

  // 3. tiltott kifejezések (fejléc + törzs, kisbetűsen; a ragozott alakot az includes fogja)
  const teljes = kisbetu(szoveg);
  for (const t of tiltott) if (teljes.includes(kisbetu(t.kifejezes))) failures.push(`tiltott kifejezés: „${t.kifejezes}” (${t.ok})`);

  // 4. belső linkek
  const belso = [...new Set([...torzs.matchAll(BELSO)].map((m) => m[1]))];
  if (belso.length < 2) failures.push(`legalább 2 belső link kell, most ${belso.length}`);
  for (const p of belso) if (!letezik(p)) failures.push(`belső link célja nem létezik: ${p}`);

  // 5. szám forrás nélkül
  // a blokk elejéről lehántjuk a címsor-sorokat; ami marad, azt vizsgáljuk (ha nincs, kihagyjuk)
  const blokkok = torzs.split(/\n\s*\n/).map((b) => {
    const sorok = b.split('\n');
    while (sorok.length && (sorok[0].trim() === '' || sorok[0].trim().startsWith('#'))) sorok.shift();
    return sorok.join('\n');
  }).filter((b) => b.trim());
  for (const b of blokkok) {
    // rövidítések és sorszámok pontja nem mondatvég
    const vedett = b.replace(/(^|[\s(])(kb|pl|stb|db|ill|ún|ti|ld|vö)\./gi, '$1$2\u0001').replace(/(^|\s)(\d+)\.(?=\s)/g, '$1$2\u0001');
    for (const mondat of vedett.split(/(?<=[.!?])\s+/).map((m) => m.replaceAll('\u0001', '.'))) {
      if (SZAM.test(mondat) && !KULSO.test(b) && !/tapasztalat/i.test(mondat)) failures.push(`szám forráslink nélkül: „${mondat.trim().slice(0, 60)}…”`);
    }
  }
  // a fejlécben (description, faq-válaszok) nem lehet forráslink, ezért ott a szám maga a hiba
  const fejlecSzovegek = [['description', f.description], ...(Array.isArray(f.faq) ? f.faq.map((x, i) => [`faq[${i}]`, x?.a]) : [])];
  for (const [nev, s] of fejlecSzovegek) {
    if (typeof s === 'string' && SZAM.test(s) && !/tapasztalat/i.test(s)) failures.push(`szám a fejlécben forrás nélkül: ${nev}`);
  }

  // 6. elsődleges kulcsszó a címben vagy a ledében (szótövek első 5 karaktere)
  const lede = blokkok[0] ?? '';
  const mezo = kisbetu(`${f.title ?? ''} ${lede}`);
  const szavak = String(f.elsodleges ?? '').split(/\s+/).filter((s) => s.length >= 4);
  if (szavak.length && !szavak.every((sz) => mezo.includes(to(sz)))) failures.push(`az elsődleges kulcsszó („${f.elsodleges}”) nincs a címben vagy az első bekezdésben`);

  // 7. hírszavak: figyelmeztetés
  for (const h of hirszavak) if (kisbetu(torzs).includes(h)) warnings.push(`hírértelmű szó: „${h.trim()}”`);

  return { pass: failures.length === 0, failures, warnings };
}
