import { type ComponentType, type SVGProps, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CALC_ADDONS,
  CALC_ADDONS_BYN,
  CALC_AREA,
  CALC_FORMATS,
  CALC_FORMATS_BYN,
  calcTotal,
} from '@entities/package';
import { ROUTES } from '@shared/config';
import { cn, useLocale } from '@shared/lib';
import {
  Button,
  GlassPanel,
  IconArmchair,
  IconBolt,
  IconCheck,
  IconClipboardCheck,
  IconCube,
  IconLayout,
  IconMapPin,
  IconShield,
  IconWallet,
  Stepper,
} from '@shared/ui';

import styles from './ProjectCalculator.module.scss';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// Иконки по порядку i18n `home.calculator.formats` / `addons`.
const FORMAT_ICONS: Icon[] = [IconLayout, IconArmchair, IconCube, IconClipboardCheck];
const ADDON_ICONS: Icon[] = [IconCube, IconShield, IconWallet, IconBolt, IconArmchair, IconMapPin];

interface FormatText {
  name: string;
  price: string;
  desc: string;
}
interface AddonText {
  name: string;
  price: string;
}

const DEFAULT_FORMAT = 2;
const DEFAULT_ADDONS = [0, 3];

/** Интерактивный калькулятор (макет 09): формат → доп.услуги → площадь, справа live-сводка «Ваш
 *  проект» с пересчётом итога. Цены — `@entities/package` pricing; тексты — i18n `home.calculator`. */
