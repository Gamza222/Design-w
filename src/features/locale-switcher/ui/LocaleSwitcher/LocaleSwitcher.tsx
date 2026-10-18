import { useEffect, useId, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  getLocaleFromPath,
  LOCALE_LABELS,
  LOCALES,
  localizePath,
  stripLocale,
} from '@shared/config';
import { cn } from '@shared/lib';

import { saveLocalePreference } from '../../lib/localePreference';
import styles from './LocaleSwitcher.module.scss';

/** Дропдаун выбора языка — показывает текущую локаль, по клику раскрывает список. */
export function LocaleSwitcher() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusLastRef = useRef(false);
  const menuId = useId();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const current = getLocaleFromPath(pathname);
  const canonical = stripLocale(pathname);
  const others = LOCALES.filter((l) => l !== current);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    const items = ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    if (items?.length) items[focusLastRef.current ? items.length - 1 : 0].focus();
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      className={styles.switcher}
      onBlur={(event) => {
        // A pointer click on a button may report null in Safari before its click
        // handler runs. Outside pointer clicks are handled separately above.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (!open) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
          return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
        );
        const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
        const nextIndex =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[nextIndex]?.focus();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-label={t('header.language')}
        onClick={() => {
          focusLastRef.current = false;
          setOpen((v) => !v);
        }}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            focusLastRef.current = event.key === 'ArrowUp';
            setOpen(true);
          }
        }}
      >
        {LOCALE_LABELS[current]}
        <FaChevronDown className={cn(styles.chevron, open && styles.chevronOpen)} aria-hidden />
      </button>

      {open && (
        <div id={menuId} className={styles.dropdown} role="menu" aria-label={t('header.language')}>
          {others.map((locale) => (
            <button
              key={locale}
              type="button"
              role="menuitem"
              className={styles.option}
              onClick={() => {
                saveLocalePreference(locale);
                navigate(localizePath(canonical, locale) + search + hash);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
