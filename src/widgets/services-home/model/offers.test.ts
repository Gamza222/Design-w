import { describe, expect, it } from 'vitest';

import { OFFERS } from './offers';

describe('service add-ons', () => {
  it('uses the add-ons stated for standard services', () => {
    expect(OFFERS.find((offer) => offer.id === 'planning')?.addons).toEqual([
      'supervision',
      'ergonomics',
      'prelaunch',
    ]);
  });

  it('uses the distinct author-supervision add-ons', () => {
    expect(OFFERS.find((offer) => offer.id === 'supervision')?.addons).toEqual([
      'procurement',
      'ergonomics',
      'prelaunch',
    ]);
  });

  it('does not invent add-ons for consultations', () => {
    expect(OFFERS.find((offer) => offer.id === 'ergonomics')?.addons).toBeUndefined();
    expect(OFFERS.find((offer) => offer.id === 'prelaunch')?.addons).toBeUndefined();
  });
});