export function ProjectCalculator() {
  const { t } = useTranslation();
  const locale = useLocale();

  const formatTexts = t('home.calculator.formats', { returnObjects: true }) as FormatText[];
  const addonTexts = t('home.calculator.addons', { returnObjects: true }) as AddonText[];
  const trust = t('home.calculator.trust', { returnObjects: true }) as string[];
  const unit = t('home.calculator.areaUnit');

  const [formatIdx, setFormatIdx] = useState(DEFAULT_FORMAT);
  const [addons, setAddons] = useState<number[]>(DEFAULT_ADDONS);
  const [area, setArea] = useState<number>(CALC_AREA.default);
  const calcFormats = locale === 'be' ? CALC_FORMATS_BYN : CALC_FORMATS;
  const calcAddons = locale === 'be' ? CALC_ADDONS_BYN : CALC_ADDONS;

  const toggleAddon = (i: number) =>
    setAddons((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const reset = () => {
    setFormatIdx(DEFAULT_FORMAT);
    setAddons(DEFAULT_ADDONS);
    setArea(CALC_AREA.default);
  };

  const total = useMemo(
    () =>
      calcTotal(
        calcFormats[formatIdx],
        addons.map((i) => calcAddons[i]),
        area,
      ),
    [formatIdx, addons, area, calcFormats, calcAddons],
  );

  const money = useMemo(() => {
    const isBelarus = locale === 'be';
    const nf = new Intl.NumberFormat(
      isBelarus ? 'be-BY' : locale === 'ru' ? 'ru-RU' : 'en-US',
      isBelarus
        ? {
            style: 'currency',
            currency: 'BYN',
            currencyDisplay: 'code',
            maximumFractionDigits: 0,
          }
        : undefined,
    );
    return (n: number) => (isBelarus ? nf.format(n) : `${nf.format(n)} ₽`);
  }, [locale]);

  const FormatIcon = FORMAT_ICONS[formatIdx] ?? FORMAT_ICONS[0];
  const selectedAddons = [...addons].sort((a, b) => a - b);

  const steps = t('home.calculator.steps', { returnObjects: true }) as Record<string, string>;

  return (
    <div className={styles.calc}>
      {/* Индикатор шагов */}
      <ol className={styles.steps}>
        {[steps.format, steps.addons, steps.area, steps.total].map((label, i) => (
          <li key={label} className={styles.stepChip}>
            <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        ))}
      </ol>

      <div className={styles.grid}>
        {/* Конфигуратор */}
        <div className={styles.config}>
          {/* 1. Формат */}
          <fieldset className={styles.block}>
            <legend className={styles.blockTitle}>{t('home.calculator.formatTitle')}</legend>
            <div className={styles.formats}>
              {formatTexts.map((f, i) => {
                const Icon = FORMAT_ICONS[i] ?? FORMAT_ICONS[0];
                const on = formatIdx === i;
                return (
                  <button
                    key={f.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFormatIdx(i)}
                    className={cn(styles.format, on && styles.formatOn)}
                  >
                    <span className={styles.formatNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.formatIcon}>
                      <Icon />
                    </span>
                    <span className={styles.formatName}>{f.name}</span>
                    <span className={styles.formatPrice}>{f.price}</span>
                    <span className={styles.formatDesc}>{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 2. Доп. услуги */}
          <fieldset className={styles.block}>
            <legend className={styles.blockTitle}>{t('home.calculator.addonsTitle')}</legend>
            <div className={styles.addons}>
              {addonTexts.map((a, i) => {
                const Icon = ADDON_ICONS[i] ?? ADDON_ICONS[0];
                const on = addons.includes(i);
                return (
                  <button
                    key={a.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAddon(i)}
                    className={cn(styles.addon, on && styles.addonOn)}
                  >
                    <span className={styles.addonIcon}>
                      <Icon />
                    </span>
                    <span className={styles.addonInfo}>
                      <span className={styles.addonName}>{a.name}</span>
                      <span className={styles.addonPrice}>{a.price}</span>
                    </span>
                    <span className={styles.addonCheck} aria-hidden="true">
                      <IconCheck />
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 3. Площадь */}
          <fieldset className={styles.block}>
            <legend className={styles.blockTitle}>{t('home.calculator.areaTitle')}</legend>
            <Stepper
              value={area}
              onChange={setArea}
              min={CALC_AREA.min}
              max={CALC_AREA.max}
              step={CALC_AREA.step}
              unit={` ${unit}`}
              label={t('home.calculator.areaTitle')}
              decreaseLabel={t('home.calculator.areaDecrease')}
              increaseLabel={t('home.calculator.areaIncrease')}
              className={styles.area}
            />
            <p className={styles.areaHint}>{t('home.calculator.areaHint')}</p>
          </fieldset>
        </div>

        {/* Live-сводка */}
        <GlassPanel as="aside" className={styles.summary}>
          <div className={styles.summaryHead}>
            <h3 className={styles.summaryTitle}>{t('home.calculator.resultTitle')}</h3>
            <button type="button" className={styles.reset} onClick={reset}>
              {t('home.calculator.resultEdit')}
            </button>
          </div>

          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t('home.calculator.resultFormatLabel')}</dt>
              <dd className={styles.rowFormat}>
                <span className={styles.rowFormatIcon}>
                  <FormatIcon />
                </span>
                <span>
                  <span className={styles.rowFormatName}>{formatTexts[formatIdx]?.name}</span>
                  <span className={styles.rowFormatPrice}>{formatTexts[formatIdx]?.price}</span>
                </span>
              </dd>
            </div>

            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t('home.calculator.resultAreaLabel')}</dt>
              <dd className={styles.rowValue}>
                {area} {unit}
              </dd>
            </div>

            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t('home.calculator.resultAddonsLabel')}</dt>
              <dd className={styles.rowValue}>
                {selectedAddons.length === 0 ? (
                  <span className={styles.empty}>{t('home.calculator.resultAddonsEmpty')}</span>
                ) : (
                  <ul className={styles.addonSummary}>
                    {selectedAddons.map((i) => (
                      <li key={i}>
                        <span>{addonTexts[i]?.name}</span>
                        <span className={styles.addonSummaryPrice}>{addonTexts[i]?.price}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>

            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t('home.calculator.resultTermLabel')}</dt>
              <dd className={styles.rowValue}>{t('home.calculator.resultTerm')}</dd>
            </div>
          </dl>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{t('home.calculator.resultTotalLabel')}</span>
            <span className={styles.totalValue} aria-live="polite">
              {money(total)}
            </span>
          </div>

          <p className={styles.note}>{t('home.calculator.resultNote')}</p>

          <Button to={ROUTES.contact} size="lg" className={styles.cta}>
            {t('home.calculator.cta')}
          </Button>

          <ul className={styles.trust}>
            {trust.map((item) => (
              <li key={item} className={styles.trustItem}>
                <IconCheck className={styles.trustIcon} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}
