import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { Container, IconBadge } from '@shared/ui';

import { STEP_ICONS } from '../step-icons';
import styles from './Process.module.scss';

interface ProcessStep {
  title: string;
  desc: string;
}

/** Секция «Как проходит проект» (tone=dark, макет 01) — заголовок слева + горизонтальная лента из
 *  6 этапов: круглый контурный чип с иконкой, крупный номер, название и короткое описание; между
 *  этапами — пунктирный коннектор. Без длительностей/плашек — компактная лента из мокапа. */
export function Process() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const steps = t('home.process.steps', { returnObjects: true }) as ProcessStep[];

  // Появление этапов по скроллу. Уважаем prefers-reduced-motion.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(`.${styles.step}`, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.steps}`, start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.process} ref={root} data-tone="dark">
      <Container className={styles.inner}>
        <h2 className={styles.title}>{t('home.process.title')}</h2>

        <ol className={styles.steps}>
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i] ?? STEP_ICONS[0];
            return (
              <li key={step.title} className={styles.step}>
                <div className={styles.stepTop}>
                  <IconBadge icon={<Icon />} size="md" tone="outline" className={styles.stepBadge} />
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
