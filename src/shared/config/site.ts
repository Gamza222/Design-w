// Public site URL — used for canonical / hreflang tags.
// Override per environment via VITE_SITE_URL.
export const SITE_URL = (
  (import.meta.env?.VITE_SITE_URL as string | undefined) ?? 'https://designseichas.ru'
).replace(/\/$/, '');
