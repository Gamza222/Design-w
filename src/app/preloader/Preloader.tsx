import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { completePreloader } from '@shared/lib';
import { Logo } from '@shared/ui';
import styles from './Preloader.module.scss';

// Синхронно с CSS (Preloader.module.scss): контент поднимается ~0–0.9с, линия наливается ~0.15–1.1с,
// шторка уходит 1.1→1.65с. Будим входные анимации сайта РОВНО когда шторка начинает подниматься (LIFT_MS):
// контент «всплывает» из-под уходящей шторки — лоадер отыграл полностью (линия налилась), затем сайт.
// Без щели пустого экрана между уходом шторки и появлением контента. Затем снимаем шторку из DOM (REMOVE_MS).
const LIFT_MS = 1100;
const REMOVE_MS = 1900;

/**
 * Брендовая стартовая шторка. Рендерится в prerendered-HTML (без вспышки): на тёмном фоне сайта —
 * марка-логотип, вордмарк и золотая линия-прогресс. Уход — на CSS (`forwards`), поэтому шторка
 * исчезает даже если JS не успел. По таймеру шлёт `completePreloader()` (старт анимаций сайта) и затем
 * снимает себя из DOM. `pointer-events: none` — никогда не перехватывает клики. Reduced-motion → сразу скрыта.
 */
export function Preloader() {
  const { t } = useTranslation();
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const lift = setTimeout(completePreloader, LIFT_MS);
    const remove = setTimeout(() => setRemoved(true), REMOVE_MS);
    return () => {
      clearTimeout(lift);
      clearTimeout(remove);
    };
  }, []);

  if (removed) return null;

  return (
    <div className={styles.preloader} aria-hidden="true">
      <div className={styles.inner}>
        <Logo className={styles.logo} title={t('brand')} style={{ height: 'var(--space-16)' }} />
        <span className={styles.brand}>{t('brand')}</span>
        <span className={styles.bar}>
          <span className={styles.fill} />
        </span>
      </div>
    </div>
  );
}
