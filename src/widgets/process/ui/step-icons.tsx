import type { ComponentType, SVGProps } from 'react';

// Уникальные иконки этапов «Как проходит проект» — линейные SVG на currentColor, заданы локально
// в виджете (НЕ переиспользуем общий набор @shared/ui/icons). Стиль обводки — как у общих иконок.

type IconProps = SVGProps<SVGSVGElement>;

function StepSvg({ children, ...props }: IconProps) {
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

/** 01 Заявка — «бумажный самолётик» (отправить заявку на сайте/в MAX). */
function IconRequest(props: IconProps) {
  return (
    <StepSvg {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9z" />
    </StepSvg>
  );
}

/** 02 Обсуждаем задачу — округлый диалоговый «пузырь» с тремя точками. */
function IconDiscuss(props: IconProps) {
  return (
    <StepSvg {...props}>
      <path d="M21 11.5a8 8 0 0 1-11.6 7.1L3.5 20l1.4-4.4A8 8 0 1 1 21 11.5z" />
      <path d="M8.5 11.7h.01M12 11.7h.01M15.5 11.7h.01" />
    </StepSvg>
  );
}

/** 03 Считаем стоимость — ценник с отверстием (стоимость и сроки проекта). */
function IconEstimate(props: IconProps) {
  return (
    <StepSvg {...props}>
      <path d="M4 4h6.2a1 1 0 0 1 .7.3l8.8 8.8a1 1 0 0 1 0 1.4l-5.2 5.2a1 1 0 0 1-1.4 0L4.3 10.9a1 1 0 0 1-.3-.7z" />
      <path d="M8 8h.01" />
    </StepSvg>
  );
}

/** 04 Планировка — план квартиры: стены с дверным проёмом (варианты планировки). */
function IconPlan(props: IconProps) {
  return (
    <StepSvg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M10 3v6M10 13v8M3 13h7M13 16h8" />
    </StepSvg>
  );
}

/** 05 Концепция — палитра с мазками (стиль, цвета, материалы и мебель). */
function IconConcept(props: IconProps) {
  return (
    <StepSvg {...props}>
      <path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.8-.9 1.5-1.9-.3-1 .4-2.1 1.5-2.1H17a4 4 0 0 0 4-4c0-5-4-8-9-8z" />
      <path d="M7.5 11.2h.01M10 7.7h.01M14.6 7.7h.01" />
    </StepSvg>
  );
}

/** 06 Передаём проект — папка со стрелкой вверх (передача/выгрузка готового проекта). */
function IconHandover(props: IconProps) {
  return (
    <StepSvg {...props}>
      <path d="M3 7.5a1 1 0 0 1 1-1h4.5l1.8 1.8H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M12 16.8v-4.6M9.7 14.5 12 12.2l2.3 2.3" />
    </StepSvg>
  );
}

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/** Иконки этапов — по порядку i18n `home.process.steps`. */
export const STEP_ICONS: IconType[] = [
  IconRequest,
  IconDiscuss,
  IconEstimate,
  IconPlan,
  IconConcept,
  IconHandover,
];
