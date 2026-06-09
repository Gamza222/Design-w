import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';

import { HERO_BENEFITS } from '../../lib/benefits';
import styles from './HeroBenefits.module.scss';

interface HeroBenefitsProps {
  className?: string;
}

/** Правая панель Hero «Что вы получите» — тёмная полупрозрачная карточка. */
export function HeroBenefits({ className }: HeroBenefitsProps) {
  const { t } = useTranslation();

  return (
    <div className={cn(styles.panel, className)}>
      <p className={styles.heading}>{t('home.hero.benefitsTitle')}</p>
      <ul className={styles.list}>
        {HERO_BENEFITS.map(({ id, icon: Icon, titleKey, descKey }) => (
          <li key={id} className={styles.item}>
            <Icon className={styles.icon} />
            <div>
              <p className={styles.title}>{t(titleKey)}</p>
              <p className={styles.desc}>{t(descKey)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
