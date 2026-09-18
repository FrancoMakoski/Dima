// Parche EXCLUSIVO para el preview en GitHub Pages — NO se usa en el deploy a producción.
//
// El sitio se escribe con rutas absolutas desde la raíz del dominio (/assets/…), que es como
// lo sirve Hostinger. GitHub Pages lo publica bajo /Dima/, así que acá reescribimos el dist/
// ya construido para que todo cuelgue del subpath. El código fuente queda intacto: producción
// sigue generando exactamente el mismo HTML de siempre.
//
// Además marca el preview como noindex para que Google no lo indexe y termine compitiendo
// contra el dominio real por el mismo contenido (he + ru).
//
// Uso: node scripts/pages-basepath.mjs /Dima

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = (process.argv[2] || '').replace(/\/$/, '');
if (!BASE) {
  console.error('pages-basepath: falta el subpath (ej: /Dima)');
  process.exit(1);
}

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const TEXT = new Set(['.html', '.css', '.js', '.svg', '.xml', '.json', '.txt', '.webmanifest']);
// evita re-prefijar si el script corre dos veces
const NOT_DONE = `(?!${BASE.replace(/\//g, '\\/')}\\/)`;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const NOINDEX = '<meta name="robots" content="noindex, nofollow">';
let patched = 0;

for (const file of walk(DIST)) {
  const ext = extname(file);
  if (!TEXT.has(ext)) continue;

  const original = readFileSync(file, 'utf8');
  let out = original;

  // href="/x" y src="/x"  (no toca "//cdn…" ni URLs absolutas con esquema)
  out = out.replace(new RegExp(`\\b(href|src)="\\/(?!\\/)${NOT_DONE}`, 'g'), `$1="${BASE}/`);

  // srcset="/a.webp 1x, /b.webp 2x"
  out = out.replace(/\bsrcset="([^"]+)"/g, (m, v) =>
    `srcset="${v.replace(new RegExp(`(^|,\\s*)\\/(?!\\/)${NOT_DONE}`, 'g'), `$1${BASE}/`)}"`,
  );

  // url(/x) en CSS, con o sin comillas
  out = out.replace(new RegExp(`url\\((['"]?)\\/(?!\\/)${NOT_DONE}`, 'g'), `url($1${BASE}/`);

  // rutas a assets embebidas en strings de JS
  out = out.replace(new RegExp(`(["'\`])\\/assets\\/`, 'g'), `$1${BASE}/assets/`);

  // Preview no indexable. El sitio ya emite su propia <meta name="robots" content="index,follow…">,
  // asi que hay que REEMPLAZARLA — insertar solo cuando falta dejaba las paginas indexables.
  if (ext === '.html') {
    out = out.includes('name="robots"')
      ? out.replace(/<meta\s+name="robots"[^>]*>/gi, NOINDEX)
      : out.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n    ${NOINDEX}`);
  }

  if (out !== original) {
    writeFileSync(file, out, 'utf8');
    patched++;
  }
}

// Bloquea buscadores en todo el preview y desactiva Jekyll (Astro emite _astro/).
writeFileSync(join(DIST, 'robots.txt'), 'User-agent: *\nDisallow: /\n', 'utf8');
writeFileSync(join(DIST, '.nojekyll'), '', 'utf8');

console.log(`pages-basepath: base "${BASE}" aplicada a ${patched} archivos + robots.txt noindex`);
