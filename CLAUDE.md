# CLAUDE.md — DimaTherapy 3.0

Sitio web **3.0 de DimaTherapy** (Dima Kazakov, terapeuta en Israel): rebuild total desde cero,
decidido por Franco el 6-jul-2026 porque el sitio en producción no convierte lo suficiente.
Reemplaza al sitio 1.0 en producción (carpeta hermana `..\Web 1.0`, el repo que se publica)
y a la 2.2 nunca publicada (carpeta hermana `..\Web 2.0`, branch `cro-hormozi`).

El roadmap completo vive en [PLAN-WEB-3.0.md](PLAN-WEB-3.0.md). Leerlo antes de tocar nada.

## Reglas de copy NO negociables (valen para TODO el sitio, he + ru)

1. **NUNCA** usar las palabras "hipnosis" ni "psicólogo" en copy público (tabú en Israel /
   Dima no es psicólogo colegiado). Tampoco equivalentes en hebreo/ruso.
2. La oferta gratuita es **"llamada inicial de orientación, sin costo"**. NUNCA mencionar
   duración (ni "sin apuro", ni "15 minutos", nada de tiempo).
3. **CERO precios visibles** en todo el sitio (incluido booking). Todo precio → link
   "consultar precio" que abre wa.me precargado. Únicas excepciones: el "100 ₪" legal en
   terms y el `price: 0` del JSON-LD de la llamada gratis.
4. **WhatsApp es el CTA primario** en todo el sitio, siempre con tracking de conversión.
5. Segmento ruso: usar el linaje de autoridad **V.Yu. Makulov** (referente de psicosomática
   en Rusia, formador de Dima) — es oro para ese público.

## Stack y estructura

- **Astro 5**, salida 100 % estática (`build.format: 'file'` → `anxiety.html`, etc.).
- i18n nativo: **hebreo (RTL) en la raíz**, **ruso bajo `/ru/`** — una sola fuente de
  componentes, nada de mantener espejos HTML a mano como en el sitio viejo.
- Las **URLs deben ser idénticas** a las de producción (mapa en el plan) para no perder SEO.
- Comandos: `npm run dev` (localhost:4321), `npm run build` (genera `dist/`).

## Deploy

El hosting NO cambia: mismo dominio, mismo Hostinger, mismo repo (`..\Web 1.0`).
Publicar = `npm run build` → copiar el contenido de `dist/` adentro de `..\Web 1.0\` →
`push-dima.bat` desde ahí.

## Idioma de trabajo

Español (Misiones) para todo lo interno; el sitio es hebreo + ruso.
