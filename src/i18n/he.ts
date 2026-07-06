// he.ts — SKELETON hebreo. Placeholders neutros; otro agente los reemplaza con
// el copy real. Cumple la interface ProfileDict para que build + tipos pasen.
// Prohibido: "hipnosis"/"psicólogo" (ni equivalentes), duración de la llamada, Makulov.
import type { ProfileDict } from './types';

export const he: ProfileDict = {
  meta: { title: 'TODO title', description: 'TODO description' },
  topbar: { langSwitchLabel: 'Русский', langSwitchHref: '/ru/' },
  header: {
    name: 'TODO name',
    role: 'TODO role',
    yearsExp: 'TODO years',
    certLine: 'TODO cert',
    stats: {
      price: '197 ₪',
      priceNote: 'TODO price note',
      reviewsCount: 'TODO reviews count',
      responseNote: 'TODO response note',
    },
  },
  video: {
    sectionAriaLabel: 'TODO video section',
    playLabel: 'TODO play',
    iframeTitle: 'TODO iframe title',
  },
  about: {
    tabs: [
      { id: 'about', label: 'TODO tab 1', paragraphs: ['TODO paragraph.'] },
      { id: 'approach', label: 'TODO tab 2', paragraphs: ['TODO paragraph.'] },
      { id: 'values', label: 'TODO tab 3', paragraphs: ['TODO paragraph.'] },
    ],
    readMore: 'TODO read more',
    readLess: 'TODO read less',
  },
  qualifications: {
    title: 'TODO qualifications',
    degreeBadges: ['TODO badge'],
    approachesTitle: 'TODO approaches title',
    approaches: ['TODO approach'],
  },
  generalInfo: {
    title: 'TODO general info',
    rows: [{ icon: 'globe', label: 'TODO label', value: 'TODO value' }],
  },
  experience: {
    title: 'TODO experience',
    items: [{ id: 'exp-1', title: 'TODO item title', body: ['TODO body.'] }],
  },
  schedule: {
    title: 'TODO schedule',
    honestyNote: 'TODO honesty note',
    timezoneNote: 'TODO timezone',
    slotAriaLabel: 'TODO slot',
    noJsFallback: 'TODO no-js fallback',
    calendarLinkLabel: 'TODO calendar link',
    sectionLabelEvening: 'TODO evening',
    sectionLabelDay: 'TODO day',
    todayLabel: 'TODO today',
    tomorrowLabel: 'TODO tomorrow',
    nextAvailabilityLabel: 'TODO next availability',
  },
  reviews: {
    title: 'TODO reviews',
    topics: ['TODO topic'],
    allNote: 'TODO all note',
    items: [{ author: 'TODO author', location: 'TODO location', rating: 5, text: 'TODO review text.' }],
  },
  verified: { title: 'TODO verified', checks: ['TODO check'] },
  faq: {
    title: 'TODO faq',
    groups: [
      {
        id: 'faq-1',
        icon: 'help',
        title: 'TODO group title',
        items: [{ q: 'TODO question?', a: 'TODO answer.' }],
      },
    ],
  },
  sticky: {
    priceLine: 'TODO price line',
    yearsLine: 'TODO years line',
    ctaWhatsApp: 'TODO whatsapp',
    ctaFreeCall: 'TODO free call',
    nextAvailabilityLabel: 'TODO next availability',
  },
  mobileBar: { ctaWhatsApp: 'TODO whatsapp', ctaFreeCall: 'TODO free call' },
  footer: { line: 'TODO footer line', termsLabel: 'TODO terms', termsHref: '/terms' },
  waMessages: {
    general: 'TODO general message',
    priceInquiry: 'TODO price inquiry message',
    bookSlot: 'TODO book message {slot}',
  },
  jsonLd: { personDescription: 'TODO person description', offerName: 'TODO offer name' },
};
