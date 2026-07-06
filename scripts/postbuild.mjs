// Astro con build.format:'file' genera la home rusa como dist/ru.html,
// pero producción la sirve como /ru/ (ru/index.html). Este script la reubica.
import { existsSync, mkdirSync, renameSync } from 'node:fs';

const src = new URL('../dist/ru.html', import.meta.url);
const dir = new URL('../dist/ru/', import.meta.url);
const dest = new URL('../dist/ru/index.html', import.meta.url);

if (existsSync(src)) {
  mkdirSync(dir, { recursive: true });
  renameSync(src, dest);
  console.log('postbuild: dist/ru.html -> dist/ru/index.html');
}
