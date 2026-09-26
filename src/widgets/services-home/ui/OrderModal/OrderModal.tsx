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

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

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

    const focusFrame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('input[name="name"]')?.focus();
    });

    return () => {
      cancelAnimationFrame(focusFrame);
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
      ).filter(
        (element) =>
          !element.matches(':disabled, [tabindex="-1"], [aria-hidden="true"]') &&
          element.getClientRects().length > 0,
      );
      if (focusable.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const index = active ? focusable.indexOf(active) : -1;
      // Advance explicitly: Safari's default Tab order can otherwise skip buttons,
      // including the close control, and escape a boundary-only focus trap.
      const next =
        index < 0
          ? event.shiftKey
            ? focusable.length - 1
            : 0
          : (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[next].focus();
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
