// Генерация статичного build/client/404.html после `react-router build`.
// Зачем не React-страница: при `ssr: false` любой «чужой» URL раньше уходил через
// vercel.json-rewrite в __spa-fallback.html (статус 200) и ловил hydration mismatch
// (React #418): фолбэк пререндерен для «/», а Layout рендерит location-зависимый
// head (canonical/hreflang). Статичный 404 без JS решает обе проблемы разом:
// честный статус 404 (Vercel отдаёт 404.html автоматически) и ноль гидрации.
// Тексты берём из i18n-словарей — единый источник правды с ErrorBoundary.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

const CLIENT_DIR = join(cwd(), 'build', 'client');

if (!existsSync(CLIENT_DIR)) {
  console.error('generate-404: build/client not found — run `react-router build` first.');
  exit(1);
}

const locale = (name) =>
  JSON.parse(readFileSync(join(cwd(), 'src/shared/config/i18n/locales', name), 'utf8')).notFound;

const ru = locale('ru.json');
const en = locale('en.json');

// Шрифт — те же self-hosted сабсеты, что и у сайта (public/fonts — стабильные пути).
const font = (weight, subset) =>
  `@font-face{font-family:'Google Sans';font-style:normal;font-weight:${weight};font-display:swap;src:url('/fonts/google-sans/google-sans-${weight}-normal-${subset}.woff2') format('woff2')}`;

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>404 | ${ru.title} · TheDesignNow</title>
<style>
${font(400, 'cyrillic')}${font(400, 'latin')}${font(600, 'cyrillic')}${font(600, 'latin')}
:root{--dark:#191c22;--surface:#23262d;--border:#3a3f48;--light:#eef0f3;--muted:#a3aab4;--accent:#febc04;--silver:#d3d8e0}
*{margin:0;padding:0;box-sizing:border-box}
html{background:var(--dark);font-size:clamp(14px,0.8333vw,33.33px)}
body{min-height:100vh;display:grid;place-items:center;background:var(--dark);color:var(--light);font-family:'Google Sans',system-ui,-apple-system,'Segoe UI',roboto,sans-serif;text-align:center;padding:1.5rem}
main{max-width:34rem}
.logo{height:3rem;margin:0 auto 2.5rem;display:block}
.code{font-size:6rem;font-weight:600;line-height:1;letter-spacing:0.04em;color:var(--accent)}
h1{margin-top:1rem;font-size:1.75rem;font-weight:600;background:linear-gradient(115deg,#f8f9fb 20%,var(--silver) 55%,#9199a4 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:var(--silver)}
p{margin-top:0.75rem;color:var(--muted);font-size:1rem;line-height:1.6}
.en{margin-top:0.375rem;font-size:0.875rem}
.actions{margin-top:2.25rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{display:inline-block;padding:0.875rem 2rem;border-radius:999px;font-size:1rem;font-weight:600;text-decoration:none;background:var(--accent);color:var(--dark);transition:filter .2s}
.btn:hover{filter:brightness(1.06)}
.btn.ghost{background:transparent;color:var(--light);border:1px solid var(--border)}
.btn.ghost:hover{border-color:var(--muted);filter:none}
a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (forced-colors:active){h1{background:none;-webkit-text-fill-color:CanvasText;color:CanvasText}}
</style>
</head>
<body>
<main>
<img class="logo" src="/images/logo.png" alt="TheDesignNow">
<div class="code" aria-hidden="true">404</div>
<h1>${ru.title}</h1>
<p>${ru.subtitle}</p>
<p class="en" lang="en">${en.title}. ${en.subtitle}</p>
<div class="actions">
<a class="btn" href="/">${ru.back}</a>
<a class="btn ghost" href="/en/" lang="en">${en.back}</a>
</div>
</main>
</body>
</html>
`;

writeFileSync(join(CLIENT_DIR, '404.html'), html);
console.log('generate-404: build/client/404.html');
