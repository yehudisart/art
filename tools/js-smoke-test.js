/* Runs the site's IIFE against a minimal DOM so load-time runtime errors --
   ordering bugs, missing elements, bad property access -- surface here instead
   of silently killing every event listener registered after the throw. */
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');

const ids = new Set();
html.replace(/\sid="([^"]+)"/g, (_, i) => ids.add(i));
const classes = new Set();
html.replace(/\sclass="([^"]+)"/g, (_, c) => c.split(/\s+/).forEach(x => x && classes.add(x)));

const missing = new Set();
const listeners = [];

function makeEl(tag = 'div') {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    style: { setProperty() {}, removeProperty() {} },
    dataset: {}, children: [], attributes: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    _html: '', _text: '',
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); },
    get textContent() { return this._text; }, set textContent(v) { this._text = String(v); },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    removeAttribute(k) { delete this.attributes[k]; },
    hasAttribute(k) { return k in this.attributes; },
    appendChild(c) { this.children.push(c); return c; },
    removeChild(c) { return c; },
    insertBefore(c) { this.children.push(c); return c; },
    addEventListener(t) { listeners.push(t); },
    removeEventListener() {}, click() {}, focus() {}, blur() {},
    scrollIntoView() {}, getBoundingClientRect: () => ({ top:0,left:0,width:100,height:100,bottom:100,right:100 }),
    querySelector: sel => resolve(sel, true),
    querySelectorAll: () => [],
    closest: () => null, contains: () => false,
    play: () => Promise.resolve(), pause() {}, load() {},
    offsetWidth: 100, offsetHeight: 100, offsetTop: 0, scrollTop: 0,
    value: '', checked: false, disabled: false, complete: true, naturalWidth: 100,
  };
  return el;
}

function resolve(sel, quiet) {
  if (typeof sel !== 'string') return makeEl();
  const m = sel.match(/^#([\w-]+)$/);
  if (m) {
    if (!ids.has(m[1])) { missing.add(sel); if (!quiet) return null; }
    return makeEl();
  }
  return makeEl();
}

const document = {
  documentElement: makeEl('html'),
  body: makeEl('body'),
  head: makeEl('head'),
  title: '',
  readyState: 'complete',
  createElement: t => makeEl(t),
  createDocumentFragment: () => makeEl(),
  createTextNode: () => makeEl(),
  querySelector: sel => resolve(sel),
  querySelectorAll: () => [],
  getElementById: id => (ids.has(id) ? makeEl() : (missing.add('#' + id), null)),
  getElementsByClassName: () => [],
  addEventListener(t) { listeners.push(t); },
  removeEventListener() {},
  dispatchEvent() {},
};

const window = {
  document, location: { hash: '', href: 'https://x/', pathname: '/', search: '' },
  history: { pushState() {}, replaceState() {}, back() {} },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {} }),
  addEventListener(t) { listeners.push(t); }, removeEventListener() {},
  requestAnimationFrame: cb => { cb(0); return 1; }, cancelAnimationFrame() {},
  setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  scrollTo() {}, scrollY: 0, innerWidth: 1440, innerHeight: 900, devicePixelRatio: 2,
  IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
  ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
  navigator: { userAgent: 'node', share: undefined, clipboard: { writeText: () => Promise.resolve() } },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  Image: class { constructor(){ this.complete = true; } },
  console,
};
window.window = window;
window.self = window;

const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
console.log('script blocks found:', scripts.length);

let failed = false;
scripts.forEach((code, i) => {
  try {
    const fn = new Function('window', 'document', 'location', 'history', 'navigator',
      'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
      'requestAnimationFrame', 'cancelAnimationFrame', 'getComputedStyle',
      'matchMedia', 'IntersectionObserver', 'ResizeObserver', 'localStorage', 'Image', code);
    fn(window, document, window.location, window.history, window.navigator,
      window.setTimeout, window.clearTimeout, window.setInterval, window.clearInterval,
      window.requestAnimationFrame, window.cancelAnimationFrame, window.getComputedStyle,
      window.matchMedia, window.IntersectionObserver, window.ResizeObserver,
      window.localStorage, window.Image);
    console.log(`  block ${i}: executed clean`);
  } catch (e) {
    failed = true;
    console.log(`  block ${i}: RUNTIME ERROR -> ${e.constructor.name}: ${e.message}`);
    const line = (e.stack || '').split('\n')[1];
    if (line) console.log('    at', line.trim());
  }
});

console.log('\nevent listeners registered:', listeners.length);
console.log('selectors that matched no id in the HTML:',
  missing.size ? [...missing].join(', ') : 'none');
process.exit(failed ? 1 : 0);
