// availability.ts — módulo cliente compartido del ScheduleCard.
//
// Calcula los próximos 7 días desde "ahora" EN HORA DE ISRAEL, renderiza dentro
// del contenedor del ScheduleCard una fila de días (tabs) + chips de horario por
// franja (día/noche), donde cada chip es un <a> a wa.me con el slot precargado.
// Además rellena [data-next-availability] (span en la StickyCard de otro agente)
// con el primer slot disponible y des-oculta [data-availability-block].
//
// El script NO importa diccionarios: recibe todos los strings del componente vía
// data-attributes (JSON) leídos del propio contenedor.
//
// CONTRATOS con otros agentes:
//   #schedule                 → id del ScheduleCard (destino de los CTA "Reservar")
//   [data-next-availability]  → span a llenar con el primer slot ("Mañana, 20:00")
//   [data-availability-block] → contenedor a des-ocultar (quitar atributo hidden)

import { WEEKLY_AVAILABILITY, TIMEZONE, DAY_END_HOUR } from '../config/schedule';

/** Strings de i18n que el componente inyecta como JSON en un data-attribute. */
interface ScheduleStrings {
  sectionLabelDay: string;
  sectionLabelEvening: string;
  todayLabel: string;
  tomorrowLabel: string;
  slotAriaLabel: string;
  /** Mensaje de WhatsApp con placeholder {slot}. */
  bookSlotMessage: string;
}

export interface InitScheduleOptions {
  /** Contenedor vacío del ScheduleCard donde se renderiza todo. */
  container: HTMLElement;
  /** Teléfono en formato wa.me (sin '+'). */
  phone: string;
  /** 'ru' | 'he' — decide el locale de formato de fechas. */
  locale: 'ru' | 'he';
  strings: ScheduleStrings;
}

/** Un slot concreto en una fecha concreta. */
interface Slot {
  /** Date "muro" en hora de Israel proyectada a local (para formatear). */
  date: Date;
  hour: number;
  minute: number;
  /** true si la hora es de noche (>= DAY_END_HOUR). */
  evening: boolean;
}

/** Un día del carrusel con sus slots agrupados por franja. */
interface DayColumn {
  /** Fecha representativa (00:00 muro de ese día). */
  date: Date;
  daySlots: Slot[];
  eveningSlots: Slot[];
  /** offset desde hoy: 0 = hoy, 1 = mañana, ... */
  offset: number;
}

const localeTag = (locale: 'ru' | 'he'): string => (locale === 'ru' ? 'ru' : 'he-IL');

/**
 * Devuelve las partes año/mes/día/hora/minuto/weekday del instante `now`
 * proyectadas a la zona `TIMEZONE`. Trabajamos con estos números "muro" para no
 * depender de la zona del navegador del visitante.
 */
function israelNowParts(now: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
} {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const wdMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  let hour = parseInt(get('hour'), 10);
  if (hour === 24) hour = 0; // algunos motores devuelven '24' a medianoche
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    hour,
    minute: parseInt(get('minute'), 10),
    weekday: wdMap[get('weekday')] ?? 0,
  };
}

/**
 * Construye las columnas de los próximos 7 días. Usa fechas "muro" de Israel:
 * a partir de la fecha civil de hoy en Israel, avanza día a día con aritmética
 * de calendario local (new Date(y, m, d)) — suficiente para agrupar y formatear,
 * ya que el formateo posterior no vuelve a convertir de zona.
 */
