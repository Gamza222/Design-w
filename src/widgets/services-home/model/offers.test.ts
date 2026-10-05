import { describe, expect, it } from 'vitest';

import { TARIFFS, TARIFF_IDS } from '@entities/package';

import { OFFERS } from './offers';

describe('service details', () => {
  it('uses the confirmed catalogue without obsolete paid extras', () => {
    expect(new Set(OFFERS.map(({ id }) => id))).toEqual(new Set(TARIFF_IDS));
    for (const offer of OFFERS) {
      expect(offer.addons?.every((id) => TARIFF_IDS.includes(id)) ?? true).toBe(true);
      expect(
        offer.addons?.some((id) => TARIFFS[offer.id].includedAddonIds.includes(id as 'viz3d')) ??
          false,
      ).toBe(false);
    }
  });

  it('does not illustrate unconfirmed electrical or consultation deliverables', () => {
    expect(OFFERS.find(({ id }) => id === 'electric')?.gallery).toEqual([]);
    expect(OFFERS.find(({ id }) => id === 'consultation')?.gallery).toEqual([]);
    expect(OFFERS.find(({ id }) => id === 'planViz')?.gallery).not.toContain('concept');
    expect(OFFERS.find(({ id }) => id === 'planViz')?.gallery).not.toContain('drawings');
  });
});
