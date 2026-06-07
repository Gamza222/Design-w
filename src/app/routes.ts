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
    route('portfolio', '../pages/portfolio/ui/PortfolioPage.tsx', { id: `portfolio${suffix}` }),
    route('portfolio/:slug', '../pages/project/ui/ProjectPage.tsx', { id: `project${suffix}` }),
    route('blog', '../pages/blog/ui/BlogPage.tsx', { id: `blog${suffix}` }),
    route('blog/:slug', '../pages/post/ui/PostPage.tsx', { id: `post${suffix}` }),
    route('about', '../pages/about/ui/AboutPage.tsx', { id: `about${suffix}` }),
    route('contact', '../pages/contact/ui/ContactPage.tsx', { id: `contact${suffix}` }),
  ];
}

export default [...pages('-ru'), ...prefix('en', pages('-en'))] satisfies RouteConfig;
