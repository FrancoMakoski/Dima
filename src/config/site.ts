// site.ts — constantes de sitio y helpers. Fuente única de verdad para
// teléfono, links, precios e IDs de terceros. Los componentes deben importar
// de acá y nunca hardcodear estos valores.

/** Dominio de producción (encontrado en ..\Web 1.0\sitemap.xml y .htaccess). */
export const SITE_URL = 'https://dimatherapyonline.com' as const;

/** Teléfono en formato internacional sin '+' (para wa.me). */
export const PHONE = '972528056068' as const;

/**
 * Construye un link de WhatsApp con el mensaje precargado y URL-encodeado.
 * @example waLink('שלום, אני מעוניין') // https://wa.me/972528056068?text=...
 */
export function waLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

/** URL real del Appointment Schedule de Google (de ..\Web 1.0\booking.html). */
export const CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2mOewB_pF8UD84vTSanG86xKEQffKv_COHiapyrPk46Tli7EPs8Ki1co8Dl-UD4e1lCqN66wd7?gv=true' as const;

/** ID del video de presentación (YouTube). */
export const VIDEO_ID = 'xA8gP1GijxA' as const;

/** Google Tag Manager. */
export const GTM_ID = 'GTM-N56J29D8' as const;

/** Precio de la primera sesión (visible en el perfil, decisión Franco 6-jul-2026). */
export const PRICE_FIRST_SESSION = 197 as const;
export const PRICE_CURRENCY = 'ILS' as const;
export const PRICE_DISPLAY = '197 ₪' as const;
