# Plan Web 3.0 — DimaTherapy (rebuild desde cero)

**Fecha inicial:** 6-jul-2026 · **Estado 18-sep-2026:** 3.0 publicada. Hostinger confirmó
`Completed` y `Current`; producción actual `128bcb1`, fuente publicada `46d3d71`.

## La idea en una línea

Construir acá un sitio nuevo desde cero (diseño, código y estructura), manteniendo **el mismo
dominio, las mismas URLs y las mismas integraciones**, y cuando esté listo publicarlo por el
canal de deploy que ya funciona. "Migrar" no significa mover el hosting: significa que el día
del switch los archivos nuevos reemplazan a los viejos y nadie nota el cambio técnico — solo
el diseño nuevo.

## Decisiones tomadas (Franco puede vetar cualquiera)

| Decisión | Elegido | Por qué |
|---|---|---|
| Carpeta/proyecto | `DimaThereapy\Web 3.0`, repo git propio | Lo pidió Franco: las tres versiones juntas dentro de la carpeta DimaThereapy |
| Stack | **Astro 5**, salida estática | Componentes + i18n nativo = se acaba el CSS duplicado y los espejos he/ru a mano (la deuda #1 del sitio viejo). El build genera HTML plano → Hostinger no cambia nada |
| URLs | Idénticas a producción | No se pierde SEO, no hacen falta redirects 301 |
| Deploy | `scripts\prepare-release.ps1` → revisión de diff → `..\Web 1.0\push-dima.bat` | Build, verificación, respaldo y sincronización controlada antes del canal GitHub/Hostinger |
| Idiomas | Hebreo (RTL) en raíz, ruso en `/ru/` | Igual que producción |

## Qué se hereda del sitio viejo (obligatorio)

- **Reglas de copy** — ver CLAUDE.md: sin "hipnosis"/"psicólogo", llamada gratis sin duración,
  precios ocultos salvo la primera sesión (197 ₪), WhatsApp primario, sin mencionar a Makulov
  (decisión Franco 6-jul-2026).
- **Integraciones:** booking real con Google Calendar, GA4 bajo consentimiento y eventos
  normalizados de reserva/WhatsApp. El release no carga Google Ads ni Google Tag Manager.
- **SEO ya ganado:** schema/JSON-LD, sitemap con hreflang, htaccess (clean URLs, 404),
  imágenes optimizadas, meta descriptions.
- **Copy y aprendizajes 2.x:** aunque el diseño sea nuevo, el copy Hormozi de la rama
  `cro-hormozi` (ofertas, garantías, framing) está trabajado y validable — saquearlo, no
  reescribirlo de cero sin motivo.

## Qué NO se migra

- Ni una línea de HTML/CSS/JS del sitio viejo (se reescribe todo).
- El server Express local (`run.bat`) — `npm run dev` lo reemplaza.
- La duplicación manual he/ru.
- `admin.html` + token débil: eliminado del alcance público; no se migra.

## Fases

### Fase 0 — Fundaciones ✅ (hecho 6-jul-2026)
Carpeta, repo git, scaffold Astro con i18n he/ru, este plan, CLAUDE.md con reglas.

### Fase 1 — Diseño (la parte "3.0") ✅
1. Dirección visual de perfil tipo Clearly definida con Franco.
2. Sistema visual, home rusa, espejo hebreo RTL, CTAs, cards, formación, opiniones y FAQ construidos.
3. La landing de ansiedad que figuraba en el borrador inicial se retiró del alcance porque no
   existía en producción y no había contenido específico aprobado.

> **Nota — 6-jul-2026 (decisión de Franco):** dirección visual definida. La home (`/`) va a
> ser una **página de perfil de terapeuta estilo Clearly** (referencia:
> `app.clearly.help/therapist/32352`) — one-page con header de stats, video de presentación,
> tabs sobre mí/enfoque/valores, formación con diplomas, info general, selector de horarios,
> opiniones, banner de verificación y sidebar sticky con foto y CTAs. Orden de construcción:
> **ruso primero** (LTR), pase a RTL y espejo hebreo después. Social proof solo con datos
> reales (sin contadores inventados). Precio de la primera sesión (**197 ₪**) visible en el
> perfil — regla actualizada en CLAUDE.md.

### Fase 2 — Construcción del mapa productivo ✅
1. Layout base y componentes compartidos para hebreo RTL y ruso LTR.
2. Siete páginas que cubren el mapa público real de Web 1.0: `/`, `/ru/`, `/booking`,
   `/ru/booking`, `/credentials`, `/terms` y `/404`.
3. Compatibilidad de `dmitry-kazakov` mediante redirecciones permanentes hacia las homes.

Las cuatro landings temáticas y `/free-call` fueron ideas de expansión; nunca existieron en
producción y no forman parte del switch actual. Se podrán crear después con contenido validado.

### Fase 3 — Lo invisible ✅
1. SEO: metas, JSON-LD, sitemap con hreflang, `.htaccess`, clean URLs, 404 y redirects legacy.
2. GA4 `G-JXBHPTBC5V` cargado solo después del consentimiento; eventos sin texto libre. Ads y
   GTM no se cargan en este release. Enhanced Measurement fue desactivado el 18/09 y se verificó
   en OFF para evitar capturar automáticamente URLs salientes hacia WhatsApp.
3. Booking real de Google Calendar, diferido hasta aceptar las condiciones; el selector de la
   home propone horarios para coordinar por WhatsApp y no afirma leer disponibilidad real.
4. Fuentes self-hosted, imágenes optimizadas y retrato solicitado por Dima.
5. `admin.html` no se migra.

### Fase 4 — QA del release ✅
Build, verificador de artefacto, rutas, links, metadatos, estados responsive y consentimiento
fueron comprobados. El calendario público se inspeccionó en una pestaña separada: mostró slots
de 60 minutos, reuniones por Google Meet e instrucciones de pago BIT. No se aceptaron las
condiciones del paciente ni se reservó una cita. Hebreo y ruso pasaron QA móvil a 320 px y texto
al 200 %. La verificación pública final pasó 7 páginas, 26 recursos, 6 redirects y 4 rutas protegidas.

### Fase 5 — Switch a producción ✅
1. Fuente 3.0 guardada en `46d3d71`.
2. Migración sincronizada y publicada en `fd10f813`.
3. `package.json` requerido por Hostinger restaurado y preservado en `c651ab16`.
4. ErrorDocument corregido para servir `/404.html` en producción `128bcb1`.
5. Hostinger confirmó el deploy actual como `Completed`; home y verificación pública pasaron.

## Mapa de URLs del switch actual

| Página | Hebreo (raíz) | Ruso |
|---|---|---|
| Home | `/` | `/ru/` |
| Reservas | `/booking` | `/ru/booking` |
| Términos | `/terms` | — |
| Credenciales | `/credentials` | — |
| 404 | `/404` | — |

`/dmitry-kazakov` y `/ru/dmitry-kazakov` se conservan como aliases 301 hacia `/` y `/ru/`.
Las landings temáticas y `/free-call` quedan como expansión futura, sin enlaces ni entradas de
sitemap hasta que exista contenido real aprobado.

## Deploy y SEO del switch completo

La 3.0 genera sus propios `sitemap.xml`, `robots.txt` y `.htaccess`; ya no depende de páginas
heredadas. El sitemap incluye las cinco URLs indexables y hreflang en home/booking. `/terms` y
`/404` siguen disponibles pero no se incluyen porque llevan `noindex`.

Antes de tocar el destino se creó `..\Respaldos\2026-09-18-214312-antes-migracion-3.0\`, con
ZIP de producción, bundle git, parche previo, retrato y `analytics.db` de 32 KB. El script de
preparación valida remote, branch, limpieza, hashes y límites de ruta; sincroniza archivos
individuales dentro de Web 1.0 y no realiza un borrado recursivo fuera del destino.

Franco autorizó publicar y el switch se completó el 18/09/2026. Evidencia y manifiesto:
`..\Verificaciones\2026-09-18-220800-migracion-3.0\`. Para futuras publicaciones debe
preservarse `..\Web 1.0\package.json`; Hostinger lo necesita para reconocer el build estático y
`scripts\prepare-release.ps1` ya fue ajustado para conservarlo.

## Cómo trabajar en este proyecto

- Abrir Claude Code **en esta carpeta** (es un proyecto aparte, con su propio contexto).
- `npm run dev` → http://localhost:4321 (hot reload; ruso en /ru/).
- Commits acá son libres; a producción solo se llega por la Fase 5.

## Riesgos a vigilar en el cierre

- El Appointment Schedule es un servicio externo: volver a comprobar slots y carga después del deploy.
- No confundir los horarios propuestos por WhatsApp en la home con disponibilidad confirmada.
- La vinculación GA4–Search Console ya está hecha (flujo `14382575313`), pero el cliente/API
  de lectura funciona mediante Analytics Data API y Search Console API en
  `dimatherapy-medicion`; OAuth desktop está autorizado con `kadimaclinic@gmail.com`, scope
  canónico de email y solo lectura. Ocho pruebas pasan; `actualizar-informe.ps1` fue probado
  contra datos reales y regeneró los reportes JSON/Markdown.
- OAuth permanece en modo Testing: el refresh token puede expirar a los 7 días. Franco debe
  decidir si la app pasa a Production o si se reautoriza al vencer.
- Search Console aceptó el sitemap. Las portadas `/` y `/ru/` ya aparecen indexadas;
  ambas solicitudes de reindexación fueron confirmadas y quedaron en la cola prioritaria.
  La actualización del índice depende ahora del rastreo de Google.