function buildDays(now: Date, strings: ScheduleStrings): DayColumn[] {
  const p = israelNowParts(now);
  const slotsByWeekday = new Map<number, string[]>();
  for (const d of WEEKLY_AVAILABILITY) slotsByWeekday.set(d.weekday, d.slots);

  const columns: DayColumn[] = [];
  // Fecha base = hoy en Israel a las 00:00 (como Date local del navegador,
  // que solo usamos como portadora de año/mes/día para formatear).
  const base = new Date(p.year, p.month - 1, p.day);

  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
    const weekday = d.getDay();
    const rawSlots = slotsByWeekday.get(weekday) ?? [];
    if (rawSlots.length === 0) continue;

    const daySlots: Slot[] = [];
    const eveningSlots: Slot[] = [];

    for (const s of rawSlots) {
      const [hh, mm] = s.split(':').map((n) => parseInt(n, 10));
      // Para HOY, descartar horas ya pasadas (comparando con la hora muro de Israel).
      if (offset === 0) {
        if (hh < p.hour || (hh === p.hour && mm <= p.minute)) continue;
      }
      const slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm);
      const slot: Slot = { date: slotDate, hour: hh, minute: mm, evening: hh >= DAY_END_HOUR };
      (slot.evening ? eveningSlots : daySlots).push(slot);
    }

    if (daySlots.length === 0 && eveningSlots.length === 0) continue;
    columns.push({ date: d, daySlots, eveningSlots, offset });
  }

  return columns;
}

/** "вт, 8 июля" / weekday+día+mes para la tab del día. */
function formatDayTab(col: DayColumn, locale: 'ru' | 'he', strings: ScheduleStrings): string {
  if (col.offset === 0) return strings.todayLabel;
  if (col.offset === 1) return strings.tomorrowLabel;
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(col.date);
}

/** Solo la hora del chip: "20:00". */
function formatSlotTime(slot: Slot, locale: 'ru' | 'he'): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(slot.date);
}

/** Slot completo para el mensaje de WhatsApp: weekday + día + mes + hora. */
function formatSlotFull(slot: Slot, locale: 'ru' | 'he'): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(slot.date);
}

