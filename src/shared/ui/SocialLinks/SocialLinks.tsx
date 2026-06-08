import type { IconType } from 'react-icons';
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa';

import type { SocialLink, SocialType } from '../../config';
import { cn } from '../../lib/cn/cn';
import styles from './SocialLinks.module.scss';

const ICONS: Record<SocialType, IconType> = {
  telegram: FaTelegramPlane,
  vk: FaVk,
  whatsapp: FaWhatsapp,
};

interface SocialLinksProps {
  /** Список ссылок — приходит пропсом, чтобы блок был переиспользуем (header, footer). */
  items: readonly SocialLink[];
  className?: string;
}

/** Ряд круглых иконок-ссылок на соцсети. Цвет иконок — currentColor (управляется CSS). */
export function SocialLinks({ items, className }: SocialLinksProps) {
  return (
    <ul className={cn(styles.list, className)}>
      {items.map(({ type, label, href }) => {
        const Icon = ICONS[type];
        return (
          <li key={type} data-type={type}>
            <a
              className={styles.link}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon className={styles.icon} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
