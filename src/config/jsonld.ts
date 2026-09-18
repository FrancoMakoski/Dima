// jsonld.ts — helper para el schema.org Person del perfil. Centralizado acá
// para que TODAS las páginas de perfil (ru ahora, he después) lo hereden sin
// duplicar la forma del objeto. Cero strings hardcodeados de copy: todo sale
// del dict (ProfileDict) + config/site.ts.
//
// Paridad con producción (..\Web 1.0): el sitio viejo emite un ProfessionalService
// con areaServed / availableLanguage / contactPoint (WhatsApp). Acá la entidad es
// una página de PERFIL, así que la entidad raíz correcta es Person, enriquecida con
// esas mismas señales de contacto/alcance/idioma para no perder autoridad al migrar.
// NO se portan términos prohibidos (nada de "psicólogo"/"hipnosis"): jobTitle y
// description salen del dict, ya saneados por locale.
import {
  SITE_URL,
  PHONE,
  PHONE_E164,
  EMAIL,
  PRICE_FIRST_SESSION,
  PRICE_CURRENCY,
  PROFILE_IMAGE,
} from './site';
import type { ProfileDict, Locale } from '../i18n/types';

/** Construye ProfilePage con Person como mainEntity y la oferta visible de primera sesión. */
export function buildPersonSchema(t: ProfileDict, locale: Locale) {
  const path = locale === 'he' ? '/' : '/ru/';
  // availableLanguage con el idioma actual primero (señal de relevancia por locale).
  const languages = locale === 'he' ? ['Hebrew', 'Russian'] : ['Russian', 'Hebrew'];
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: new URL(path, SITE_URL).href,
    name: t.meta.title,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#dmitriy-kazakov`,
      name: t.header.name,
      jobTitle: t.header.role,
      description: t.jsonLd.personDescription,
      image: new URL(PROFILE_IMAGE, SITE_URL).href,
      url: new URL(path, SITE_URL).href,
      email: EMAIL,
      telephone: PHONE_E164,
      // Perfil de WhatsApp como identidad social/canal de contacto (igual que producción).
      sameAs: [`https://wa.me/${PHONE}`],
      knowsLanguage: ['ru', 'he'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'appointments',
        telephone: PHONE_E164,
        email: EMAIL,
        availableLanguage: languages,
        url: `https://wa.me/${PHONE}`,
      },
      makesOffer: {
        '@type': 'Offer',
        name: t.jsonLd.offerName,
        price: PRICE_FIRST_SESSION,
        priceCurrency: PRICE_CURRENCY,
      },
    },
  };
}
