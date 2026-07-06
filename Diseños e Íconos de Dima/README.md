# Íconos de Dima — desglosados

Extraídos de `Dima-icons.svg` (99 fragmentos originales, 26 íconos únicos de Dima tras deduplicar,
+ 2 artefactos que NO son del diseño de Dima — ver abajo).

> ⚠️ **Re-etiquetado 6-jul-2026 (corrección de Franco).** Se detectó que 6 íconos estaban
> **mal etiquetados desde el origen**: el nombre del archivo no correspondía a lo que dibujaban.
> Franco los renombró a mano. El caso más grave: lo que se llamaba `whatsapp-icon-*` era en
> realidad un **pulgar arriba (Like)**, y lo que se llamaba `archive-inbox`/`inbox-badge-mint`
> eran **billeteras**. Corrección aplicada al catálogo, al sprite (`public/assets/img/profile-icons.svg`)
> y a los usos en el sitio. Mapeo viejo → nuevo:
>
> | Nombre viejo (MAL) | Qué dibuja en realidad | Nombre nuevo |
> |---|---|---|
> | archive-inbox-icon.svg | billetera (contorno) | wallet-icon.svg |
> | inbox-badge-mint-icon.svg | billetera sobre disco menta | wallet-green-icon.svg |
> | whatsapp-icon-green.svg | pulgar arriba / like (verde #1DB876) | like-icon.svg |
> | whatsapp-icon-teal.svg | pulgar arriba / like (verde #4DC591) | like-2-icon.svg |
> | yin-yang-balance-icon.svg | dos ojos | eyes-icon.svg |
> | connection-nodes-icon.svg | anteojos | glasses-icon.svg |
>
> `like-icon` y `like-2-icon` son el **mismo dibujo** en dos tonos de verde (no son duplicado
> exacto — se conservan ambos). El WhatsApp real del sitio ahora usa el logo oficial
> (`public/assets/icons/whatsapp-official-icon.svg`), incorporado al sprite como symbol `whatsapp`.

| Archivo | Tamaño | Descripción |
|---|---|---|
| like-icon.svg | 16x17 | Pulgar arriba / "me gusta" (verde #1DB876) — reseñas/aprobación |
| like-2-icon.svg | 16x17 | Pulgar arriba / "me gusta" (variante verde #4DC591) |
| bar-chart-icon.svg | 16x16 | Gráfico de barras ascendentes (naranja) |
| growth-chart-check-icon.svg | 16x16 | Gráfico de tendencia/crecimiento con check |
| eyes-icon.svg | 16x16 | Dos ojos (ver / leer) |
| chat-bubble-dots-icon.svg | 18x18 | Globo de chat con puntos (mensaje/conversación) |
| sprout-plant-icon.svg | 18x20 | Brote/planta (crecimiento, sanación) |
| flower-icon.svg | 18x18 | Flor / rueda con pétalos |
| checklist-book-icon.svg | 18x18 | Libreta abierta con lista (checklist) |
| minus-toggle-icon.svg | 20x20 (24x24 base) | Signo "menos" — colapsar acordeón |
| plus-toggle-icon.svg | 20x20 (24x24 base) | Signo "más" — expandir acordeón |
| chevron-down-toggle-icon.svg | 24x24 | Flecha hacia abajo — toggle acordeón |
| search-zoom-icon.svg | 24x24 | Lupa con "+" — buscar / zoom |
| certificate-badge-icon.svg | 20x20 | Certificado / diploma con cinta |
| glasses-icon.svg | 20x20 | Anteojos (lectura / estudio) |
| chevron-left-icon.svg | 16x24 | Flecha izquierda (carrusel) |
| chevron-right-icon.svg | 16x24 | Flecha derecha (carrusel) |
| chevron-right-bold-icon.svg | 24x24 | Flecha derecha, trazo grueso |
| star-rating-icon.svg | 16x16 | Estrella (rating / reseñas) |
| checkmark-icon.svg | 24x25 | Tilde / check simple |
| wallet-icon.svg | 24x24 | Billetera (contorno, sin fondo) — precio/pago |
| wallet-green-icon.svg | 32x33 | Billetera con fondo circular menta — precio/pago |
| clock-badge-peach-icon.svg | 32x32 | Reloj con fondo circular durazno |
| sparkle-badge-pink-icon.svg | 16x16 | Destello/chispa con fondo circular rosa |
| info-circle-icon.svg | 16x16 | Círculo con "i" (información) |

## ⚠️ No pertenecen al diseño de Dima

Estos dos quedaron mezclados en el SVG original pero son artefactos de la interfaz de Claude
(cursores fantasma de captura de pantalla), no íconos del sitio. No usar:

- `NOT-DIMA-claude-cursor-plain-ARTIFACT.svg`
- `NOT-DIMA-claude-cursor-styled-ARTIFACT.svg`

## Ver todos los íconos

Abrí `galeria.html` en el navegador para verlos todos juntos.