/** Etiqueta corta para [data-next-availability]: "Mañana, 20:00" / "Сегодня, 20:00". */
function formatNextShort(
  col: DayColumn,
  slot: Slot,
  locale: 'ru' | 'he',
  strings: ScheduleStrings,
): string {
  const time = formatSlotTime(slot, locale);
  let dayLabel: string;
  if (col.offset === 0) dayLabel = strings.todayLabel;
  else if (col.offset === 1) dayLabel = strings.tomorrowLabel;
  else
    dayLabel = new Intl.DateTimeFormat(localeTag(locale), {
      weekday: 'long',
    }).format(col.date);
  return `${dayLabel}, ${time}`;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

const CHEVRON = (dir: 'left' | 'right') =>
  `<svg width="18" height="18" aria-hidden="true" class="flip-rtl"><use href="/assets/img/profile-icons.svg#chevron-${dir}"></use></svg>`;

/** Punto de entrada: renderiza el schedule y llena el contrato de next-availability. */
export function initSchedule(opts: InitScheduleOptions): void {
  const { container, phone, locale, strings } = opts;
  const now = new Date();
  const days = buildDays(now, strings);

  if (days.length === 0) {
    // Sin disponibilidad calculable: dejamos el <noscript>/fallback server. No rompemos.
    return;
  }

  const waLink = (fullSlot: string): string =>
    `https://wa.me/${phone}?text=${encodeURIComponent(strings.bookSlotMessage.replace('{slot}', fullSlot))}`;

  // ---- Estructura ----
  const root = el('div', 'sched');

  // Fila de días con flechas prev/next.
  const daysRow = el('div', 'sched-days');
  const prevBtn = el('button', 'sched-arrow');
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'prev');
  prevBtn.innerHTML = CHEVRON('left');

  const daysTrack = el('div', 'sched-days-track');
  daysTrack.setAttribute('role', 'tablist');
  daysTrack.setAttribute('aria-label', strings.slotAriaLabel);

  const nextBtn = el('button', 'sched-arrow');
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'next');
  nextBtn.innerHTML = CHEVRON('right');

  daysRow.append(prevBtn, daysTrack, nextBtn);

  // Panel de slots (uno por día, se muestra el activo).
  const panels = el('div', 'sched-panels');

  const dayButtons: HTMLButtonElement[] = [];
  const dayPanels: HTMLElement[] = [];

  days.forEach((col, i) => {
    const tab = el('button', 'sched-day');
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.id = `sched-day-${i}`;
    tab.setAttribute('aria-controls', `sched-panel-${i}`);
    tab.textContent = formatDayTab(col, locale, strings);
    dayButtons.push(tab);
    daysTrack.appendChild(tab);

    const panel = el('div', 'sched-panel');
    panel.id = `sched-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `sched-day-${i}`);

    const addSection = (label: string, slots: Slot[]) => {
      if (slots.length === 0) return;
      const sec = el('div', 'sched-section');
      const h = el('span', 'sched-section-label');
      h.textContent = label;
      const chips = el('div', 'sched-chips');
      for (const slot of slots) {
        const a = el('a', 'sched-chip');
        a.href = waLink(formatSlotFull(slot, locale));
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = formatSlotTime(slot, locale);
        a.setAttribute('data-track', 'whatsapp_click');
        a.setAttribute('data-track-label', 'schedule_chip');
        a.setAttribute('data-conversion-whatsapp', '');
        chips.appendChild(a);
      }
      sec.append(h, chips);
      panel.appendChild(sec);
    };

    addSection(strings.sectionLabelDay, col.daySlots);
    addSection(strings.sectionLabelEvening, col.eveningSlots);

    dayPanels.push(panel);
    panels.appendChild(panel);
  });

  const activate = (idx: number) => {
    dayButtons.forEach((b, i) => {
      const on = i === idx;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle('is-active', on);
    });
    dayPanels.forEach((p, i) => {
      p.hidden = i !== idx;
    });
    // Trae la tab activa a la vista dentro del carrusel horizontal.
    dayButtons[idx]?.scrollIntoView({ inline: 'center', block: 'nearest' });
  };

  // Día activo por defecto = primer día con slots (siempre es days[0] acá).
  let active = 0;

  dayButtons.forEach((b, i) => {
    b.addEventListener('click', () => {
      active = i;
      activate(active);
    });
    b.addEventListener('keydown', (e) => {
      const rtl = document.dir === 'rtl';
      let next = -1;
      if (e.key === 'ArrowRight') next = rtl ? i - 1 : i + 1;
      else if (e.key === 'ArrowLeft') next = rtl ? i + 1 : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = dayButtons.length - 1;
      if (next < 0 || next >= dayButtons.length) return;
      e.preventDefault();
      active = next;
      activate(active);
      dayButtons[active].focus();
    });
  });

  const scrollDays = (dir: 1 | -1) => {
    const rtl = document.dir === 'rtl';
    daysTrack.scrollBy({ left: dir * (rtl ? -1 : 1) * 160, behavior: 'smooth' });
  };
  prevBtn.addEventListener('click', () => scrollDays(-1));
  nextBtn.addEventListener('click', () => scrollDays(1));

  root.append(daysRow, panels);
  container.innerHTML = '';
  container.appendChild(root);
  activate(active);

  // ---- Contrato: primer slot disponible → StickyCard ----
  const firstCol = days[0];
  const firstSlot = firstCol.daySlots[0] ?? firstCol.eveningSlots[0] ?? null;
  if (firstSlot) {
    const short = formatNextShort(firstCol, firstSlot, locale, strings);
    // El span [data-next-availability] arranca con hidden (contrato StickyCard):
    // escribir el texto y quitarle el hidden a él y al bloque contenedor.
    document.querySelectorAll<HTMLElement>('[data-next-availability]').forEach((span) => {
      span.textContent = short;
      span.hidden = false;
      span.removeAttribute('hidden');
    });
    document.querySelectorAll<HTMLElement>('[data-availability-block]').forEach((block) => {
      block.hidden = false;
      block.removeAttribute('hidden');
    });
  }
  // Si no hay firstSlot, no tocamos ninguno de los dos (quedan ocultos).
}
