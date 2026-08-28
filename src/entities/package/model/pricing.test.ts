import { describe, expect, it } from 'vitest';

import { CALC_ADDONS, CALC_FORMATS, calcTotal } from './pricing';

describe('calculator pricing', () => {
  it('does not charge twice for a visualization included in the selected format', () => {
    expect(calcTotal(CALC_FORMATS[2], [CALC_ADDONS[0]], 72)).toBe(216000);
  });

  it('adds a visualization when the selected format does not include it', () => {
    expect(calcTotal(CALC_FORMATS[0], [CALC_ADDONS[0]], 72)).toBe(180000);
  });

  it('keeps services priced on request out of the numeric estimate', () => {
    expect(calcTotal(CALC_FORMATS[0], [CALC_ADDONS[2]], 72)).toBe(108000);
  });
});
