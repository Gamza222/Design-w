import type { Locale } from '@shared/config';

export type LocalizedText = Record<Locale, string>;

export interface Service {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}
