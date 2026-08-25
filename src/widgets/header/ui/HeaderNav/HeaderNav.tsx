import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { AppLink } from '@shared/ui';

import styles from './HeaderNav.module.scss';

interface HeaderNavProps {
  /** Вызывается при клике по ссылке — например, чтобы закрыть мобильное меню. */
  onNavigate?: () => void;
  /** Доп. класс на контейнер — раскладку (отступы) задаёт виджет Header. */
  className?: string;
}

/** Навигация хедера. Порядок пунктов — как в примере. Один список на десктоп и мобайл. */
export function HeaderNav({ onNavigate, className }: HeaderNavProps) {
  const { t } = useTranslation();

  const links = [
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.about, label: t('nav.about') },
    { to: ROUTES.portfolio, label: t('nav.portfolio') },
    { to: ROUTES.blog, label: t('nav.blog') },
    { to: ROUTES.contact, label: t('nav.contact') },
  ];

  return (
    <nav className={cn(styles.nav, className)}>
      {links.map((link) => (
        <AppLink key={link.to} to={link.to} className={styles.link} onClick={onNavigate}>
          {link.label}
        </AppLink>
      ))}
    </nav>
  );
}
