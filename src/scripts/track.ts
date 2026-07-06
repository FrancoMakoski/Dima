// track.ts — tracking de clicks por data-attribute, port del patrón de
// ..\Web 2.0\assets\js\site.js (sección 5, ~líneas 219-238).
//
// <a data-track="whatsapp_click" data-track-label="hero_cta">...</a>
// -> window.dataLayer.push({ event, label })
//
// Si el elemento (o su ancestro con [data-track]) lleva data-conversion-whatsapp,
// o si el propio data-track es "whatsapp_click", también dispara la conversión
// de Google Ads vía gtag (igual que fireAdsConversion en site.js).
//
// PROHIBIDO: ningún fetch a APIs locales — el server Express de la 1.0/2.0 no
// se migra a la 3.0.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Label de conversión de Google Ads para el lead de WhatsApp. */
const WHATSAPP_CONVERSION_LABEL = 'AW-18096499266/PLACEHOLDER_WHATSAPP';

let initialized = false;

function pushTrackEvent(name: string, label: string): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, label });
}

function fireWhatsappConversion(): void {
  if (WHATSAPP_CONVERSION_LABEL.indexOf('PLACEHOLDER') !== -1) return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: WHATSAPP_CONVERSION_LABEL });
  }
}

function handleClick(event: MouseEvent): void {
  const target = event.target as Element | null;
  if (!target) return;

  const tracked = target.closest<HTMLElement>('[data-track]');
  const whatsappEl = target.closest<HTMLElement>('[data-conversion-whatsapp]');

  if (tracked) {
    const trackName = tracked.getAttribute('data-track') || '';
    const trackLabel = tracked.getAttribute('data-track-label') || window.location.pathname;
    pushTrackEvent(trackName, trackLabel);
  }

  const isWhatsapp =
    !!whatsappEl || (tracked && tracked.getAttribute('data-track') === 'whatsapp_click');

  if (isWhatsapp) {
    fireWhatsappConversion();
  }
}

/** Idempotente: llamar varias veces no duplica el listener. */
export function initTracking(): void {
  if (initialized) return;
  initialized = true;
  document.addEventListener('click', handleClick);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
}
