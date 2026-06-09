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

// --- Управляющие (примитивы: Accordion / Stepper / ссылки) ------------------

/** Шеврон вниз — Accordion / селекты. */
export function IconChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

/** Плюс — Stepper «+». */
export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

/** Минус — Stepper «−». */
export function IconMinus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

/** Стрелка вправо — CTA-ссылки, «как работает», крошки. */
export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

/** Звезда (filled) — Rating / отзывы. Базовый Icon — stroke-only, поэтому переопределяем заливку. */
export function IconStar(props: IconProps) {
  return (
    <Icon fill="currentColor" stroke="none" {...props}>
      <path d="M12 3l2.6 5.55 6.1.7-4.5 4.15 1.2 6-5.4-3.05L6.2 19.4l1.2-6-4.5-4.15 6.1-.7z" />
    </Icon>
  );
}

// --- Воронка (процесс / география / страхи / калькулятор / контакты) --------

/** Реплика — знакомство (процесс), контакты. */
export function IconChat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3a1 1 0 0 1-1-1V6a1 1 0 0 1 0-1z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </Icon>
  );
}

/** Лампа — концепция (процесс), подсказка (страхи). */
export function IconLightbulb(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.4c.7.7 1 1.4 1 2.6h6c0-1.2.3-1.9 1-2.6A6 6 0 0 0 12 3z" />
    </Icon>
  );
}

/** Щит с галочкой — «работаем по договору», доверие. */
export function IconShield(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

/** Метка на карте — города (география). */
export function IconMapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </Icon>
  );
}

/** Самолётик — «удалённо по всей России». */
export function IconPlane(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 3L3 10.5l6.4 2.5 2.6 6.5 3-6.7z" />
      <path d="M9.4 13l5.6-5.5" />
    </Icon>
  );
}

/** Рубль в круге — «0 ₽», цена калькулятора. */
export function IconRuble(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 17V7h3.2a2.6 2.6 0 0 1 0 5.2H8m0 2.4h6" />
    </Icon>
  );
}

/** Гарнитура — поддержка, «после проекта всё пропадёт». */
export function IconHeadset(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.4" />
      <rect x="17" y="13" width="4" height="6" rx="1.4" />
      <path d="M20 19a4 4 0 0 1-4 3h-2" />
    </Icon>
  );
}

/** Кошелёк — бюджет (страхи/калькулятор). */
export function IconWallet(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <path d="M4 7l11-2.2V7" />
      <path d="M16.5 13h.01" />
    </Icon>
  );
}

/** Карандаш — «понадобится что-то изменить». */
export function IconEdit(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17z" />
      <path d="M14 7l3 3" />
    </Icon>
  );
}

/** Каска — «строители не поймут проект». */
export function IconHardHat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 18h18" />
      <path d="M5 17v-2a7 7 0 0 1 14 0v2" />
      <path d="M10 6.2V4.5A1.5 1.5 0 0 1 11.5 3h1A1.5 1.5 0 0 1 14 4.5v1.7" />
    </Icon>
  );
}

/** Замок — «данные защищены» (форма). */
export function IconLock(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2.5" />
    </Icon>
  );
}

/** Куб — 3D-визуализация (калькулятор/форматы). */
export function IconCube(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12v9M4 7.5l8 4.5 8-4.5" />
    </Icon>
  );
}

/** Планшет с галочкой — авторский надзор / комплектация. */
export function IconClipboardCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h8a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M10 3.5h4V6h-4z" />
      <path d="M9.5 13l2 2 3.5-3.5" />
    </Icon>
  );
}

/** Молния — электрика (калькулятор). */
export function IconBolt(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13 3L5 13h5l-1 8 8-11h-5z" />
    </Icon>
  );
}

/** Телефон — контакты/хедер. */
export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 4h3l2 5-2.2 1.2a11 11 0 0 0 5 5L17 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2z" />
    </Icon>
  );
}

/** Конверт — почта (контакты/футер). */
export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </Icon>
  );
}

/** Кавычки — большая карточка отзыва. */
export function IconQuote(props: IconProps) {
  return (
    <Icon fill="currentColor" stroke="none" {...props}>
      <path d="M6 7h4.2v5.2c0 2.4-1.4 3.9-3.8 4.4l-.4-1.6c1.1-.3 1.7-.9 1.8-1.9H6z" />
      <path d="M14 7h4.2v5.2c0 2.4-1.4 3.9-3.8 4.4l-.4-1.6c1.1-.3 1.7-.9 1.8-1.9H14z" />
    </Icon>
  );
}
