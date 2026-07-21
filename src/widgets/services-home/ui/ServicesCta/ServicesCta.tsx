import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';
import {
  IconArmchair,
  IconBadge,
  IconCheck,
  IconHardHat,
  IconLayout,
  IconShield,
  IconWallet,
} from '@shared/ui';

import { ConsultForm } from '../ConsultForm/ConsultForm';
import styles from './ServicesCta.module.scss';

// Иконки пунктов «Кому подойдут наши услуги» — по порядку i18n-массива home.services.who.items.
const WHO_ICONS = [IconLayout, IconHardHat, IconArmchair, IconWallet, IconShield];

/** id тёмной панели с формой — цель «Заказать этот пакет» из модалки (скролл + фокус). */
export const REQUEST_FORM_ID = 'services-request';

interface ServicesCtaProps {
  className?: string;
}

/** Низ блока услуг: слева «Кому подойдут наши услуги», справа тёмная панель с формой
 *  «Не знаете, что выбрать?». Панель имеет id="services-request" — на неё ведёт
 *  кнопка «Заказать этот пакет» из модалки (фокус + плавный скролл). */
export function ServicesCta({ className }: ServicesCtaProps) {
  const { t } = useTranslation();
  const whoItems = t('home.services.who.items', { returnObjects: true }) as string[];
  const benefits = t('home.services.cta.benefits', { returnObjects: true }) as string[];

  return (
    <div className={cn(styles.bottom, className)}>
      <div className={styles.who}>
        <h3 className={styles.whoTitle}>{t('home.services.who.title')}</h3>
        <ul className={styles.whoList}>
          {whoItems.map((item, i) => {
            const WhoIcon = WHO_ICONS[i] ?? IconCheck;
            return (
              <li key={item} className={styles.whoItem}>
                <IconBadge icon={<WhoIcon />} size="sm" tone="outline" />
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* tabIndex=-1 — цель программного фокуса из модалки («Заказать этот пакет»). */}
      <div className={styles.panel} data-tone="dark" id={REQUEST_FORM_ID} tabIndex={-1}>
        <div className={styles.panelInfo}>
          <h3 className={styles.panelTitle}>{t('home.services.cta.title')}</h3>
          <p className={styles.panelText}>{t('home.services.cta.text')}</p>
          <ul className={styles.benefits}>
            {benefits.map((benefit) => (
              <li key={benefit} className={styles.benefit}>
                <IconCheck aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <ConsultForm />
      </div>
    </div>
  );
}