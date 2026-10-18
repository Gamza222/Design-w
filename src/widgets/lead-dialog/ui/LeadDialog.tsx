import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { ContactForm } from '@features/contact-form';
import {
  captureLeadAttribution,
  formatMoney,
  useLocale,
  LEAD_DIALOG_EVENT,
  type LeadContext,
  type LeadDialogRequest,
} from '@shared/lib';
import { IconClose } from '@shared/ui';

import styles from './LeadDialog.module.scss';

export function LeadDialog() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { search } = useLocation();
  const [context, setContext] = useState<LeadContext | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const pointerTrigger = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const close = useCallback(() => setContext(null), []);

  useEffect(() => {
    captureLeadAttribution();
  }, [search]);

  useEffect(() => {
    const open = (event: Event) => {
      const request = (event as CustomEvent<LeadDialogRequest>).detail;
      trigger.current =
        request.returnFocus ??
        pointerTrigger.current ??
        (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setContext(request.context);
    };
    // Safari does not focus a button on pointer click; preserve that actual trigger.
    const rememberPointer = (event: PointerEvent) => {
      pointerTrigger.current =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('button,a[href]')
          : null;
    };
    const clearPointer = () => {
      pointerTrigger.current = null;
    };
    document.addEventListener('pointerdown', rememberPointer, true);
    document.addEventListener('keydown', clearPointer, true);
    window.addEventListener(LEAD_DIALOG_EVENT, open);
    return () => {
      window.removeEventListener(LEAD_DIALOG_EVENT, open);
      document.removeEventListener('pointerdown', rememberPointer, true);
      document.removeEventListener('keydown', clearPointer, true);
    };
  }, []);

  useEffect(() => {
    if (!context || !dialog.current) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    element.showModal();
    element.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [context]);

  if (!context) return null;
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={close}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const elements = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href],button,input,select,textarea,[tabindex]',
          ),
        ).filter(
          (element) =>
            !element.matches(':disabled,[tabindex="-1"],[aria-hidden="true"]') &&
            element.getClientRects().length > 0,
        );
        if (!elements.length) return;
        const index = elements.indexOf(document.activeElement as HTMLElement);
        const next =
          index < 0
            ? event.shiftKey
              ? elements.length - 1
              : 0
            : (index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length;
        event.preventDefault();
        elements[next].focus({ preventScroll: true });
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            close();
        }
      }}
    >
      <button
        type="button"
        className={styles.close}
        onClick={close}
        aria-label={t('home.services.orderForm.close')}
      >
        <IconClose />
      </button>
      <h2 id={titleId}>{t('home.services.orderForm.title')}</h2>
      {(context.packageName || context.service || context.project) && (
        <p className={styles.summary}>
          {context.packageName || context.service || context.project}
        </p>
      )}
      {context.area !== undefined && (
        <p className={styles.summary}>
          {context.area} {t('home.calculator.areaUnit')}
        </p>
      )}
      {context.estimate !== undefined && (
        <p className={styles.summary}>
          {t('home.calculator.resultTotalLabel')}:{' '}
          {formatMoney(
            context.estimate,
            context.currency === 'BYN' ? 'be' : locale === 'be' ? 'ru' : locale,
          )}
        </p>
      )}
      {context.estimate !== undefined && (
        <p className={styles.summary}>{t('home.calculator.resultNote')}</p>
      )}
      {!!context.extras?.length && <p className={styles.summary}>{context.extras.join(' · ')}</p>}
      <ContactForm context={context} />
    </dialog>
  );
}
