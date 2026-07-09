export const BRAND = 'Péter · Napelem- és Klímatisztítás';
export const PHONE_DISPLAY = '+36 20 495 4171';
export const PHONE_TEL = 'tel:+36204954171';
export const PHONE_E164 = '+36204954171';
export const EMAIL = 'prokontra.oroszi@gmail.com';
export const AREA = 'Fejér megye';

/** Base-path-aware URL a belső linkekhez és assetekhez (GitHub Pages subpath miatt). */
export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
};
