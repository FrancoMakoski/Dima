// schedule.ts — Disponibilidad semanal de Dima, EDITABLE por Franco.
//
// Cada entrada es un día de la semana (0 = domingo ... 6 = sábado) con las
// franjas horarias que se ofrecen ese día, en formato 'HH:MM' (hora de Israel).
// El ScheduleCard toma los próximos 7 días desde "ahora" y muestra solo los
// slots que caen en estos días; para el día de hoy descarta las horas ya pasadas.
//
// PARA CAMBIAR HORARIOS: editá los arrays `slots` de abajo. Nada más que tocar.
//   - Formato de cada slot: 'HH:MM' en 24 h, hora de Israel.
//   - Si un día no aparece o tiene slots: [] → no se ofrece ese día (ej. sábado/shabat).
//   - El label día/noche de cada chip se decide por la hora (ver DAY_END_HOUR).

export interface DayAvailability {
  /** 0 = domingo, 1 = lunes, ... 6 = sábado */
  weekday: number;
  /** Franjas 'HH:MM' (hora de Israel) ofrecidas ese día. */
  slots: string[];
}

/**
 * Disponibilidad por defecto para Israel:
 *   - Domingo a jueves: franja de día (10:00, 12:00) + franja de noche (20:00, 21:00).
 *   - Viernes: solo mañana (10:00) — víspera de shabat.
 *   - Sábado (shabat): sin atención.
 */
export const WEEKLY_AVAILABILITY: DayAvailability[] = [
  { weekday: 0, slots: ['10:00', '12:00', '20:00', '21:00'] }, // domingo
  { weekday: 1, slots: ['10:00', '12:00', '20:00', '21:00'] }, // lunes
  { weekday: 2, slots: ['10:00', '12:00', '20:00', '21:00'] }, // martes
  { weekday: 3, slots: ['10:00', '12:00', '20:00', '21:00'] }, // miércoles
  { weekday: 4, slots: ['10:00', '12:00', '20:00', '21:00'] }, // jueves
  { weekday: 5, slots: ['10:00'] },                            // viernes (víspera shabat)
  { weekday: 6, slots: [] },                                   // sábado (shabat) — nada
];

/** Zona horaria de referencia para todo el cálculo de horarios. */
export const TIMEZONE = 'Asia/Jerusalem' as const;

/**
 * Hora (0-23) a partir de la cual un slot se considera "noche".
 * Slots con hora < DAY_END_HOUR → sección día; >= → sección noche.
 */
export const DAY_END_HOUR = 17 as const;
