/* Run with: cd qa && npm install --ignore-scripts && npm test.
 * DOM simulation tests validate production logic. They do not render a browser.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parseHTML } = require('linkedom');
const csstree = require('css-tree');
const base = fs.existsSync(path.join(__dirname, '../dist/index.html')) ? path.join(__dirname, '../dist') : path.join(__dirname, '..');
const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(base, 'portfolio-v2.css'), 'utf8');
const script = fs.readFileSync(path.join(base, 'portfolio-v2.js'), 'utf8');
const model = require(path.join(base, 'portfolio-v2.js'));
let checks = 0;
function check(name, run) {
  run(); checks++;
  console.log('PASS ' + name);
}
function boot({ width = 1440, reduced = false, fine = true, storageThrows = false, savedMotion = null, observers = true, context2d = true, dialogs = true } = {}) {
  const { window, document } = parseHTML(html);
  const frames = new Map(), timers = new Map(), media = new Map(), io = [];
  let sequence = 0, focused = null, cancelledAnimations = 0;
  const ctx = { setTransform() {}, clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, arc() {}, fill() {} };
  window.HTMLCanvasElement.prototype.getContext = () => context2d ? ctx : null;
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    return { top: this.id === 'site-header' ? 0 : 1200, left: 0, right: width, bottom: 1800, width, height: this.id === 'site-header' ? 80 : 600 };
  };
  window.HTMLElement.prototype.focus = function () { focused = this; };
  Object.defineProperty(document, 'activeElement', { get: () => focused });
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 7000 });
  Object.defineProperty(document, 'hidden', { value: false, writable: true });
  document.getAnimations = () => [{ cancel() { cancelledAnimations++; } }];
  const dialog = document.getElementById('project-dialog');
  if (dialogs) {
    dialog.showModal = () => { dialog.open = true; dialog.setAttribute('open', ''); };
    dialog.close = () => { dialog.open = false; dialog.removeAttribute('open'); dialog.dispatchEvent(new window.Event('close')); };
  }
  window.innerHeight = 900;
  window.innerWidth = width;
  window.scrollY = 0;
  window.devicePixelRatio = 2;
  window.matchMedia = query => {
    if (!media.has(query)) {
      const item = {
        matches: query.includes('reduced-motion') ? reduced : query.includes('max-width') ? width <= 1000 : fine,
        listeners: [], addEventListener(_, callback) { this.listeners.push(callback); },
        change(value) { this.matches = value; this.listeners.forEach(callback => callback({ matches: value })); }
      };
      media.set(query, item);
    }
    return media.get(query);
  };
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); io.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    trigger(target, visible) { this.callback([{ target, isIntersecting: visible }]); }
  }
  if (observers) window.IntersectionObserver = Observer;
  else delete window.IntersectionObserver;
  let saved = savedMotion;
  const storage = {
    getItem() { if (storageThrows) throw Error('Storage unavailable'); return saved; },
    setItem(_, value) { if (storageThrows) throw Error('Storage unavailable'); saved = value; }
  };
  const context = {
    window, document, Intl, Math, Date, console,
    localStorage: storage,
    requestAnimationFrame(callback) { const id = ++sequence; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    setTimeout(callback) { const id = ++sequence; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  if (observers) context.IntersectionObserver = Observer;
  vm.runInNewContext(script, context, { filename: 'portfolio-v2.js', timeout: 5000 });
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const fire = (target, type, props = {}) => {
    const event = new window.Event(type, { bubbles: true });
    Object.assign(event, props);
    target.dispatchEvent(event);
  };
  return {
    window, document, $, $$, fire, frames, media, io,
    click(selector) { fire($(selector), 'click'); },
    flushTimers() { const pending = Array.from(timers.values()); timers.clear(); pending.forEach(callback => callback()); },
    get focused() { return focused; },
    get cancellations() { return cancelledAnimations; },
    flushFrame(time = 100) { const pending = Array.from(frames.values()); frames.clear(); pending.forEach(callback => callback(time)); }
  };
}
check('HTML structure, IDs, headings, anchors and ARIA references', () => {
  const { document } = parseHTML(html);
  assert.equal(document.documentElement.lang, 'pt-BR');
  assert.equal(document.querySelectorAll('h1').length, 1);
  const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const el of document.querySelectorAll('[aria-controls], [aria-labelledby], [aria-describedby]')) {
    for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
      for (const id of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) assert.ok(ids.includes(id), 'Missing ARIA target ' + id);
    }
  }
  for (const link of document.querySelectorAll('a[href^="#"]')) assert.ok(ids.includes(link.getAttribute('href').slice(1)), 'Missing anchor ' + link.getAttribute('href'));
  for (const button of document.querySelectorAll('button')) {
    assert.equal(button.getAttribute('type'), 'button');
    assert.ok(button.textContent.trim() || button.getAttribute('aria-label'));
  }
  assert.ok(!html.includes('PROFILE_SRC'));
});
check('Original portrait, local assets and public contact destinations', () => {
  const { document } = parseHTML(html);
  const photo = document.querySelector('img');
  assert.ok(photo.getAttribute('src').startsWith('data:image/png;base64,'));
  const buffer = Buffer.from(photo.getAttribute('src').split(',')[1], 'base64');
  assert.equal(buffer.readUInt32BE(16), 200);
  assert.equal(buffer.readUInt32BE(20), 200);
  assert.ok(photo.getAttribute('alt'));
  for (const el of document.querySelectorAll('link[rel="stylesheet"],script[src]')) {
    const resource = el.getAttribute('href') || el.getAttribute('src');
    assert.ok(fs.existsSync(path.join(base, resource)), resource);
  }
  for (const link of document.querySelectorAll('a[target="_blank"]')) assert.match(link.getAttribute('rel'), /noopener/);
  const links = Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href'));
  assert.ok(links.includes('mailto:Felipe.vlima@outlook.com'));
  assert.ok(links.includes('https://wa.me/5511973418206'));
  assert.ok(links.includes('https://www.linkedin.com/in/felipe-vieira-de-lima-600607230/'));
});
check('CSS parses, readable minimum text and responsive/reduced-motion rules', () => {
  const ast = csstree.parse(css, { positions: true });
  const problems = [];
  csstree.walk(ast, node => {
    if (node.type === 'Declaration' && node.property === 'font-size') {
      const value = csstree.generate(node.value);
      if (/^[\d.]+px$/.test(value) && parseFloat(value) < 12) problems.push(value);
      if (/^[\d.]+rem$/.test(value) && parseFloat(value) < .75) problems.push(value);
    }
  });
  assert.deepEqual(problems, []);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /max-width:380px/);
  assert.match(css, /max-width:760px/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\[hidden\]\s*\{\s*display:none!important/);
});
check('All chart points, targets and metric calculations remain in range', () => {
  for (const scenario of Object.values(model.SCENARIOS)) {
    for (const series of [scenario.values, scenario.secondary, scenario.tertiary]) assert.equal(series.length, 7);
    assert.ok(scenario.target >= scenario.min && scenario.target <= scenario.max);
    for (let i = 0; i < 7; i++) {
      const p = model.point(scenario, i);
      assert.ok(p.x >= 35 && p.x <= 465);
      assert.ok(p.y >= 30 && p.y <= 165);
      assert.ok(Number.isFinite(scenario.values[i]));
    }
    assert.ok(!model.chartPath(scenario).includes('NaN'));
  }
  assert.equal(model.deltaText(model.SCENARIOS.logistica, 6), '+7,8 p.p. desde janeiro');
  assert.equal(model.deltaText(model.SCENARIOS.custos, 6), '−21,3% desde janeiro');
  assert.equal(model.metricText(18.42, 'R$'), 'R$ 18,42');
});
check('Production script initializes for desktop, narrow view and device preferences', () => {
  for (const width of [320, 375, 760, 768, 1000, 1024, 1440]) {
    const app = boot({ width, fine: width > 1000 });
    assert.ok(app.document.documentElement.classList.contains('js'));
    assert.equal(app.$('#menu').inert, width <= 1000);
    assert.equal(app.$('#metric-value-0').textContent, '94,8%');
    assert.equal(app.$('#chart-points').children.length, 7);
  }
});
check('All 21 scenario/month states update metrics, chart and accessible announcement', () => {
  const app = boot();
  for (const [key, scenario] of Object.entries(model.SCENARIOS)) {
    app.click('[data-scenario="' + key + '"]');
    assert.equal(app.$$('[data-scenario][aria-pressed="true"]').length, 1);
    for (let i = 0; i < 7; i++) {
      app.$('#month-slider').value = String(i);
      app.fire(app.$('#month-slider'), 'input');
      app.flushTimers();
      assert.equal(app.$('#chart-title').textContent, scenario.title);
      assert.equal(app.$('#period-badge').textContent, model.MONTHS[i]);
      assert.equal(app.$('#month-slider').getAttribute('aria-valuetext'), model.MONTHS[i]);
      assert.equal(app.$('#metric-value-0').textContent, model.metricText(scenario.values[i], scenario.unit));
      assert.match(app.$('#chart-announcement').textContent, /Dados fictícios/);
      assert.equal(app.$('#chart-selected').getAttribute('cx'), model.point(scenario, i).x.toFixed(2));
      assert.equal(app.$('#chart-selected').getAttribute('cy'), model.point(scenario, i).y.toFixed(2));
    }
  }
});
check('Filters preserve correct result counts and can return to all solutions', () => {
  const app = boot();
  for (const [filter, count] of [['logistica',2],['pessoas',1],['comex',1],['todos',4]]) {
    app.click('[data-filter="' + filter + '"]');
    assert.equal(app.$$('.project-card').filter(card => !card.hidden).length, count);
    assert.equal(app.$$('[data-filter][aria-pressed="true"]').length, 1);
    assert.ok(app.$('#filter-status').textContent.startsWith(String(count)));
  }
});
check('Each solution opens the right content and restores focus when closed', () => {
  const app = boot();
  for (const [key, project] of Object.entries(model.PROJECTS)) {
    const button = app.$('[data-project="' + key + '"]');
    app.fire(button, 'click');
    assert.equal(app.$('#project-dialog').open, true);
    assert.equal(app.$('#dialog-title').textContent, project.title);
    assert.equal(app.$('#dialog-features').children.length, project.features.length);
    assert.ok(app.document.body.classList.contains('dialog-open'));
    assert.ok(decodeURIComponent(app.$('#dialog-contact').getAttribute('href')).includes(project.title));
    app.click('#dialog-close');
    assert.equal(app.$('#project-dialog').open, false);
    assert.equal(app.document.body.classList.contains('dialog-open'), false);
    assert.equal(app.focused, button);
  }
});
check('Mobile disclosure handles open, Escape, link and breakpoint changes', () => {
  const app = boot({ width: 375, fine: false });
  app.click('#menu-toggle');
  assert.equal(app.$('#menu').inert, false);
  assert.equal(app.$('#menu-toggle').getAttribute('aria-expanded'), 'true');
  app.fire(app.document, 'keydown', { key: 'Escape' });
  assert.equal(app.$('#menu').inert, true);
  assert.equal(app.focused, app.$('#menu-toggle'));
  app.click('#menu-toggle');
  app.click('#menu a[href="#projetos"]');
  assert.equal(app.$('#menu-toggle').getAttribute('aria-expanded'), 'false');
  app.media.get('(max-width: 1000px)').change(false);
  assert.equal(app.$('#menu').inert, false);
});
check('Pause cancels animations and render loop; resume is functional', () => {
  const app = boot();
  assert.equal(app.document.documentElement.dataset.motion, 'on');
  assert.ok(app.frames.size > 0);
  app.click('#motion-toggle');
  assert.equal(app.document.documentElement.dataset.motion, 'off');
  assert.equal(app.frames.size, 0);
  assert.equal(app.cancellations, 1);
  assert.equal(app.$$('.reveal-pending').length, 0);
  app.click('#motion-toggle');
  assert.equal(app.document.documentElement.dataset.motion, 'on');
  assert.ok(app.frames.size > 0);
});
check('Reduced motion, blocked storage, absent observers/canvas/dialog do not break content', () => {
  const reduced = boot({ reduced: true, storageThrows: true });
  assert.equal(reduced.document.documentElement.dataset.motion, 'off');
  assert.equal(reduced.$('#motion-toggle').disabled, true);
  assert.equal(reduced.frames.size, 0);
  reduced.click('[data-scenario="custos"]');
  assert.equal(reduced.$('#metric-value-0').textContent, 'R$ 18,42');
  const fallback = boot({ observers: false, context2d: false, dialogs: false });
  assert.equal(fallback.$('#metric-value-0').textContent, '94,8%');
  assert.equal(fallback.frames.size, 0);
  assert.equal(fallback.$$('.reveal-pending').length, 0);
  assert.ok(fallback.$$('[data-project]').every(button => button.hidden));
  const saved = boot({ savedMotion: 'off' });
  assert.equal(saved.document.documentElement.dataset.motion, 'off');
});
check('Render loop stops offscreen and while the page is hidden', () => {
  const app = boot();
  const observer = app.io.find(item => item.targets.has(app.$('.hero-stage')));
  observer.trigger(app.$('.hero-stage'), false);
  assert.equal(app.frames.size, 0);
  observer.trigger(app.$('.hero-stage'), true);
  assert.ok(app.frames.size > 0);
  app.document.hidden = true;
  app.fire(app.document, 'visibilitychange');
  assert.equal(app.frames.size, 0);
});
check('Touch does not activate tilt; fine pointer tilt resets on leave', () => {
  const touch = boot({ width: 375, fine: false });
  touch.fire(touch.$('#dashboard'), 'pointermove', { clientX: 100, clientY: 150 });
  touch.flushFrame();
  assert.equal(touch.$('#dashboard').style.getPropertyValue('--ry'), '');
  const mouse = boot();
  mouse.fire(mouse.$('#dashboard'), 'pointermove', { clientX: 500, clientY: 1400 });
  mouse.flushFrame();
  assert.ok(mouse.$('#dashboard').style.getPropertyValue('--ry'));
  mouse.fire(mouse.$('#dashboard'), 'pointerleave');
  assert.equal(mouse.$('#dashboard').style.getPropertyValue('--ry'), '');
});
console.log('\n' + checks + ' test groups passed. Layout rendering and real-device behavior require browser QA.');
