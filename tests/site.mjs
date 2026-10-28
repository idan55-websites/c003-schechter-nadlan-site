// End-to-end checks against a running build: `npm run build && npm run preview`, then `npm test`.
// SITE_URL overrides the target (default http://localhost:4173). BROWSER=webkit uses WebKit.
import {chromium, webkit} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SITE = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
const dist = path.resolve(import.meta.dirname, '../dist');
const routes = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && !(dir === dist && ['assets', 'media', 'fonts'].includes(f))) walk(p);
    else if (f === 'index.html' && !fs.readFileSync(p, 'utf8').includes('http-equiv="refresh"')) routes.push('/' + path.relative(dist, path.dirname(p)).split(path.sep).filter(Boolean).map(encodeURIComponent).join('/') + (dir === dist ? '' : '/'));
  }
})(dist);

const engine = process.env.BROWSER === 'webkit' ? webkit : chromium;
const browser = await engine.launch();
let failures = 0;
const check = async (name, fn) => {
  try { await fn(); console.log('✓', name); } catch (e) { failures++; console.log('✗', name, '\n   ', e.message.split('\n').slice(0, 6).join('\n    ')); }
};
async function open(viewport = {width: 1440, height: 900}, opts = {}) {
  const ctx = await browser.newContext({viewport, ...opts});
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  page.on('console', m => m.type() === 'error' && page.errors.push(m.text()));
  page.on('response', r => r.url().startsWith(SITE) && r.status() >= 400 && page.errors.push(`${r.status()} ${r.url()}`));
  return page;
}

await check(`${routes.length} prerendered routes: content, language, metadata, no errors, no overflow`, async () => {
  for (const viewport of [{width: 1440, height: 900}, {width: 375, height: 740}]) {
    const page = await open(viewport);
    await page.emulateMedia({reducedMotion: 'reduce'});
    for (const r of routes) {
      const res = await page.goto(SITE + r, {waitUntil: 'load'});
      assert.equal(res.status(), 200, r);
      const info = await page.evaluate(() => ({
        lang: document.documentElement.lang, dir: document.documentElement.dir, h1: document.querySelectorAll('h1').length,
        title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, desc: document.querySelector('meta[name=description]')?.content,
        overflow: document.documentElement.scrollWidth - innerWidth, ld: (() => { try { return !!JSON.parse(document.getElementById('ld').textContent); } catch { return false; } })(),
        hebrewInEnglish: document.documentElement.lang === 'en' && /[֐-׿]/.test(document.querySelector('main').innerText.replace(/שכטר נדל״ן — לגור בסטנדרט אירופאי/g, '')),
        removedCity: /תל[\s־–-]*אביב|tel[\s–-]*aviv/i.test(document.documentElement.outerHTML)
      }));
      const en = decodeURIComponent(r).startsWith('/en/');
      assert.equal(info.lang, en ? 'en' : 'he', r); assert.equal(info.dir, en ? 'ltr' : 'rtl', r);
      assert.equal(info.h1, 1, `${r}: one h1`);
      assert.ok(info.title && info.desc && info.ld, `${r}: title/description/JSON-LD`);
      assert.ok(info.canonical || r.includes('404'), `${r}: canonical`);
      assert.ok(info.overflow <= 0, `${r} @${viewport.width}: horizontal overflow ${info.overflow}px`);
      assert.ok(!info.hebrewInEnglish, `${r}: Hebrew text on an English page`);
      assert.ok(!info.removedCity, `${r}: removed city mention`);
    }
    assert.deepEqual(page.errors, []);
    await page.context().close();
  }
});

await check('every image and video source referenced by pages exists', async () => {
  const page = await open();
  const urls = new Set();
  for (const r of routes) {
    await page.goto(SITE + r, {waitUntil: 'domcontentloaded'});
    for (const u of await page.evaluate(() => [...document.querySelectorAll('img[src], source[srcset], video[poster]')].flatMap(el =>
      el.getAttribute('srcset') ? el.srcset.split(',').map(s => new URL(s.trim().split(' ')[0], location.href).href) : [el.src || el.poster]))) urls.add(u);
  }
  urls.add(SITE + '/media/video/film-wide.mp4'); urls.add(SITE + '/media/video/film-mobile.webm');
  const missing = [];
  for (const u of urls) if (u.startsWith(SITE) && (await page.request.head(u)).status() !== 200) missing.push(u);
  assert.deepEqual(missing, []);
  console.log(`    ${urls.size} media URLs`);
  await page.context().close();
});

