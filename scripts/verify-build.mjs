// Comprobación del artefacto que se publica en Hostinger, sin acceder a cuentas.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const site = 'https://dimatherapyonline.com';
const errors = [];
const siteConfig = readFileSync(resolve(projectRoot, 'src/config/site.ts'), 'utf8');
const analyticsFlag = siteConfig.match(/export const ANALYTICS_ENABLED = (true|false) as const;/)?.[1];
const analyticsId = siteConfig.match(/export const GOOGLE_ANALYTICS_ID = '([^']+)' as const;/)?.[1];
if (!analyticsFlag) errors.push('No se pudo leer ANALYTICS_ENABLED de site.ts');
if (!analyticsId) errors.push('No se pudo leer GOOGLE_ANALYTICS_ID de site.ts');
const analyticsEnabled = analyticsFlag === 'true';
function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const full = resolve(path, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function localFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, '');
  const base = resolve(root, clean || 'index.html');
  if (!base.startsWith(resolve(root) + '/') && !base.startsWith(resolve(root) + '\\')) return null;
  return [base, `${base}.html`, resolve(base, 'index.html')].find(p => existsSync(p) && statSync(p).isFile());
}
const required = ['index.html', 'ru/index.html', 'booking.html', 'ru/booking.html', 'credentials.html', 'terms.html', '404.html', '.htaccess', 'robots.txt', 'sitemap.xml'];
for (const file of required) if (!existsSync(resolve(root, file))) errors.push(`Falta ${file}`);
let links = 0;
const htmlFiles = walk(root).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const html = readFileSync(file, 'utf8');
  if (/972528056068|805[ -]?6068|2[,.]?190|3[,.]?490/.test(html)) errors.push(`${rel}: teléfono o paquetes antiguos`);
  if (/src=["']data:image\//.test(html)) errors.push(`${rel}: imagen base64 incrustada`);
  if (!analyticsEnabled) {
    if (html.includes('data-analytics-consent')) errors.push(`${rel}: contiene aviso de Analytics desactivado`);
    if (html.includes('dima_analytics_consent')) errors.push(`${rel}: contiene bootstrap de Analytics desactivado`);
    if (analyticsId && html.includes(analyticsId)) errors.push(`${rel}: contiene destino GA4 desactivado`);
    if (html.includes('googletagmanager.com/gtag/js')) errors.push(`${rel}: contiene loader GA4 desactivado`);
  }
  if ((html.match(/<meta\b[^>]*name=["']robots["']/g) || []).length !== 1) errors.push(`${rel}: robots duplicado o ausente`);
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/)?.[1];
  if (!canonical?.startsWith(site + '/')) errors.push(`${rel}: canonical incorrecto`);
  if (!html.includes('972526407881') && rel !== '404.html') errors.push(`${rel}: no contiene contacto de Dima`);
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:\/\/|mailto:|tel:|data:|javascript:)/.test(value) && !value.startsWith(site + '/')) continue;
    const url = new URL(value, canonical || `${site}/${rel}`);
    if (url.origin !== site) continue;
    // Las anclas dinámicas de agenda se completan en el navegador.
    const target = localFile(url.pathname);
    links++;
    if (!target) errors.push(`${rel}: enlace/recurso inexistente ${value}`);
  }
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${rel}: JSON-LD inválido`); }
  }
}
if (!analyticsEnabled) {
  for (const file of walk(root).filter(file => file.endsWith('.js'))) {
    const rel = relative(root, file).replaceAll('\\', '/');
    const source = readFileSync(file, 'utf8');
    if (source.includes('dima_analytics_consent')) errors.push(`${rel}: contiene bootstrap de Analytics desactivado`);
    if (analyticsId && source.includes(analyticsId)) errors.push(`${rel}: contiene destino GA4 desactivado`);
    if (source.includes('googletagmanager.com/gtag/js')) errors.push(`${rel}: contiene loader GA4 desactivado`);
  }
}
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`OK: ${htmlFiles.length} páginas, ${links} referencias locales, rutas, contactos, metadatos, JSON-LD y Analytics ${analyticsEnabled ? 'activo' : 'desactivado'}.`);
}
