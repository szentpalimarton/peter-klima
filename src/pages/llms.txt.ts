import { getCollection } from 'astro:content';
// ?raw: a Vite a build idején beemeli a fájl szövegét (a futó, bundle-ölt endpoint import.meta.url-je
// már a dist/ alá mutat, ezért fs-sel ott nem található).
import alap from '../data/llms-base.txt?raw';

// llms.txt: a kézi alap (src/data/llms-base.txt) + a Tudástár-kollekció cikkei, legújabb elöl.
// A kollekció sorai a {{TUDASTAR_KOLLEKCIO}} helyére kerülnek; üres kollekciónál a sor eltűnik.
const HELY = '{{TUDASTAR_KOLLEKCIO}}';

export const GET = async () => {
  const sorok = (await getCollection('tudastar'))
    .sort((a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime())
    .map((c) => `- https://fejersolarclean.hu/tudastar/${c.id}/ – ${c.data.title}: ${c.data.description}`);
  const text = sorok.length ? alap.replace(HELY, sorok.join('\n')) : alap.replace(`${HELY}\n`, '');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
