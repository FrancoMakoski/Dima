# Plan Web 3.0 — DimaTherapy (rebuild desde cero)

**Fecha:** 6-jul-2026 · **Decisión:** Franco — rebuild total en proyecto nuevo porque el sitio
en producción no genera suficientes conversiones.

## La idea en una línea

Construir acá un sitio nuevo desde cero (diseño, código y estructura), manteniendo **el mismo
dominio, las mismas URLs y las mismas integraciones**, y cuando esté listo publicarlo por el
canal de deploy que ya funciona. "Migrar" no significa mover el hosting: significa que el día
del switch los archivos nuevos reemplazan a los viejos y nadie nota el cambio técnico — solo
el diseño nuevo.

## Decisiones tomadas (Franco puede vetar cualquiera)

| Decisión | Elegido | Por qué |
|---|---|---|
| Carpeta/proyecto | `Proyectos\DimaTherapy-3.0`, repo git propio | Lo pidió Franco: empezar de 0, separado del viejo |
| Stack | **Astro 5**, salida estática | Componentes + i18n nativo = se acaba el CSS duplicado y los espejos he/ru a mano (la deuda #1 del sitio viejo). El build genera HTML plano → Hostinger no cambia nada |
| URLs | Idénticas a producción | No se pierde SEO, no hacen falta redirects 301 |
| Deploy | `npm run build` → `dist/` → repo viejo → `/pushweb` | Dominio, SSL y hosting intactos; cero riesgo de migración |
| Idiomas | Hebreo (RTL) en raíz, ruso en `/ru/` | Igual que producción |

## Qué se hereda del sitio viejo (obligatorio)

- **Reglas de copy** — ver CLAUDE.md: sin "hipnosis"/"psicólogo", llamada gratis sin duración,
  cero precios, WhatsApp primario, activo Makulov para el segmento ruso.
- **Integraciones:** booking con Google Calendar, analytics doble, tracking gclid/utm y
  `whatsapp_click` en los CTAs.
- **SEO ya ganado:** schema/JSON-LD, sitemap con hreflang, htaccess (clean URLs, 404),
  imágenes optimizadas, meta descriptions.
- **Copy y aprendizajes 2.x:** aunque el diseño sea nuevo, el copy Hormozi de la rama
  `cro-hormozi` (ofertas, garantías, framing) está trabajado y validable — saquearlo, no
  reescribirlo de cero sin motivo.

## Qué NO se migra

- Ni una línea de HTML/CSS/JS del sitio viejo (se reescribe todo).
- El server Express local (`run.bat`) — `npm run dev` lo reemplaza.
- La duplicación manual he/ru.
- `admin.html` + token débil: **decidir en Fase 3** si se rehace con auth decente o se elimina.

## Fases

### Fase 0 — Fundaciones ✅ (hecho 6-jul-2026)
Carpeta, repo git, scaffold Astro con i18n he/ru, este plan, CLAUDE.md con reglas.

### Fase 1 — Diseño (la parte "3.0")
1. Definir la dirección visual con Franco: referencias de sitios que le gusten, qué transmite
   "3.0" (premium/minimal/cálido/editorial…).
2. Maquetar **home + landing de anxiety** primero (hebreo), como muestra de todo el sistema
   visual: tipografía, color, hero, CTAs, cards, testimonios, FAQ, footer.
3. Revisión con Franco (y Dima para el copy) antes de replicar al resto. **Gate: no se avanza
   a Fase 2 sin OK del diseño.**

### Fase 2 — Construcción
1. Layout base + componentes compartidos (nav, hero, CTA WhatsApp, sección precios sin cifras,
   testimonios, FAQ, footer).
2. Las 11 páginas en hebreo: home, 4 landings (anxiety, panic-attacks, physical-symptoms,
   social-anxiety), dmitry-kazakov, booking, free-call, terms, credentials, 404.
3. Versión rusa (8 páginas espejo) reutilizando los mismos componentes con textos ru.

### Fase 3 — Lo invisible
1. SEO: metas, JSON-LD, sitemap con hreflang, htaccess, redirects si alguna URL cambiara.
2. Analytics doble + tracking gclid/utm + eventos `whatsapp_click` en todos los CTAs.
3. Booking con Google Calendar (portar la integración existente).
4. Fuentes self-hosted (subsets he/cy/latin), imágenes optimizadas, 404.
5. Decisión admin.html (rehacer o eliminar).

### Fase 4 — QA
Móvil primero (el tráfico real es casi todo móvil), RTL en hebreo, Lighthouse (performance +
accesibilidad), links internos, todos los CTAs disparando su evento de tracking, formularios.

### Fase 5 — Switch a producción
1. `npm run build` → verificar `dist/` contra el mapa de URLs de abajo.
2. Copiar `dist/` al repo viejo (reemplazando los archivos) → `/pushweb`.
3. Verificar en vivo: home he/ru, una landing, booking, free-call, 404, htaccess.
4. Google Search Console: pedir reindexación de las páginas principales.
5. Monitorear 2 semanas: visitas, clicks WhatsApp, posiciones SEO.

## Mapa de URLs (mantener 1:1 con producción)

| Página | Hebreo (raíz) | Ruso |
|---|---|---|
| Home | `/` | `/ru/` |
| Ansiedad | `/anxiety` | `/ru/anxiety` |
| Ataques de pánico | `/panic-attacks` | `/ru/panic-attacks` |
| Síntomas físicos | `/physical-symptoms` | `/ru/physical-symptoms` |
| Ansiedad social | `/social-anxiety` | `/ru/social-anxiety` |
| Sobre Dima | `/dmitry-kazakov` | `/ru/dmitry-kazakov` |
| Reservas | `/booking` | `/ru/booking` |
| Llamada gratis | `/free-call` | `/ru/free-call` |
| Términos | `/terms` | — |
| Credenciales | `/credentials` | — |
| 404 | `/404` | — |

## Cómo trabajar en este proyecto

- Abrir Claude Code **en esta carpeta** (es un proyecto aparte, con su propio contexto).
- `npm run dev` → http://localhost:4321 (hot reload; ruso en /ru/).
- Commits acá son libres; a producción solo se llega por la Fase 5.

## Riesgo a tener presente

Mientras se construye la 3.0, producción sigue con el sitio 1.0 (el que no convierte) — la
rama `cro-hormozi` del proyecto viejo tiene un sitio 2.2 terminado que se puede publicar en
cualquier momento como puente si la 3.0 se demora.
