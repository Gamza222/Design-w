import type { ComponentType, SVGProps } from 'react';

// Двутоновые иконки страхов (макет 07): тёмно-синяя база (currentColor — навигационный navy задаётся
// из CSS на чипе) + оранжевые акценты (var(--clr-accent)). Заданы локально в виджете, НЕ из @shared/ui.

type IconProps = SVGProps<SVGSVGElement>;

const accentStroke = { stroke: 'var(--clr-accent)' } as const;
const accentFill = { fill: 'var(--clr-accent)', stroke: 'var(--clr-accent)' } as const;

function FearSvg({ children, ...props }: IconProps) {
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

/** Бюджет — калькулятор: navy-корпус и кнопки + оранжевый экран. */
function IconBudget(props: IconProps) {
  return (
    <FearSvg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="8" y="6" width="8" height="3.4" rx="0.6" style={accentFill} />
      <path d="M8.5 13h0M12 13h0M15.5 13h0M8.5 16.5h0M12 16.5h0M15.5 16.5h0" />
    </FearSvg>
  );
}

/** Удобство — диван: navy-каркас + оранжевая линия подушки. */
function IconComfort(props: IconProps) {
  return (
    <FearSvg {...props}>
      <path d="M5 11V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
      <path d="M3.6 11.6a1.6 1.6 0 0 1 3.1 0V14h10.6v-2.4a1.6 1.6 0 0 1 3.1 0V17a1 1 0 0 1-1 1H4.6a1 1 0 0 1-1-1z" />
      <path d="M6.7 18v1.6M17.3 18v1.6" />
      <path d="M8.6 11h6.8" style={accentStroke} />
    </FearSvg>
  );
}

/** Строители — чертёж: navy-лист + оранжевые линии плана. */
function IconBlueprint(props: IconProps) {
  return (
    <FearSvg {...props}>
      <path d="M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12h6M9 15.5h4" style={accentStroke} />
    </FearSvg>
  );
}

/** Поддержка — гарнитура: navy-наушники + оранжевый микрофон-дуга. */
function IconSupport(props: IconProps) {
  return (
    <FearSvg {...props}>
      <path d="M5 13a7 7 0 0 1 14 0" />
      <path d="M5 13h2.3v5H6a1 1 0 0 1-1-1z" />
      <path d="M19 13h-2.3v5H18a1 1 0 0 0 1-1z" />
      <path d="M16.7 18.4a3 3 0 0 1-2.9 2.6H12.4" style={accentStroke} />
    </FearSvg>
  );
}

/** Правки — документ с карандашом: navy-лист и строки + оранжевый карандаш. */
function IconRevise(props: IconProps) {
  return (
    <FearSvg {...props}>
      <path d="M13 4.5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-6.5" />
      <path d="M8.5 10h4M8.5 13.5h3" />
      <path d="M14.7 11.6 19.6 6.7 21.5 8.6 16.6 13.5 13.8 14.4z" style={accentStroke} />
    </FearSvg>
  );
}

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/** Иконки страхов — по порядку i18n `home.fears.items`:
 *  бюджет, удобство интерьера, передача строителям, поддержка после проекта, правки. */
export const FEAR_ICONS: IconType[] = [
  IconBudget,
  IconComfort,
  IconBlueprint,
  IconSupport,
  IconRevise,
];
