import {chromium, webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const site = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
const output = 'audits/2026-10-29/accessibility-review';
fs.mkdirSync(output, {recursive: true});
const engines = process.env.BROWSER ? [process.env.BROWSER === 'webkit' ? webkit : chromium] : [chromium, webkit];
let failures = 0;
for (const engine of engines) {
  const browser = await engine.launch();
  const results = [];
  async function check(name, run, options = {}) {
    const context = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce', ...options});
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    try {
      const evidence = await run(page, context);
      assert.deepEqual(errors, []);
      results.push({name, passed: true, evidence}); console.log('✓', engine.name(), name);
    } catch (error) {
      failures++; results.push({name, passed: false, error: error.stack}); console.log('✗', engine.name(), name, error.message);
    } finally { await context.close(); }
  }
  await check('skip link and hidden header keyboard focus', async page => {
    await page.goto(site + '/about/', {waitUntil: 'networkidle'});
    await page.keyboard.press(engine === webkit ? 'Alt+Tab' : 'Tab'); assert.equal(await page.evaluate(() => document.activeElement.className), 'skip');
    await page.keyboard.press('Enter'); assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForFunction(() => document.querySelector('.site-header').classList.contains('is-hidden'));
    await page.locator('.header-lang').focus();
    const bounds = await page.locator('.header-lang').boundingBox(); assert.ok(bounds.y >= 0);
    return {headerFocusTop: bounds.y};
  });
  await check('gallery isolates background and restores focus', async page => {
    await page.goto(site + '/projects/schechter-gefen/', {waitUntil: 'networkidle'});
    const opener = page.locator('.gallery-button').first(); await opener.click();
    await page.getByRole('dialog').waitFor();
    assert.ok(await page.locator('.site-header').evaluate(el => el.inert));
    assert.ok(await page.locator('.a11y').evaluate(el => el.inert));
    for (const key of ['Tab', 'Tab', 'Shift+Tab', 'Tab', 'Tab']) {
      await page.keyboard.press(key); assert.ok(await page.evaluate(() => !!document.activeElement.closest('.lightbox')));
    }
    const tree = await page.getByRole('dialog').ariaSnapshot();
    await page.keyboard.press('Escape');
    assert.ok(await opener.evaluate(el => el === document.activeElement));
    assert.ok(!await page.locator('.site-header').evaluate(el => el.inert));
    assert.ok(!await page.locator('.a11y').evaluate(el => el.inert));
    return {dialogTree: tree};
  });
  await check('mobile navigation isolates all background controls', async page => {
    await page.goto(site + '/', {waitUntil: 'networkidle'}); await page.click('.menu-button');
    await page.waitForFunction(() => document.activeElement.classList.contains('menu-close'));
    assert.ok(await page.locator('main').evaluate(el => el.inert));
    assert.ok(await page.locator('.a11y').evaluate(el => el.inert));
    assert.ok(await page.locator('.skip').evaluate(el => el.inert));
    await page.keyboard.press('Shift+Tab'); assert.ok(await page.evaluate(() => !!document.activeElement.closest('.menu')));
    await page.keyboard.press('Escape');
    assert.ok(await page.evaluate(() => document.activeElement.classList.contains('menu-button')));
    return {backgroundIsolated: true};
  }, {viewport: {width: 320, height: 640}});
  await check('required fields and error links expose their state', async page => {
    await page.goto(site + '/contact/', {waitUntil: 'networkidle'});
    assert.ok(await page.locator('#f-consent').evaluate(el => el.required));
    await page.click('.contact-form button[type=submit]');
    assert.ok(await page.evaluate(() => document.activeElement.classList.contains('form-errors')));
    await page.locator('.form-errors a').first().click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'f-name');
    return {formTree: await page.locator('.contact-form').ariaSnapshot()};
  });
  await check('preferences survive reload without a contrast flash', async page => {
    await page.goto(site + '/about/', {waitUntil: 'networkidle'});
    await page.click('.a11y-trigger'); await page.getByRole('switch', {name: 'ניגודיות גבוהה'}).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('a11y') || '{}').contrast);
    await page.addInitScript(() => {
      window.__contrastFlash = []; let seen = false;
      new MutationObserver(() => {
        const enabled = document.documentElement?.classList.contains('high-contrast');
        if (seen && !enabled) window.__contrastFlash.push('contrast removed');
        if (enabled) seen = true;
      }).observe(document, {subtree: true, childList: true, attributes: true, attributeFilter: ['class']});
    });
    await page.reload({waitUntil: 'networkidle'});
    assert.ok(await page.evaluate(() => document.documentElement.classList.contains('high-contrast')));
    assert.deepEqual(await page.evaluate(() => window.__contrastFlash), []);
    return {contrastFlash: []};
  });
  await check('movie pause and live reduced-motion preferences', async page => {
    await page.goto(site + '/', {waitUntil: 'networkidle'});
    await page.locator('.film-video').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const v = document.querySelector('.film-video'); return v && v.currentTime > .2 && !v.paused; }, null, {timeout: 20000});
    await page.click('.film-toggle'); await page.waitForFunction(() => document.querySelector('.film-video').paused);
    await page.click('.film-toggle'); await page.waitForFunction(() => !document.querySelector('.film-video').paused);
    await page.click('.a11y-trigger'); await page.getByRole('switch', {name: 'הפחתת תנועה'}).click();
    await page.waitForFunction(() => document.documentElement.classList.contains('reduce-motion') && document.querySelector('.film-video').paused);
    await page.getByRole('switch', {name: 'הפחתת תנועה'}).click(); await page.keyboard.press('Escape');
    await page.click('.film-toggle'); await page.waitForFunction(() => !document.querySelector('.film-video').paused);
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.waitForFunction(() => document.documentElement.classList.contains('reduce-motion') && document.querySelector('.film-video').paused);
    return {toolbarAndSystemPreferencesStopPlayback: true};
  }, {reducedMotion: 'no-preference'});
  await check('200% text keeps header controls on screen', async page => {
    const records = [];
    for (const lang of ['', 'en/']) {
      await page.goto(site + '/' + lang + 'about/', {waitUntil: 'networkidle'});
      for (const width of [1440, 1024, 640, 375, 320]) {
        await page.setViewportSize({width, height: 900});
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; window.scrollTo(0, 0); });
        const outside = await page.evaluate(() => [...document.querySelectorAll('.site-header a,.site-header button')].filter(el => {
          const r = el.getBoundingClientRect(); return r.width && r.height && (r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > document.querySelector('.site-header').getBoundingClientRect().bottom + 1);
        }).map(el => el.textContent.trim()));
        assert.deepEqual(outside, [], `${lang} ${width}px header`); records.push({lang, width, outside});
      }
    }
    await page.setViewportSize({width: 320, height: 568}); await page.click('.a11y-trigger');
    const panel = await page.locator('.a11y-panel').boundingBox(); assert.ok(panel.y >= 0 && panel.y + panel.height <= 568);
    return records;
  });
  await check('no-JavaScript contact fallback avoids HTTP personal-data submission', async page => {
    const requests = []; page.on('request', request => { if (request.url().startsWith(site)) requests.push({url: request.url(), method: request.method(), postData: request.postData()}); });
    await page.goto(site + '/contact/', {waitUntil: 'networkidle'});
    assert.equal(await page.locator('form').getAttribute('method'), 'post');
    assert.equal(await page.locator('form').getAttribute('action'), 'mailto:info@s-nadlan.com');
    await page.fill('#f-name', 'Accessibility Test'); await page.fill('#f-phone', '0501234567'); await page.check('#f-consent');
    await page.click('.contact-form button[type=submit]', {noWaitAfter: true});
    assert.equal(new URL(page.url()).search, '');
    assert.ok(!requests.some(request => request.method !== 'GET' || /Accessibility.Test|0501234567/.test(request.url)));
    return {formAction: 'mailto:info@s-nadlan.com', noHttpPersonalData: true};
  }, {javaScriptEnabled: false});
  await browser.close();
  fs.writeFileSync(`${output}/behavior-${engine.name()}.json`, JSON.stringify({engine: engine.name(), date: new Date().toISOString(), site, results}, null, 2) + '\n');
}
process.exitCode = failures ? 1 : 0;
