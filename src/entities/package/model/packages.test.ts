import { describe, expect, it } from 'vitest';

import { PACKAGES } from './packages';
import { MAIN_PACKAGE_IDS, TARIFFS } from './tariffs';

describe('confirmed package scope', () => {
  it('offers five main packages at the confirmed rates', () => {
    expect(PACKAGES.map(({ id }) => id)).toEqual(MAIN_PACKAGE_IDS);
    expect(MAIN_PACKAGE_IDS.map((id) => TARIFFS[id].rates?.RUB)).toEqual([
      1500, 2000, 2500, 3000, 3900,
    ]);
    expect(MAIN_PACKAGE_IDS.map((id) => TARIFFS[id].rates?.BYN)).toEqual([55, 70, 90, 110, 140]);
  });

  it('does not add drawings or collages to layout plus visualizations', () => {
    expect(TARIFFS.planViz.featureKeys).toContain('roomVisualizations');
    expect(TARIFFS.planViz.featureKeys).not.toContain('collages');
    expect(TARIFFS.planViz.featureKeys).not.toContain('lighting');
    expect(TARIFFS.planning.featureKeys).not.toContain('roomVisualizations');
  });

  it('includes the complete working set in the appropriate packages', () => {
    for (const id of ['drawings', 'collages', 'full'] as const) {
      expect(TARIFFS[id].featureKeys).toEqual(
        expect.arrayContaining([
          'demolition',
          'partitions',
          'finalPlan',
          'furniturePlan',
          'plumbing',
          'flooring',
          'underfloorHeating',
          'ceilings',
          'lighting',
          'switches',
          'sockets',
          'wallFinishes',
          'elevations',
        ]),
      );
    }
    expect(TARIFFS.drawings.featureKeys).not.toContain('collages');
    expect(TARIFFS.collages.featureKeys).toContain('detailedSpec');
    expect(TARIFFS.full.featureKeys).toContain('mainRoomVisualizations');
  });

  it('leaves unconfirmed electrical and consultation scopes unspecified', () => {
    expect(TARIFFS.electric.featureKeys).toEqual([]);
    expect(TARIFFS.consultation.featureKeys).toEqual([]);
    expect(TARIFFS.consultation.rates).toBeNull();
  });
});
