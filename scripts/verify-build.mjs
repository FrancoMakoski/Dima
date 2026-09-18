// Comprobación del artefacto que se publica en Hostinger, sin acceder a cuentas.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const site = 'https://dimatherapyonline.com';
const errors = [];
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
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`OK: ${htmlFiles.length} páginas, ${links} referencias locales, rutas, contactos, metadatos y JSON-LD.`);
}
