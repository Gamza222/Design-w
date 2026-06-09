import type { SVGProps } from 'react';

// Набор линейных иконок — инлайн-SVG на currentColor (как Logo). Цвет и размер
// управляются из CSS (color + width/height). Декоративные → aria-hidden.

type IconProps = SVGProps<SVGSVGElement>;

/** Базовая обёртка: общие атрибуты viewBox/обводки. Размер по умолчанию 1em (масштаб с текстом). */
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// --- Буллеты Hero ----------------------------------------------------------

/** Часы — «30-ти минутная консультация». */
export function IconClock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v4.8l3.2 1.9" />
    </Icon>
  );
}

/** Документ с галочкой — «Работаем по договору». */
export function IconContract(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 13.5l2 2 3.5-4" />
    </Icon>
  );
}

/** Глобус — «Удалённо по всей России». */
export function IconGlobe(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z" />
    </Icon>
  );
}

// --- Бенефиты Hero «Что вы получите» --------------------------------------

/** План комнат — «Планировочное решение». */
export function IconLayout(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 10h8M11 3v18M11 14h10" />
    </Icon>
  );
}

/** Кресло — «Визуальная концепция». */
export function IconArmchair(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 10V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2" />
      <path d="M5 10a2 2 0 0 0-2 2v4h2" />
      <path d="M19 10a2 2 0 0 1 2 2v4h-2" />
      <path d="M5 14h14v2H5z" />
      <path d="M6 18v2M18 18v2" />
    </Icon>
  );
}

/** Линейка-чертёж — «Эскизные планы». */
export function IconRuler(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="8.5" width="19" height="7" rx="1.2" />
      <path d="M6.5 8.5v3M10 8.5v4M13.5 8.5v3M17 8.5v4" />
    </Icon>
  );
}

/** Папка — «Расчёт и сопровождение». */
export function IconFolderCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9.5 13l2 2 3.5-3.5" />
    </Icon>
  );
}

// --- Пакеты ----------------------------------------------------------------

/** Галочка — пункты списка фич пакета. */
export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Icon>
  );
}

/** Калькулятор — блок «Нужен расчёт?». */
export function IconCalculator(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="8" y="6" width="8" height="3" rx="0.6" />
      <path d="M9 13h.01M12 13h.01M15 13h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01" />
    </Icon>
  );
}
