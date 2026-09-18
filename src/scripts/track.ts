// track.ts — eventos de interacción del sitio 3.0.
//
// Los data-attributes existentes se normalizan a un vocabulario estable. Ningún
// texto libre, mensaje de WhatsApp, síntoma, fecha u horario se envía a Google.
// Los nombres viejos de CTA se aceptan como entrada para no acoplar medición y UI.
//
// PROHIBIDO: ningún fetch a APIs locales — el server Express de la 1.0/2.0 no
// se migra a la 3.0.

declare global {
  interface Window {
    __dimaTrackingEnabled?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

type EventName =
  | 'booking_calendar_open'
  | 'booking_intent'
  | 'booking_slot_select'
  | 'calendar_open'
  | 'credential_open'
  | 'language_switch'
  | 'reviews_open'
  | 'whatsapp_click';

type EventParams = {
  cta_location: string;
  page_language: 'he' | 'ru' | 'other';
  booking_method?: 'calendar' | 'whatsapp';
  contact_intent?: 'booking' | 'general';
};

// Lista cerrada: si un componente introduce un label dinámico, no sale del navegador.
const SAFE_LOCATIONS: Readonly<Record<string, string>> = {
  availability_chip: 'availability',
  booking_he: 'booking_page',
  booking_help_he: 'booking_help',
  booking_help_ru: 'booking_help',
  booking_modal: 'booking_modal',
  booking_ru: 'booking_page',
  credentials_he: 'credentials',
  credentials_ru: 'credentials',
  mobilebar_contact: 'mobile_bar',
  mobilebar_reserve: 'mobile_bar',
  reviews_modal: 'reviews',
  schedule: 'schedule',
  schedule_calendar_link: 'schedule',
  sticky_contact: 'sticky_card',
  sticky_reserve: 'sticky_card',
};

function trackingEnabled(): boolean {
  return window.__dimaTrackingEnabled === true && typeof window.gtag === 'function';
}

function pageLanguage(): EventParams['page_language'] {
  const lang = document.documentElement.lang.toLowerCase();
  if (lang === 'he' || lang === 'ru') return lang;
  return 'other';
}

function safeLocation(rawLabel: string): string {
  return SAFE_LOCATIONS[rawLabel] || 'other';
}

function sendEvent(name: EventName, params: EventParams): void {
  if (!trackingEnabled()) return;
  window.gtag?.('event', name, params);
}

function isRealWhatsappLink(element: HTMLElement | null): element is HTMLAnchorElement {
  const link = element instanceof HTMLAnchorElement ? element : element?.closest('a');
  if (!link || link.getAttribute('aria-disabled') === 'true' || !link.href) return false;

  try {
    const url = new URL(link.href);
    return url.protocol === 'https:' && (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com');
  } catch {
    return false;
  }
}

function normalizedEvent(rawName: string, rawLabel: string): { name: EventName; params: EventParams } | null {
  const ctaLocation = safeLocation(rawLabel);
  const common: EventParams = {
    cta_location: ctaLocation,
    page_language: pageLanguage(),
  };

  switch (rawName) {
    case 'whatsapp_click':
      return {
        name: 'whatsapp_click',
        params: ctaLocation === 'booking_modal'
          ? { ...common, booking_method: 'whatsapp', contact_intent: 'booking' }
          : { ...common, contact_intent: 'general' },
      };
    case 'schedule_slot_select':
    case 'booking_slot_select':
      // data-track-label contiene la fecha/hora elegida: se descarta expresamente.
      return { name: 'booking_slot_select', params: { ...common, cta_location: 'schedule' } };
    case 'free_call_cta_click':
    case 'booking_intent':
      // Nombre heredado: los CTA actuales reservan una sesión, no una llamada gratis.
      if (rawLabel === 'schedule_calendar_link') {
        return { name: 'calendar_open', params: { ...common, booking_method: 'calendar' } };
      }
      return { name: 'booking_intent', params: common };
    case 'calendar_open':
      return { name: 'calendar_open', params: { ...common, booking_method: 'calendar' } };
    case 'calendar_external_open':
      return {
        name: 'calendar_open',
        params: { ...common, cta_location: 'booking_page', booking_method: 'calendar' },
      };
    case 'booking_terms_accepted':
      // El texto de las condiciones y el locale del label no se envían.
      return { name: 'booking_calendar_open', params: { ...common, cta_location: 'booking_page' } };
    case 'credential_open':
      // No se envía el href ni el nombre del documento abierto.
      return { name: 'credential_open', params: { ...common, cta_location: 'credentials' } };
    case 'credentials_booking':
      return { name: 'booking_intent', params: { ...common, cta_location: 'credentials' } };
    case 'reviews_open':
      return { name: 'reviews_open', params: common };
    case 'lang_switch':
      return { name: 'language_switch', params: { ...common, cta_location: 'top_bar' } };
    default:
      return null;
  }
}

function handleClick(event: MouseEvent): void {
  const target = event.target as Element | null;
  if (!target) return;

  const tracked = target.closest<HTMLElement>('[data-track]');

  if (tracked) {
    const normalized = normalizedEvent(
      tracked.getAttribute('data-track') || '',
      tracked.getAttribute('data-track-label') || '',
    );
    if (normalized && (normalized.name !== 'whatsapp_click' || isRealWhatsappLink(tracked))) {
      sendEvent(normalized.name, normalized.params);
    }
  }
}

/** Idempotente: llamar varias veces no duplica el listener. */
export function initTracking(): void {
  if (initialized || !trackingEnabled()) return;
  initialized = true;
  document.addEventListener('click', handleClick);
}

if (typeof document !== 'undefined') {
  document.addEventListener('dima:analytics-ready', initTracking);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
}
