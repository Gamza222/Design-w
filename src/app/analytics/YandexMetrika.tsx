import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Начальный просмотр отправляет /metrika.js, остальные — после смены страницы и title. */
export function YandexMetrika() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const analyticsWindow = window as Window & { designSeichasTrackPage?: () => void };
    analyticsWindow.designSeichasTrackPage?.();
  }, [pathname, search]);

  return null;
}
