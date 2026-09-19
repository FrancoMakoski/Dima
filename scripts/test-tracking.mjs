// Smoke test sin navegador para Analytics desactivado, el opt-in conservado y los eventos GA4.
// Ejecutar después de `npm run build`.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const DIST = resolve(import.meta.dirname, '../dist');
const SITE_CONFIG = resolve(import.meta.dirname, '../src/config/site.ts');
const BASE_LAYOUT = resolve(import.meta.dirname, '../src/layouts/Base.astro');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const full = resolve(path, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const siteConfig = readFileSync(SITE_CONFIG, 'utf8');
const analyticsFlag = siteConfig.match(/export const ANALYTICS_ENABLED = (true|false) as const;/)?.[1];
const analyticsId = siteConfig.match(/export const GOOGLE_ANALYTICS_ID = '([^']+)' as const;/)?.[1];
assert(analyticsFlag, 'No se encontró ANALYTICS_ENABLED en site.ts');
assert(analyticsId, 'No se encontró GOOGLE_ANALYTICS_ID en site.ts');
const analyticsEnabled = analyticsFlag === 'true';

const publicFiles = walk(DIST).filter((file) => /\.(?:html|js)$/.test(file));
const htmlFiles = publicFiles.filter((file) => file.endsWith('.html'));
assert(htmlFiles.length > 0, 'No hay HTML construido; ejecutar npm run build primero');

for (const file of publicFiles) {
  const source = readFileSync(file, 'utf8');
  assert(!source.includes('AW-'), `${file}: contiene un destino Google Ads`);
  assert(!source.includes('GTM-'), `${file}: contiene Google Tag Manager`);
  if (!analyticsEnabled) {
    assert(!source.includes('data-analytics-consent'), `${file}: contiene el aviso de Analytics desactivado`);
    assert(!source.includes('dima_analytics_consent'), `${file}: contiene el bootstrap de consentimiento desactivado`);
    assert(!source.includes(analyticsId), `${file}: contiene el destino GA4 desactivado`);
    assert(!source.includes('googletagmanager.com/gtag/js'), `${file}: contiene el loader de GA4 desactivado`);
  }
}

if (analyticsEnabled) {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert(html.includes('data-analytics-consent'), `${file}: falta el control de consentimiento`);
    assert(html.includes(analyticsId), `${file}: falta el destino GA4`);
  }
}

// El bootstrap no llega al build mientras el flag está apagado. Se prueba desde
// la fuente para conservar la cobertura del guard de producción y del opt-in.
const baseLayout = readFileSync(BASE_LAYOUT, 'utf8');
const bootstrapTemplate = baseLayout.match(/const analyticsBootstrap = `([\s\S]*?)`;\r?\nconst analyticsConsent/)?.[1];
assert(bootstrapTemplate, 'No se encontró el bootstrap de consentimiento conservado');
const bootstrap = vm.runInNewContext(`\`${bootstrapTemplate}\``, {
  GOOGLE_ANALYTICS_ID: analyticsId,
});

function consentScenario({ hostname, protocol = 'https:', choice = '' }) {
  const handlers = {};
  const buttons = {
    accept: { addEventListener: (_name, callback) => { handlers.accept = callback; } },
    decline: { addEventListener: (_name, callback) => { handlers.decline = callback; } },
  };
  const box = {
    hidden: true,
    querySelector: (selector) => selector.includes('accept') ? buttons.accept : buttons.decline,
  };
  const storage = new Map(choice ? [['dima_analytics_consent', choice]] : []);
  const scripts = [];
  const origin = `${protocol}//${hostname}`;
  const document = {
    readyState: 'complete',
    referrer: 'https://ref.example/path?private=1#fragment',
    querySelector: () => box,
    createElement: () => ({}),
    head: { appendChild: (element) => scripts.push(element) },
    dispatchEvent: (event) => { handlers.ready = event.type; },
  };
  const window = {
    location: {
      hostname,
      protocol,
      origin,
      href: `${origin}/ru/?private=1#fragment`,
    },
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
    },
  };

  vm.runInNewContext(bootstrap, {
    window,
    document,
    URL,
    CustomEvent: class CustomEvent {
      constructor(type) { this.type = type; }
    },
  });

  return { box, handlers, scripts, storage, window };
}

for (const scenario of [
  consentScenario({ hostname: 'localhost' }),
  consentScenario({ hostname: '127.0.0.1' }),
  consentScenario({ hostname: 'dimatherapyonline.com', protocol: 'http:' }),
  consentScenario({ hostname: 'francomakoski.github.io' }),
]) {
  assert(scenario.box.hidden, 'Un host de preview mostró el consentimiento de producción');
  assert(scenario.scripts.length === 0, 'Un host de preview cargó Google Analytics');
  assert(scenario.window.__dimaTrackingEnabled === false, 'Un host de preview habilitó tracking');
}

