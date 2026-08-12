import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useScrollReveal } from '@shared/lib';
import { Accordion, Container, SectionHeader } from '@shared/ui';

import styles from './Faq.module.scss';

interface FaqItem {
  q: string;
  a: string;
}

/** Секция «Частые вопросы» (tone=dark, макет 10) — шапка слева (общий паттерн секций) + две
 *  независимые колонки стеклянных аккордеонов. Открыт один пункт за раз. Контент — i18n `home.faq`. */
export function Faq() {
  const { t } = useTranslation();
  const items = t('home.faq.items', { returnObjects: true }) as FaqItem[];
  const [open, setOpen] = useState(0);

  // Появление шапки и колонок аккордеонов по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>([`.${styles.head}`, `.${styles.col}`], {
    stagger: 0.12,
  });

  // Делим на две колонки: первая половина — слева, вторая — справа. На мобиле колонки стопкой
  // (грид → 1 столбец), порядок сохраняется (col1 = пункты 0..mid, col2 = mid..end).
  const mid = Math.ceil(items.length / 2);
  const columns = [
    { from: 0, items: items.slice(0, mid) },
    { from: mid, items: items.slice(mid) },
  ];

  return (
    <section className={styles.faq} data-tone="dark" ref={root}>
      <Container className={styles.inner}>
        <SectionHeader
          eyebrow={t('home.faq.eyebrow')}
          title={t('home.faq.title')}
          subtitle={t('home.faq.subtitle')}
          className={styles.head}
        />

        <div className={styles.grid}>
          {columns.map((col, c) => (
            <div key={c} className={styles.col}>
              {col.items.map((item, j) => {
                const idx = col.from + j;
                return (
                  <Accordion
                    key={idx}
                    id={`faq-${idx}`}
                    summary={item.q}
                    open={open === idx}
                    onToggle={() => setOpen(open === idx ? -1 : idx)}
                    className={styles.item}
                  >
                    <p className={styles.answer}>{item.a}</p>
                  </Accordion>
                );
              })}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
