import type { ComponentType, SVGProps } from 'react';

import { IconClock, IconContract, IconGlobe } from '@shared/ui';

export interface HeroBullet {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  labelKey: string;
}

// Буллеты под кнопками Hero. Иконка — компонент, текст — i18n-ключ.
export const HERO_BULLETS: HeroBullet[] = [
  { id: 'consult', icon: IconClock, labelKey: 'home.hero.bullets.consult' },
  { id: 'contract', icon: IconContract, labelKey: 'home.hero.bullets.contract' },
  { id: 'remote', icon: IconGlobe, labelKey: 'home.hero.bullets.remote' },
];