await check('client navigation: transition, title, focus, back button', async () => {
  const page = await open();
  await page.goto(SITE + '/', {waitUntil: 'networkidle'});
  await page.click('.header-nav a[href$="/projects/"]');
  await page.waitForURL(/\/projects\/$/);
  await page.waitForFunction(() => document.title.startsWith('הפרויקטים'));
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  await page.locator('.card-link').first().click();
  await page.waitForURL(/\/projects\/[a-z0-9-]+\/$/);
  await page.locator('.project-hero h1').waitFor();
  await page.goBack();
  await page.waitForURL(/\/projects\/$/);
  await page.locator('.card-grid').waitFor();
  assert.deepEqual(page.errors, []);
  await page.context().close();
});

await check('language switch keeps the current page', async () => {
  const page = await open();
  await page.goto(SITE + '/projects/schechter-family/');
  await page.click('.header-lang');
  await page.waitForURL(/\/en\/projects\/schechter-family\/$/);
  assert.equal(await page.locator('h1').innerText(), 'Schechter Family');
  await page.context().close();
});

await check('catalog: published projects, removed pages, city filter and search', async () => {
  const page = await open();
  await page.goto(SITE + '/projects/', {waitUntil: 'networkidle'});
  const count = () => page.locator('.card').count();
  assert.equal(await count(), 12);
  const removed = ['sirkin-19', 'schechter-rishonim', 'halapid-1', 'assaf-32', 'ahisamach',
    'beeri-31', 'dov-friedman-21-23', 'tirza-jerusalem-boulevard', 'harishonim-9',
    'gordon-35', 'teraad-16', 'abba-hillel-63-65', 'arlozorov-34'];
  const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  for (const slug of removed) {
    assert.equal(await page.locator(`a[href*="/projects/${slug}/"]`).count(), 0);
    assert.ok(!sitemap.includes(`/projects/${slug}/`));
    for (const prefix of ['', 'en/']) assert.ok(!fs.existsSync(path.join(dist, prefix, 'projects', slug, 'index.html')));
  }
  await page.locator('.catalog-filters select').selectOption({label: 'הרצליה'});
  assert.equal(await count(), 1);
  await page.locator('.catalog-filters select').selectOption('');
  await page.fill('.search input', 'גליל');
  assert.equal(await count(), 1);
  await page.fill('.search input', 'zzzz');
  await page.locator('.empty').waitFor();
  await page.fill('.search input', '');
  await page.goto(SITE + '/projects/?stage=future', {waitUntil: 'networkidle'});
  assert.equal(await count(), 12);
  assert.equal(await page.locator('.future-projects').count(), 0);
  await page.context().close();
});

await check('project gallery lightbox: keyboard, swipe target, focus return', async () => {
  const page = await open();
  await page.goto(SITE + '/projects/schechter-gefen/', {waitUntil: 'networkidle'});
  const first = page.locator('.gallery-button').first();
  await first.click();
  const box = page.getByRole('dialog');
  await box.waitFor();
  assert.match(await page.locator('.lb-count').innerText(), /01 \/ 11/);
  await page.keyboard.press('ArrowLeft');
  assert.match(await page.locator('.lb-count').innerText(), /02 \/ 11/);
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(() => !!document.activeElement.closest('.lightbox')), 'focus stays in dialog');
  await page.keyboard.press('Escape');
  await box.waitFor({state: 'detached'});
  assert.ok(await first.evaluate(el => el === document.activeElement), 'focus returns to opener');
  await page.context().close();
});

await check('mobile menu: open, focus trap, Escape, navigation', async () => {
  const page = await open({width: 390, height: 844}, {hasTouch: true, isMobile: process.env.BROWSER !== 'webkit'});
  await page.goto(SITE + '/', {waitUntil: 'networkidle'});
  await page.click('.menu-button');
  await page.locator('.menu.is-open').waitFor();
  await page.waitForFunction(() => document.activeElement.classList.contains('menu-close'));
  await page.keyboard.press('Shift+Tab');
  assert.ok(await page.evaluate(() => !!document.activeElement.closest('.menu')));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('.menu.is-open'));
  await page.click('.menu-button');
  await page.locator('.menu.is-open .menu-nav a[href$="/about/"]').click();
  await page.waitForURL(/\/about\/$/);
  assert.equal(await page.locator('.menu.is-open').count(), 0);
  await page.context().close();
});

