export const BRAND = 'Péter · Napelem- és Klímatisztítás';
export const PHONE_DISPLAY = '+36 20 495 4171';
export const PHONE_TEL = 'tel:+36204954171';
export const PHONE_E164 = '+36204954171';
export const EMAIL = 'prokontra.oroszi@gmail.com';

/**
 * Elsődleges megye – itt a legerősebb a helyi jelenlét (Péter Nadapon lakik).
 * A szolgáltatási terület ennél szélesebb, lásd AREA_PROSE / AREAS_SERVED.
 */
export const AREA = 'Fejér megye';

/** Rövid, prózai forma a kiszolgált területre (fejlécekhez, láblécbe). */
export const AREA_SHORT = 'Fejér megye · Velencei-tó · Balaton · budapesti agglomeráció';

/** Hosszabb prózai forma (bevezető szövegekhez). */
export const AREA_PROSE =
  'Fejér megye, a Velencei-tó és a Balaton környéke, valamint a budapesti agglomeráció';

/**
 * schema.org areaServed – minden oldal ezt használja, hogy a keresők és az
 * AI-motorok egységes képet kapjanak a kiszolgált területről.
 * Bővítéskor CSAK olyan települést vegyünk fel, ahova Péter tényleg kimegy.
 */
export const AREAS_SERVED = [
  { '@type': 'AdministrativeArea', name: 'Fejér megye' },
  { '@type': 'City', name: 'Székesfehérvár' },
  { '@type': 'City', name: 'Gárdony' },
  { '@type': 'City', name: 'Velence' },
  { '@type': 'City', name: 'Dunaújváros' },
  { '@type': 'City', name: 'Mór' },
  { '@type': 'City', name: 'Bicske' },
  { '@type': 'City', name: 'Martonvásár' },
  { '@type': 'City', name: 'Érd' },
  { '@type': 'City', name: 'Budaörs' },
  { '@type': 'City', name: 'Biatorbágy' },
  { '@type': 'City', name: 'Tatabánya' },
  { '@type': 'City', name: 'Veszprém' },
  { '@type': 'City', name: 'Siófok' },
  { '@type': 'City', name: 'Balatonfüred' },
];

/**
 * Közösségi profilok – a séma sameAs mezőjébe és a láblécbe.
 * A Facebook-oldalt Péterék hozták létre (2026. június); 45 követő, 4 vélemény.
 * TODO ha lesz vanity URL (facebook.com/peternapelem...), ide azt írjuk.
 */
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61590664083070';

/**
 * Kattintás-mérés (CRO-07) – Umami Cloud, sütimentes, ezért nem kell hozzá
 * cookie-banner, és az adatkezelési tájékoztató állításai igazak maradnak.
 * Ugyanaz a minta, mint az erotikfoto-n (ügynökségi standard: lead-gen → Umami).
 *
 * AKTIVÁLÁS (Márton, ~2 perc):
 *   1. https://cloud.umami.is → belépés (a fiók már él)
 *   2. Add website → Domain: fejersolarclean.hu
 *   3. A kapott Website ID-t (UUID) másold ide ↓
 *   4. build + deploy
 *
 * Amíg üres, SEMMI nem kerül az oldalba (se szkript, se kérés).
 * A mérés csak production buildben aktív – a localhost nem szennyezi.
 * Mért események: oldalletöltés (automatikus) + cta-* kattintások
 * (a meglévő 63 data-cta attribútumból, pl. cta-call-budos-cta).
 */
export const UMAMI_WEBSITE_ID = '22c1c8d7-d32f-4465-bbf6-f85e5db92bdd';

/** Base-path-aware URL a belső linkekhez és assetekhez (GitHub Pages subpath miatt). */
export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
};
