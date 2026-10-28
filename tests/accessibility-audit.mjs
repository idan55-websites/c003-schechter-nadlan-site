import {chromium, webkit} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const site = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
const phase = process.env.AUDIT_PHASE || 'current';
const dir = 'audits/2026-10-29/accessibility-review';
fs.mkdirSync(dir, {recursive: true});
const routes = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, {withFileTypes: true})) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory() && !['assets', 'media', 'fonts'].includes(entry.name)) walk(file);
    else if (entry.name === 'index.html' && !fs.readFileSync(file, 'utf8').includes('http-equiv="refresh"')) {
      const relative = path.relative('dist', path.dirname(file));
      routes.push('/' + (relative ? relative + '/' : ''));
    }
  }
}
walk('dist');
const engine = process.env.BROWSER === 'webkit' ? webkit : chromium;
const browser = await engine.launch();
const report = {phase, engine: engine.name(), site, date: new Date().toISOString(), pages: [], layouts: [], states: []};
const checkpoint = () => fs.writeFileSync(`${dir}/${phase}-${engine.name()}.json`, JSON.stringify(report, null, 2) + '\n');
const summarize = result => ({
  violations: result.violations.map(({id, impact, help, helpUrl, tags, nodes}) => ({id, impact, help, helpUrl, tags,
    nodes: nodes.map(({target, failureSummary}) => ({target, failureSummary}))})),
  incomplete: result.incomplete.map(({id, impact, nodes}) => ({id, impact, targets: nodes.map(n => n.target)})),
  passes: result.passes.map(x => x.id)
});
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
for (const width of [1440, 375]) {
  const context = await browser.newContext({viewport: {width, height: 900}, reducedMotion: 'reduce'});
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(site + route, {waitUntil: 'networkidle'});
    const result = summarize(await new AxeBuilder({page}).withTags(tags).analyze());
    report.pages.push({route, width, ...result});
    checkpoint();
    if (result.violations.length) console.log(width, route, result.violations.map(x => `${x.id}:${x.nodes.length}`).join(', '));
  }
  await context.close();
  console.log(`Scanned ${routes.length} routes at ${width}px`);
}
const context = await browser.newContext({viewport: {width: 320, height: 800}, reducedMotion: 'reduce'});
const page = await context.newPage();
for (const route of routes) {
  await page.goto(site + route, {waitUntil: 'networkidle'});
  for (const mode of ['reflow-320', 'text-200', 'text-spacing']) {
    await page.evaluate(mode => {
      document.getElementById('audit-spacing')?.remove();
      document.documentElement.style.fontSize = mode === 'text-200' ? '200%' : '';
      if (mode === 'text-spacing') {
        const style = document.createElement('style'); style.id = 'audit-spacing';
        style.textContent = '* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p {margin-bottom:2em!important}';
        document.head.append(style);
      }
    }, mode);
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      clipped: [...document.querySelectorAll('button, select, label, .btn, .chip, .contact-row, .index-name')].filter(el => {
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return r.width && r.height && !el.closest('[inert], [aria-hidden="true"]') &&
          ((/hidden|clip/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 2) ||
          (/hidden|clip/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2));
      }).map(el => ({tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0, 100)}))
    }));
    report.layouts.push({route, mode, width: 320, ...result});
    checkpoint();
    if (result.overflow > 0 || result.clipped.length) console.log('Layout', route, mode, JSON.stringify(result));
  }
}
await context.close();
const stateContext = await browser.newContext({viewport: {width: 375, height: 900}, reducedMotion: 'reduce'});
const states = await stateContext.newPage();
async function state(name, route, prepare) {
  await states.goto(site + route, {waitUntil: 'networkidle'}); await prepare(states);
  const result = summarize(await new AxeBuilder({page: states}).withTags(tags).analyze());
  report.states.push({name, route, ...result});
  checkpoint();
  console.log('State', name, result.violations.map(x => x.id));
}
await state('navigation dialog', '/', p => p.click('.menu-button'));
await state('gallery dialog', '/projects/schechter-gefen/', async p => { await p.locator('.gallery-button').first().click(); });
await state('form errors', '/contact/', p => p.click('.contact-form button[type=submit]'));
await state('accessibility panel', '/', p => p.click('.a11y-trigger'));
await state('high contrast', '/projects/', async p => {
  await p.click('.a11y-trigger'); await p.getByRole('switch', {name: 'ניגודיות גבוהה'}).click();
  await p.keyboard.press('Escape');
});
await stateContext.close();
await browser.close();
report.summary = {
  routeCount: routes.length, scans: report.pages.length + report.states.length,
  violations: report.pages.reduce((n, p) => n + p.violations.length, 0) + report.states.reduce((n, p) => n + p.violations.length, 0),
  layoutConcerns: report.layouts.filter(x => x.overflow > 0 || x.clipped.length).length
};
fs.writeFileSync(`${dir}/${phase}-${engine.name()}.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary));
process.exitCode = report.summary.violations || report.summary.layoutConcerns ? 1 : 0;
