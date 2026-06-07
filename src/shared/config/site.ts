// Public site URL — used for canonical / hreflang tags.
// Override per environment via VITE_SITE_URL (set in Vercel). Update the fallback
// once the production domain is known.
export const SITE_URL = (
  (import.meta.env?.VITE_SITE_URL as string | undefined) ?? 'https://thedesignnow.vercel.app'
).replace(/\/$/, '');
