// Validate the rendered crawler-facing output, without a running web server.
// Run after a preview build, or with SITE_INDEX=true after build:production.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from '@playwright/test';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const site = (process.env.VITE_SITE_URL || 'https://s-nadlan.com').replace(/\/$/, '');
const index = process.env.SITE_INDEX === 'true';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const sitemap = await page.evaluate(source => {
    const doc = new DOMParser().parseFromString(source, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error(doc.querySelector('parsererror').textContent);
    return [...doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')].map(node => ({
      url: node.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent,
      alternates: Object.fromEntries([...node.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map(link => [link.getAttribute('hreflang'), link.getAttribute('href')])),
      images: [...node.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')].map(el => el.textContent)
    }));
  }, fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8'));
  const titles = new Set(), descriptions = new Set(), imageUrls = new Set();
  assert.equal(new Set(sitemap.map(item => item.url)).size, sitemap.length, 'unique sitemap URLs');
  for (const item of sitemap) {
    assert.ok(item.url.startsWith(site + '/'), item.url);
    const relative = item.url.slice(site.length + 1);
    const hePath = relative.replace(/^en\//, '');
    const he = !relative.startsWith('en/');
    assert.deepEqual(item.alternates, {he: `${site}/${hePath}`, en: `${site}/en/${hePath}`, 'x-default': `${site}/${hePath}`});
    const html = fs.readFileSync(path.join(dist, relative, 'index.html'), 'utf8');
    const doc = await page.evaluate(source => {
      const d = new DOMParser().parseFromString(source, 'text/html');
      return {
        title: d.title, description: d.querySelector('meta[name="description"]')?.content,
        robots: d.querySelector('meta[name="robots"]')?.content,
        canonical: d.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        alternates: Object.fromEntries([...d.querySelectorAll('link[hreflang]')].map(link => [link.hreflang, link.getAttribute('href')])),
        lang: d.documentElement.lang, dir: d.documentElement.dir,
        h1Count: d.querySelectorAll('h1').length, content: d.querySelector('main')?.textContent,
        graph: JSON.parse(d.querySelector('#ld').textContent)['@graph'],
        verification: d.querySelector('meta[name="google-site-verification"]')?.content
      };
    }, html);
    assert.equal(doc.canonical, item.url);
    assert.deepEqual(doc.alternates, item.alternates);
    assert.equal(doc.lang, he ? 'he' : 'en');
    assert.equal(doc.dir, he ? 'rtl' : 'ltr');
    assert.equal(doc.h1Count, 1);
    assert.ok(doc.content?.trim().length > 100, 'content is in static HTML');
    assert.ok(doc.title && !doc.title.includes('undefined'), item.url);
    assert.ok(!titles.has(doc.title), `duplicate title: ${doc.title}`);
    assert.ok(doc.description?.length > 40 && !descriptions.has(doc.description), `missing or duplicate description: ${item.url}`);
    titles.add(doc.title); descriptions.add(doc.description);
    assert.equal(doc.robots.includes('noindex'), !index, `indexing at ${item.url}`);
    if (index && process.env.GOOGLE_SITE_VERIFICATION) assert.equal(doc.verification, process.env.GOOGLE_SITE_VERIFICATION);
    const org = doc.graph.find(node => node['@type'] === 'Organization');
    assert.ok(org?.alternateName.includes('Schechter Real Estate'));
    assert.ok(org?.contactPoint.telephone.startsWith('+972'));
    assert.ok(doc.graph.find(node => node['@id'] === item.url + '#webpage'));
    if (/(?:^|\/)projects\/[^/]+\/$/.test(relative)) {
      const project = doc.graph.find(node => node['@type'] === 'ApartmentComplex');
      assert.ok(project, item.url);
      assert.deepEqual(project.image, item.images);
      assert.ok(project.additionalProperty.some(property => /נמכרו|sold out/i.test(property.value)), 'completed project status');
    }
    if (relative.endsWith('urban-renewal/')) assert.ok(doc.graph.find(node => node['@type'] === 'Service'));
    for (const image of item.images) {
      assert.ok(image.startsWith(site + '/media/'), image);
      assert.ok(fs.existsSync(path.join(dist, image.slice(site.length + 1))), image);
      imageUrls.add(image);
    }
  }
  const notFound = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
  assert.match(notFound, /name="robots" content="noindex/);
  assert.ok(!notFound.includes('rel="canonical"'));
  const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
  assert.equal(robots.includes('Disallow: /'), !index);
  if (index) assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
  for (const name of ['nehalim-aerial-1', 'nehalim-aerial-2']) assert.ok([...imageUrls].some(url => url.includes(name)), name);
  assert.equal(sitemap.length, 44, 'only published pages in the sitemap');
  console.log(`SEO passed: ${sitemap.length} bilingual pages, ${imageUrls.size} project images, unique metadata, schema, language alternates and ${index ? 'production indexing' : 'preview noindex'}.`);
} finally {
  await browser.close();
}