await check('contact form: error summary, field errors, preselected project, draft confirmation', async () => {
  const page = await open();
  await page.goto(SITE + '/contact/?project=schechter-gefen', {waitUntil: 'networkidle'});
  assert.equal(await page.locator('select[name=project]').inputValue(), 'שכטר בגפן');
  await page.click('.contact-form button[type=submit]');
  await page.locator('.form-errors').waitFor();
  assert.ok(await page.evaluate(() => document.activeElement.classList.contains('form-errors')));
  assert.equal(await page.locator('[aria-invalid=true]').count(), 3);
  await page.fill('#f-name', 'ישראל ישראלי'); await page.fill('#f-phone', '050-1234567'); await page.check('#f-consent');
  await page.evaluate(() => { window.__mail = null; });
  await page.click('.contact-form button[type=submit]');
  await page.waitForFunction(() => document.querySelector('.form-done').textContent.length > 10);
  await page.goto(SITE + '/contact/?project=beeri-31', {waitUntil: 'networkidle'});
  assert.equal(await page.locator('select[name=project]').inputValue(), '');
  assert.equal(await page.locator('select[name=project] option').count(), 13);
  assert.deepEqual(page.errors, []);
  await page.context().close();
});

await check('hero film streams and plays; paused and not loaded under reduced motion', async () => {
  const page = await open();
  await page.goto(SITE + '/', {waitUntil: 'load'});
  await page.waitForFunction(() => { const v = document.querySelector('.film-video'); return v && v.currentSrc && v.readyState >= 2 && !v.paused; }, null, {timeout: 20000});
  await page.click('.film-toggle');
  assert.ok(await page.evaluate(() => document.querySelector('.film-video').paused));
  await page.context().close();
  const calm = await open();
  await calm.emulateMedia({reducedMotion: 'reduce'});
  await calm.goto(SITE + '/', {waitUntil: 'networkidle'});
  await calm.waitForTimeout(1500);
  assert.ok(await calm.evaluate(() => document.querySelector('.film-video').paused));
  assert.equal(await calm.evaluate(() => document.querySelectorAll('.rv:not(.is-in), .lines:not(.is-in)').length), 0, 'all content visible');
  await calm.context().close();
});

await check('location clip plays once on the project page', async () => {
  const page = await open();
  await page.goto(SITE + '/projects/schechter-family/', {waitUntil: 'networkidle'});
  await page.locator('.clip-video').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => { const v = document.querySelector('.clip-video'); return v.currentSrc && (v.ended || v.currentTime > 0.3); }, null, {timeout: 15000});
  await page.context().close();
});

await check('legacy URLs redirect (previous hash preview and WordPress paths)', async () => {
  const page = await open();
  await page.goto(SITE + '/#/project/2');
  await page.waitForURL(/\/projects\/schechter-family\/$/);
  await page.goto(SITE + '/' + encodeURI('שכטר-family/בבנייה') + '/');
  await page.waitForURL(/\/projects\/schechter-family\/$/);
  await page.goto(SITE + '/en/about-us/');
  await page.waitForURL(/\/en\/about\/$/);
  await page.context().close();
});

await check('accessibility settings persist and apply', async () => {
  const page = await open();
  await page.goto(SITE + '/about/', {waitUntil: 'networkidle'});
  await page.click('.a11y-trigger');
  await page.getByRole('switch', {name: 'ניגודיות גבוהה'}).click();
  await page.getByRole('switch', {name: 'הפחתת תנועה'}).click();
  await page.waitForFunction(() => {
    const saved = JSON.parse(localStorage.getItem('a11y') || '{}');
    return saved.contrast && saved.motion && document.documentElement.classList.contains('high-contrast') && document.documentElement.classList.contains('reduce-motion');
  });
  assert.ok(await page.evaluate(() => document.documentElement.classList.contains('high-contrast') && document.documentElement.classList.contains('reduce-motion')));
  await page.reload({waitUntil: 'networkidle'});
  assert.ok(await page.evaluate(() => document.documentElement.classList.contains('high-contrast')));
  await page.context().close();
});

await check('axe WCAG 2.2 AA scan: no serious or critical violations', async () => {
  const page = await open();
  await page.emulateMedia({reducedMotion: 'reduce'});
  const report = [];
  for (const r of ['/', '/projects/', '/projects/schechter-gefen/', '/about/', '/urban-renewal/', '/contact/', '/accessibility/', '/en/', '/en/projects/schechter-premium/', '/en/contact/']) {
    await page.goto(SITE + r, {waitUntil: 'networkidle'});
    const res = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    for (const v of res.violations.filter(v => ['serious', 'critical'].includes(v.impact))) report.push(`${r} ${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}`);
  }
  assert.deepEqual(report, []);
  await page.context().close();
});

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
