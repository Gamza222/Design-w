import type { ComponentType, SVGProps } from 'react';

import { IconClipboardCheck, IconFolderCheck, IconGlobe, IconChat } from '@shared/ui';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export const STAT_ICONS: IconType[] = [IconFolderCheck, IconClipboardCheck, IconGlobe, IconChat];
