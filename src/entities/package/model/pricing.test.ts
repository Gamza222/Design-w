import { describe, expect, it } from 'vitest';

import {
  CALC_ADDONS,
  CALC_ADDONS_BYN,
  CALC_FORMATS,
  CALC_FORMATS_BYN,
  calcTotal,
  getCalculationContext,
  isFromEstimate,
} from './pricing';
import { getTariff, TARIFF_IDS } from './tariffs';

const format = (id: string) => CALC_FORMATS.find((item) => item.id === id)!;
const addon = (id: string) => CALC_ADDONS.find((item) => item.id === id)!;

describe('project estimates', () => {
  it.each(['planViz', 'full'])('does not charge again for visualization in %s', (id) => {
    expect(calcTotal(format(id), [addon('viz3d')], 72)).toBe(format(id).ratePerM2 * 72);
    expect(isFromEstimate(format(id), [addon('viz3d')])).toBe(false);
  });

  it('adds an optional visualization once and marks the estimate as a starting price', () => {
    expect(calcTotal(format('planning'), [addon('viz3d'), addon('viz3d')], 72)).toBe(180000);
    expect(isFromEstimate(format('planning'), [addon('viz3d')])).toBe(true);
  });

  it('keeps monthly supervision and unpriced services outside the project subtotal', () => {
    const extras = ['supervision', 'procurement', 'consultation'].map(addon);
    expect(calcTotal(format('drawings'), extras, 72)).toBe(144000);
    expect(
      calcTotal(
        CALC_FORMATS_BYN[1],
        CALC_ADDONS_BYN.filter((item) => item.kind !== 'perM2'),
        72,
      ),
    ).toBe(5040);
  });

  it('retains separately billed services and the BYN estimate in the lead context', () => {
    const context = getCalculationContext(
      'collages',
      ['viz3d', 'supervision', 'procurement', 'consultation'],
      80,
      'be',
    );
    expect(context).toMatchObject({
      area: 80,
      packageId: 'collages',
      currency: 'BYN',
      estimate: 10000,
      preliminary: true,
    });
    expect(context.extras).toHaveLength(4);
    expect(context.extras[1]).toContain('1\u00a0100\u00a0BYN/месяц');
    expect(context.extras[2]).toContain('Па запыце');
  });

  it('does not send an included service as a selected extra', () => {
    const context = getCalculationContext('full', ['viz3d', 'supervision'], 60, 'en');
    expect(context.estimate).toBe(234000);
    expect(context.extras).toEqual(['Design supervision — from 30,000\u00a0₽/month']);
  });

  it('treats electrical scope as a starting price', () => {
    expect(isFromEstimate(format('electric'), [])).toBe(true);
  });

  it.each(['ru', 'en', 'be'] as const)('renders every tariff completely in %s', (locale) => {
    for (const id of TARIFF_IDS) {
      const tariff = getTariff(id, locale);
      expect(tariff.name).toBeTruthy();
      expect(tariff.priceLabel).not.toContain('undefined');
      expect(tariff.includes.every(Boolean)).toBe(true);
      expect(tariff.exclusions.every(Boolean)).toBe(true);
      if (tariff.rate !== null) expect(tariff.priceLabel).toContain(locale === 'be' ? 'BYN' : '₽');
    }
  });
});
