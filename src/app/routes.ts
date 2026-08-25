import {
  index,
  prefix,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from '@react-router/dev/routes';

// The page set is defined once and mirrored under the `/en` prefix. Each route
// needs a unique id because the same module file is reused across both locales.
function pages(suffix: string): RouteConfigEntry[] {
  return [
    index('../pages/home/ui/HomePage.tsx', { id: `home${suffix}` }),
    route('services', '../pages/services/ui/ServicesPage.tsx', { id: `services${suffix}` }),
    // SEO-посадки услуг: три литеральных корневых пути на один модуль страницы
    // (какая услуга — модуль определяет по pathname; список — SERVICE_LANDINGS в @shared/config).
    route('planirovka-kvartiry', '../pages/service/ui/ServicePage.tsx', {
      id: `service-planirovka${suffix}`,
    }),
    route('3d-vizualizaciya-interera', '../pages/service/ui/ServicePage.tsx', {
      id: `service-viz3d${suffix}`,
    }),
    route('eskiznyj-dizajn-proekt', '../pages/service/ui/ServicePage.tsx', {
      id: `service-sketch${suffix}`,
    }),
    route('portfolio', '../pages/portfolio/ui/PortfolioPage.tsx', { id: `portfolio${suffix}` }),
    route('portfolio/:slug', '../pages/project/ui/ProjectPage.tsx', { id: `project${suffix}` }),
    route('blog', '../pages/blog/ui/BlogPage.tsx', { id: `blog${suffix}` }),
    route('blog/:slug', '../pages/post/ui/PostPage.tsx', { id: `post${suffix}` }),
    route('about', '../pages/about/ui/AboutPage.tsx', { id: `about${suffix}` }),
    route('contact', '../pages/contact/ui/ContactPage.tsx', { id: `contact${suffix}` }),
    route('privacy', '../pages/legal/ui/LegalPage.tsx', { id: `privacy${suffix}` }),
    route('offer', '../pages/legal/ui/LegalPage.tsx', { id: `offer${suffix}` }),
    route('requisites', '../pages/legal/ui/LegalPage.tsx', { id: `requisites${suffix}` }),
    route('consent', '../pages/legal/ui/LegalPage.tsx', { id: `consent${suffix}` }),
  ];
}

export default [
  ...pages('-ru'),
  ...prefix('en', pages('-en')),
  ...prefix('by', pages('-be')),
] satisfies RouteConfig;
