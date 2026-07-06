// types.ts — CONTRATO CONGELADO del diccionario de la página de perfil.
// Otros agentes pueblan he.ts/ru.ts y construyen componentes contra esta forma.
// No cambiar la forma sin coordinar: es el contrato de todos.

export type Locale = 'he' | 'ru';

export interface ProfileDict {
  meta: { title: string; description: string };
  topbar: { langSwitchLabel: string; langSwitchHref: string };
  header: {
    name: string;
    role: string;
    yearsExp: string;
    stats: { price: string; priceNote: string; reviewsCount: string; responseNote: string };
    /** Label "próxima disponibilidad" del header compacto móvil (chip clickeable al lado). */
    nextAvailabilityLabel: string;
  };
  video: { sectionAriaLabel: string; playLabel: string; iframeTitle: string };
  about: { tabs: { id: string; label: string; paragraphs: string[] }[]; readMore: string; readLess: string };
  qualifications: { title: string; degreeBadges: string[]; approachesTitle: string; approaches: string[] };
  generalInfo: { title: string; rows: { icon: string; label: string; value: string }[] };
  experience: {
    title: string;
    items: {
      id: string;
      title: string;
      body: string[];
      thumbs?: { src: string; full: string; alt: string }[];
    }[];
  };
  schedule: {
    title: string;
    honestyNote: string;
    timezoneNote: string;
    /** Nota de modalidad dentro de la card ("Online, terapia individual"). */
    modalityNote: string;
    slotAriaLabel: string;
    noJsFallback: string;
    calendarLinkLabel: string;
    sectionLabelEvening: string;
    sectionLabelDay: string;
    todayLabel: string;
    tomorrowLabel: string;
    nextAvailabilityLabel: string;
    /** Label del botón de reserva ANTES de elegir un slot (deshabilitado). */
    chooseSlotCta: string;
    /** Label del botón de reserva TRAS elegir un slot (habilitado). */
    reserveCta: string;
    /** Título del header del modal de confirmación de reserva. */
    bookingModalTitle: string;
    /** aria-label del botón X que cierra el modal de reserva. */
    closeLabel: string;
    /** Etiqueta de la fila "Fecha" en el modal. */
    dateLabel: string;
    /** Etiqueta de la fila "Hora" en el modal. */
    timeLabel: string;
    /** Etiqueta de la fila "Tipo de terapia" en el modal. */
    typeLabel: string;
    /** Valor de la fila "Tipo de terapia" (ej. "Individual"). */
    typeValue: string;
    /** Etiqueta de la fila "Formato" en el modal. */
    formatLabel: string;
    /** Valor de la fila "Formato" (ej. "Online"). */
    formatValue: string;
    /** Etiqueta de la fila de precio (debe dejar claro que es la PRIMERA sesión). */
    priceLabel: string;
    /** Label del CTA de WhatsApp dentro del modal ("Confirmar en WhatsApp"). */
    confirmWhatsApp: string;
    /** Declaración del paciente en el modal de reserva — textos LEGALES textuales
        del booking de producción (Web 1.0): título, 4 ítems y label del checkbox
        que habilita el CTA. NO parafrasear. */
    consentTitle: string;
    consentItems: string[];
    consentAcceptLabel: string;
  };
  reviews: {
    title: string;
    topics: string[];
    /** Texto del botón que abre el modal, SIN el número. El componente agrega " (N)" con items.length. */
    allLabel: string;
    /** Título del header del modal con todas las reseñas. */
    modalTitle: string;
    /** aria-label del botón X que cierra el modal ("Cerrar" por locale). */
    closeLabel: string;
    /** Microcopy gris bajo el botón (total de reseñas reales). */
    allNote: string;
    items: { author: string; location: string; rating: number; text: string }[];
  };
  verified: { title: string; checks: string[] };
  faq: {
    title: string;
    groups: { id: string; icon: string; title: string; items: { q: string; a: string }[] }[];
  };
  sticky: {
    priceLine: string;
    yearsLine: string;
    /** CTA primario azul → #schedule ("Reservar sesión", como Clearly). */
    ctaBook: string;
    /** CTA secundario outline → WhatsApp con logo ("Contactar", como Clearly). */
    ctaContact: string;
    nextAvailabilityLabel: string;
  };
  mobileBar: { ctaBook: string; ctaContact: string };
  footer: {
    nav: { heading: string; links: { label: string; href: string }[] };
    line: string;
  };
  waMessages: { general: string; priceInquiry: string; bookSlot: string }; // bookSlot con placeholder {slot}
  jsonLd: { personDescription: string; offerName: string };
}
