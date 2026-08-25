import { useEffect, useState } from 'react';

// Единый сигнал «прелоадер ушёл» — связывает шторку и входные анимации сайта: сначала полностью
// отыгрывает лоадер, и только ПОСЛЕ него стартуют появления (Hero, хедер, ряд пакетов, секции по
// скроллу). Простое модульное состояние + подписки (без контекста/стора — лаконично).

let done = false;
let armed = false;
const listeners = new Set<() => void>();

// Страховочный таймер: если по какой-то причине прелоадер не вызвал complete (ошибка/частичная
// гидрация) — контент всё равно покажется, а не «зависнет» скрытым. Армируется при первой подписке.
const SAFETY_MS = 3500;

function arm() {
  if (armed || typeof window === 'undefined') return;
  armed = true;
  window.setTimeout(completePreloader, SAFETY_MS);
}

/** Помечает прелоадер завершённым и будит подписчиков (идемпотентно). */
export function completePreloader() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

/**
 * Реактивно отдаёт «прелоадер ушёл?». Пока false — входные анимации держат контент скрытым; когда
 * становится true — проигрывают появление. На prerender эффекты не выполняются → HTML с полным
 * контентом (хук не прячет ничего на сервере). При SPA-переходах (прелоадер давно ушёл) сразу true.
 */
export function usePreloaderDone(): boolean {
  const [value, setValue] = useState(done);

  useEffect(() => {
    if (done) {
      setValue(true);
      return;
    }
    arm();
    const notify = () => setValue(true);
    listeners.add(notify);
    return () => {
      listeners.delete(notify);
    };
  }, []);

  return value;
}
