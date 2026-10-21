// Один и тот же Google tag в React-документе и отдельной статической странице 404.
export const GOOGLE_TAG_ID = 'G-FGETKE5FZQ';
export const GOOGLE_TAG_URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
export const GOOGLE_TAG_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');`;
