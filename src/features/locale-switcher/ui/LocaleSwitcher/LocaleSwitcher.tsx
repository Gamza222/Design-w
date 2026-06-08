import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';

import {
  getLocaleFromPath,
  LOCALE_LABELS,
  LOCALES,
  localizePath,
  stripLocale,
} from '@shared/config';
import { cn } from '@shared/lib';

import styles from './LocaleSwitcher.module.scss';

/** Дропдаун выбора языка — показывает текущую локаль, по клику раскрывает список. */
export function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={ref} className={styles.switcher}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
      >
        {LOCALE_LABELS[current]}
        <FaChevronDown className={cn(styles.chevron, open && styles.chevronOpen)} aria-hidden />
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          {others.map((locale) => (
            <button
              key={locale}
              type="button"
              role="menuitem"
              className={styles.option}
              onClick={() => {
                navigate(localizePath(canonical, locale) + search + hash);
                setOpen(false);
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
