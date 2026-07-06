// index.ts — selector de diccionario por locale.
import type { Locale, ProfileDict } from './types';
import { he } from './he';
import { ru } from './ru';

export type { Locale, ProfileDict };

export const getDict = (locale: Locale): ProfileDict => (locale === 'he' ? he : ru);
