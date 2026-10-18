import type { ComponentType, SVGProps } from 'react';

import { IconArmchair, IconFolderCheck, IconLayout, IconRuler } from '@shared/ui';

export interface HeroBenefit {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  titleKey: string;
  descKey: string;
}

// Пункты панели «Что вы получите». Иконка — компонент, тексты — i18n-ключи.
export const HERO_BENEFITS: HeroBenefit[] = [
  {
    id: 'planning',
    icon: IconLayout,
    titleKey: 'home.hero.benefits.planning.title',
    descKey: 'home.hero.benefits.planning.desc',
  },
  {
    id: 'concept',
    icon: IconArmchair,
    titleKey: 'home.hero.benefits.concept.title',
    descKey: 'home.hero.benefits.concept.desc',
  },
  {
    id: 'sketches',
    icon: IconRuler,
    titleKey: 'home.hero.benefits.sketches.title',
    descKey: 'home.hero.benefits.sketches.desc',
  },
  {
    id: 'support',
    icon: IconFolderCheck,
    titleKey: 'home.hero.benefits.support.title',
    descKey: 'home.hero.benefits.support.desc',
  },
];
