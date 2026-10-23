import { parse } from 'yaml';

// A cikkfájl eleje: ---\n<YAML>\n---\n<Markdown>
export function szetszed(szoveg) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(szoveg);
  if (!m) throw new Error('nincs YAML fejléc (--- … ---) a fájl elején');
  return { fejlec: parse(m[1]) ?? {}, torzs: m[2] };
}
