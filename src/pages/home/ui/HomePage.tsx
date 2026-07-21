import { getPosts } from '@entities/post';
import { getProjects } from '@entities/project';
import { buildMeta, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { Achievements } from '@widgets/achievements';
import { BlogHome } from '@widgets/blog-home';
import { Calculator } from '@widgets/calculator';
import { ContactCta } from '@widgets/contact-cta';
import { Faq } from '@widgets/faq';
import { Fears } from '@widgets/fears';
import { Geography } from '@widgets/geography';
import { Hero } from '@widgets/hero';
import { Packages } from '@widgets/packages';
import { Process } from '@widgets/process';
import { Projects } from '@widgets/projects';
import { Reviews } from '@widgets/reviews';
import { ServicesHome } from '@widgets/services-home';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.brand} — ${t.home.hero.eyebrow}`, t.home.hero.subtitle, location.pathname);
}

export default function HomePage() {
  const locale = useLocale();
  const projects = getProjects(locale).slice(0, 6);
  const posts = getPosts(locale).slice(0, 3);

  // Воронка главной по ТЗ (мокапы 01/06/08/09/10): чередуем тёмные/светлые секции.
  // Hero+Пакеты → Услуги → Процесс(dark) → Портфолио → Достижения → География(dark) → Страхи →
  // Блог → Калькулятор(dark) → FAQ(dark) → Отзывы(dark) → Контакты/CTA(dark). Footer — в app-layout.
  return (
    <>
      <Hero bottomSlot={<Packages />} />
      <ServicesHome />
      <Process />
      <Projects projects={projects} />
      <Achievements />
      <Geography />
      <Fears />
      <BlogHome posts={posts} />
      <Calculator />
      <Faq />
      <Reviews />
      <ContactCta />
    </>
  );
}
