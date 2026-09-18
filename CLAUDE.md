# CLAUDE.md — DimaTherapy 3.0

Sitio web **3.0 de DimaTherapy** (Dima Kazakov, terapeuta en Israel): rebuild total desde cero,
decidido por Franco el 6-jul-2026 y publicado el 18-sep-2026. Esta carpeta es la fuente
canónica (commit publicado `46d3d71`); `..\Web 1.0` contiene el artefacto servido por
GitHub/Hostinger (`128bcb1`). La 2.2 quedó como referencia nunca publicada.

El roadmap completo vive en [PLAN-WEB-3.0.md](PLAN-WEB-3.0.md). Leerlo antes de tocar nada.

## Reglas de copy NO negociables (valen para TODO el sitio, he + ru)

1. **NUNCA** usar las palabras "hipnosis" ni "psicólogo" en copy público (tabú en Israel /
   Dima no es psicólogo colegiado). Tampoco equivalentes en hebreo/ruso.
2. La oferta gratuita es **"llamada inicial de orientación, sin costo"**. NUNCA mencionar
   duración (ni "sin apuro", ni "15 minutos", nada de tiempo).
3. **Precio de la primera sesión visible** (decisión de Franco, 6-jul-2026): **197 ₪** SÍ se
   muestra en la página de perfil (header de stats y tarjeta lateral) y donde el diseño lo
   pida. El resto de precios (sesiones siguientes, paquetes) sigue **sin mostrarse** → link
   "consultar precio" que abre wa.me precargado. Excepciones legales que se mantienen: el
   "100 ₪" legal en terms y el `price: 0` del JSON-LD de la llamada gratis. El JSON-LD del
   perfil ahora puede llevar un `Offer` de 197 ILS para la primera sesión.
4. **WhatsApp es el CTA primario** en todo el sitio, siempre con el evento consentido
   `whatsapp_click` de GA4. No cargar Google Ads ni enviar el texto o href del mensaje.
5. **NO mencionar a V.Yu. Makulov ni "el método Makulov"** en ningún copy público, en ningún
   idioma (decisión Franco 6-jul-2026). La formación de 120h se describe por institución,
   horas y año (Instituto Internacional de Psicología Práctica, Moscú, 2018) sin nombrar
   el método.

## Stack y estructura

### Pedidos de Dima del 4-ago-2026, publicados el 18-sep

- Usar su teléfono **+972 52-640-7881**, confirmado en WhatsApp; se define en `src/config/site.ts`.
- Usar el retrato anterior de fondo claro (`PROFILE_IMAGE` en la misma configuración).
- No ofrecer las tarjetas de paquetes de 2.190 / 3.490 ₪ ni programas fijos de 3–5 sesiones.
- La reserva del selector solicita una sesión; no debe presentarla como la llamada gratuita.
- Contexto, evidencia y publicación confirmada: `..\PLAN-DE-TRABAJO-2026-09-18.md`.

- **Astro 5**, salida 100 % estática (`build.format: 'file'` → `booking.html`, etc.).
- i18n nativo: **hebreo (RTL) en la raíz**, **ruso bajo `/ru/`** — una sola fuente de
  componentes, nada de mantener espejos HTML a mano como en el sitio viejo.
- Las **URLs deben ser idénticas** a las de producción (mapa en el plan) para no perder SEO.
- Comandos: `npm run dev` (localhost:4321), `npm run build` (genera `dist/`).

### Medición y privacidad

- Fuente única: **GA4 `G-JXBHPTBC5V`**. No cargar GTM ni destinos `AW-*` desde el sitio.
- GA4 se carga solo en `https://dimatherapyonline.com` (incluido `www`) y únicamente después
  del opt-in guardado en `dima_analytics_consent`. Rechazar no bloquea ninguna función.
- `src/scripts/track.ts` usa nombres y parámetros cerrados. Nunca enviar query strings,
  mensajes de WhatsApp, hrefs, síntomas, fechas/horas elegidas ni texto libre.
- En la propiedad GA4, **Enhanced measurement debe permanecer desactivado** para impedir que
  el evento automático de clic saliente capture el `link_url` completo de WhatsApp.
- Enhanced Measurement fue desactivado el 18-sep y se verificó el interruptor en OFF.
- GA4 y Search Console están vinculados; Analytics Data API y Search Console API están
  habilitadas en `dimatherapy-medicion`. El cliente OAuth desktop `DimaTherapy Medicion Local`
  está autorizado como `kadimaclinic@gmail.com` con solo lectura; el scope canónico de email
  fue corregido y 8 pruebas pasan. La aplicación OAuth sigue en Testing: el refresh token puede
  expirar a los 7 días hasta que Franco decida pasarla a Production o reautorizarla al vencer.
- `..\Integraciones\medicion\actualizar-informe.ps1` fue probado contra las APIs reales y
  regenera los reportes JSON y Markdown de solo lectura.
- Verificación: `npm run build`, `node scripts/verify-build.mjs` y
  `node scripts/test-tracking.mjs`.

## Deploy

El hosting NO cambia: mismo dominio, mismo Hostinger, mismo repo de publicación (`..\Web 1.0`).
Actualizar producción = ejecutar `scripts\prepare-release.ps1`, revisar el diff generado en
`..\Web 1.0` y recién entonces usar `push-dima.bat`.

**Requisito Hostinger:** conservar siempre `..\Web 1.0\package.json`. El primer commit de
migración fue `fd10f813`; Hostinger completó el deploy después de restaurar ese manifiesto en
`c651ab16`. El script de preparación ya lo preserva. Evidencia del release:
`..\Verificaciones\2026-09-18-220800-migracion-3.0\`.

Producción actual es `128bcb1`, que corrige el ErrorDocument a `/404.html`. Mantener la misma
línea en `public/.htaccess`; la corrección se conserva también en la fuente.
La verificación pública final pasó 7 páginas, 26 recursos, 6 redirects y 4 rutas protegidas:
`..\Verificaciones\2026-09-18-201745-verificacion-publica-3.0.json`.
Search Console aceptó `sitemap.xml`; las portadas `/` y `/ru/` ya están indexadas y ambas
solicitudes de reindexación fueron confirmadas y quedaron en la cola prioritaria de rastreo.

## Idioma de trabajo

Español (Misiones) para todo lo interno; el sitio es hebreo + ruso.
