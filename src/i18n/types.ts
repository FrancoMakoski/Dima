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
    slotAriaLabel: string;
    noJsFallback: string;
    calendarLinkLabel: string;
    sectionLabelEvening: string;
    sectionLabelDay: string;
    todayLabel: string;
    tomorrowLabel: string;
    nextAvailabilityLabel: string;
  };
  reviews: {
    title: string;
    topics: string[];
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
    ctaWhatsApp: string;
    ctaFreeCall: string;
    nextAvailabilityLabel: string;
  };
  mobileBar: { ctaWhatsApp: string; ctaFreeCall: string };
  footer: { line: string; termsLabel: string; termsHref: string };
  waMessages: { general: string; priceInquiry: string; bookSlot: string }; // bookSlot con placeholder {slot}
  jsonLd: { personDescription: string; offerName: string };
}
