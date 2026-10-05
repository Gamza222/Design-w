import { MAIN_PACKAGE_IDS } from './tariffs';
import type { Package } from './types';

export const PACKAGES: Package[] = MAIN_PACKAGE_IDS.map((id) => ({ id, popular: id === 'full' }));

/** Three representative packages keep the first screen compact; all five appear below. */
export const HOME_PACKAGES = PACKAGES.filter(({ id }) =>
  ['planning', 'collages', 'full'].includes(id),
);
