import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: poner el dominio real antes de generar sitemap/canonicals
  // site: 'https://…',
  i18n: {
    defaultLocale: 'he',
    locales: ['he', 'ru'],
    routing: {
      prefixDefaultLocale: false, // hebreo en la raíz (/), ruso bajo /ru/ — igual que el sitio actual
    },
  },
  build: {
    format: 'file', // genera anxiety.html, booking.html, etc. — mismas URLs que producción
  },
});