const undecided = consentScenario({ hostname: 'dimatherapyonline.com' });
assert(!undecided.box.hidden, 'Producción no mostró el opt-in cuando falta una decisión');
assert(undecided.scripts.length === 0, 'GA4 cargó antes del consentimiento');
undecided.handlers.decline();
assert(undecided.box.hidden, 'Rechazar no cerró el aviso');
assert(undecided.storage.get('dima_analytics_consent') === 'declined', 'Rechazo no persistido');
assert(undecided.scripts.length === 0, 'Rechazar cargó GA4');

const accepted = consentScenario({ hostname: 'www.dimatherapyonline.com' });
accepted.handlers.accept();
assert(accepted.box.hidden, 'Aceptar no cerró el aviso');
assert(accepted.storage.get('dima_analytics_consent') === 'accepted', 'Aceptación no persistida');
assert(accepted.scripts.length === 1, 'Aceptar no cargó exactamente un Google tag');
assert(accepted.scripts[0].src.endsWith(`gtag/js?id=${analyticsId}`), 'Se cargó un destino inesperado');
assert(accepted.window.__dimaTrackingEnabled === true, 'Aceptar no habilitó los eventos');
const config = accepted.window.dataLayer.find((args) => args[0] === 'config');
assert(config, 'Falta la configuración GA4');
assert(!config[2].page_location.includes('?') && !config[2].page_location.includes('#'), 'page_location filtró query o fragmento');
assert(!config[2].page_referrer.includes('?') && !config[2].page_referrer.includes('#'), 'page_referrer filtró query o fragmento');
assert(!accepted.window.dataLayer.some((args) => String(args).includes('AW-')), 'Se configuró Google Ads');

const trackingFile = walk(resolve(DIST, '_astro')).find((file) => {
  if (!file.endsWith('.js')) return false;
  const source = readFileSync(file, 'utf8');
  return source.includes('dima:analytics-ready') && source.includes('booking_calendar_open');
});
assert(trackingFile, 'No se encontró el bundle de tracking');

const trackingSource = readFileSync(trackingFile, 'utf8');
const listeners = new Map();
const gtagCalls = [];
class FakeElement {
  constructor(attributes = {}) { this.attributes = attributes; }
  getAttribute(name) { return this.attributes[name] || null; }
  closest(selector) {
    if (selector === '[data-track]') return this;
    if (selector === 'a' && this instanceof FakeAnchor) return this;
    return null;
  }
}
class FakeAnchor extends FakeElement {
  constructor(attributes, href) {
    super(attributes);
    this.href = href;
  }
}
const document = {
  readyState: 'loading',
  documentElement: { lang: 'ru' },
  addEventListener: (name, callback) => {
    const callbacks = listeners.get(name) || [];
    callbacks.push(callback);
    listeners.set(name, callbacks);
  },
};
const window = {
  __dimaTrackingEnabled: true,
  gtag: (...args) => gtagCalls.push(args),
};
vm.runInNewContext(trackingSource, { document, window, URL, HTMLAnchorElement: FakeAnchor });

for (const callback of listeners.get('dima:analytics-ready') || []) callback();
for (const callback of listeners.get('dima:analytics-ready') || []) callback();
for (const callback of listeners.get('DOMContentLoaded') || []) callback();
assert((listeners.get('click') || []).length === 1, 'El listener de clicks se duplicó');
const click = listeners.get('click')[0];

click({ target: new FakeAnchor(
  { 'data-track': 'whatsapp_click', 'data-track-label': 'booking_help_ru' },
  'https://wa.me/972526407881?text=SECRET_MESSAGE',
) });
click({ target: new FakeElement({
  'data-track': 'booking_slot_select',
  'data-track-label': 'SECRET_DATE_AND_TIME',
}) });
click({ target: new FakeElement({
  'data-track': 'booking_terms_accepted',
  'data-track-label': 'booking_ru',
}) });

assert(gtagCalls.length === 3, 'Cantidad inesperada de eventos manuales');
assert(gtagCalls.map((call) => call[1]).join(',') === 'whatsapp_click,booking_slot_select,booking_calendar_open', 'Nombres de evento incoherentes');
const serializedCalls = JSON.stringify(gtagCalls);
for (const forbidden of ['SECRET_MESSAGE', 'SECRET_DATE_AND_TIME', 'wa.me', '?text=', 'booking_ru']) {
  assert(!serializedCalls.includes(forbidden), `Se filtró un dato no permitido: ${forbidden}`);
}

console.log(`OK tracking ${analyticsEnabled ? 'activo' : 'desactivado'}: ${htmlFiles.length} páginas; artefacto público, hosts, opt-in/deny, URL limpia, eventos privados y deduplicación.`);
