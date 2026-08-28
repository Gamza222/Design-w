import { describe, expect, it } from 'vitest';

import { PACKAGES } from './packages';

describe('package contents', () => {
  it('keeps the entry packages aligned with the confirmed service scope', () => {
    expect(PACKAGES.find((pkg) => pkg.id === 'start')?.featureKeys).toEqual(['planning']);
    expect(PACKAGES.find((pkg) => pkg.id === 'comfort')?.featureKeys).toEqual([
      'planning',
      'collages',
    ]);
  });

  it('keeps the full project as the complete package', () => {
    expect(PACKAGES.find((pkg) => pkg.id === 'full')?.featureKeys).toEqual([
      'planning',
      'collages',
      'viz3d',
      'sketchPlans',
      'materials',
    ]);
  });
});
