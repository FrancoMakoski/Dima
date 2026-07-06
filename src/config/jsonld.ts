// jsonld.ts — helper para el schema.org Person del perfil. Centralizado acá
// para que TODAS las páginas de perfil (ru ahora, he después) lo hereden sin
// duplicar la forma del objeto. Cero strings hardcodeados de copy: todo sale
// del dict (ProfileDict) + config/site.ts.
import { SITE_URL, PRICE_FIRST_SESSION, PRICE_CURRENCY } from './site';
import type { ProfileDict, Locale } from '../i18n/types';

/** Construye el JSON-LD Person (+ Offer de la primera sesión) para el perfil. */
export function buildPersonSchema(t: ProfileDict, locale: Locale) {
  const path = locale === 'he' ? '/' : '/ru/';
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: t.header.name,
    jobTitle: t.header.role,
    description: t.jsonLd.personDescription,
    image: new URL('/assets/img/dmitry-photo2-880.webp', SITE_URL).href,
    url: new URL(path, SITE_URL).href,
    knowsLanguage: ['ru', 'he'],
    makesOffer: {
      '@type': 'Offer',
      name: t.jsonLd.offerName,
      price: PRICE_FIRST_SESSION,
      priceCurrency: PRICE_CURRENCY,
    },
  };
}
