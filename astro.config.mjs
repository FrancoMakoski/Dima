import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dimatherapyonline.com',
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
