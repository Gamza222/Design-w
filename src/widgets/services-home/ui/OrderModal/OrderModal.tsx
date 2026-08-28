import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { ContactForm } from '@features/contact-form';
import { IconClose } from '@shared/ui';

import type { Offer } from '../../model/types';
import styles from './OrderModal.module.scss';

interface OrderModalProps {
  offer: Offer;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Accessible full enquiry dialog opened from a selected service. */
export function OrderModal({ offer, onClose }: OrderModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('input[name="name"]')?.focus();
    });

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && active === last) {
        first.focus();
        event.preventDefault();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const serviceName = t(`home.services.items.${offer.id}.name`);

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        pressedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && pressedOnBackdrop.current) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        data-tone="paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('home.services.orderForm.close')}
        >
          <IconClose aria-hidden="true" />
        </button>

        <div className={styles.scroller}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{t('home.services.orderForm.eyebrow')}</p>
            <h3 id={titleId} className={styles.title}>
              {t('home.services.orderForm.title')}
            </h3>
            <p className={styles.subtitle}>
              {t('home.services.orderForm.subtitle', { service: serviceName })}
            </p>
          </header>
          <ContactForm initialPackage={offer.id} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
