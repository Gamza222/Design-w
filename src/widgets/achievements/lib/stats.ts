import type { ComponentType, SVGProps } from 'react';

import { IconClock, IconFolderCheck, IconMapPin, IconStar } from '@shared/ui';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/** Иконки цифр-достижений — по порядку i18n `home.achievements.stats`
 *  (проекты, опыт, города, рейтинг). */
export const STAT_ICONS: IconType[] = [IconFolderCheck, IconClock, IconMapPin, IconStar];
