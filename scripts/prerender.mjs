// Renders every route to static HTML after `vite build` + `vite build --ssr`.
// SITE_INDEX=true allows indexing (production); otherwise pages carry noindex (preview).
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {redirects} from './redirects.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const {render, routes} = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')));
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const index = process.env.SITE_INDEX === 'true';
const site = (process.env.VITE_SITE_URL || 'https://s-nadlan.com').replace(/\/$/, '');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; frame-src https://maps.google.com https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self' mailto:";

function head(meta) {
  const tags = [
    `<meta http-equiv="Content-Security-Policy" content="${csp}">`,
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${index && meta.canonical ? 'index,follow,max-image-preview:large' : 'noindex,nofollow'}">`,
    meta.canonical && `<link rel="canonical" href="${meta.canonical}">`,
    meta.alternates && `<link rel="alternate" hreflang="he" href="${meta.alternates.he}">`,
    meta.alternates && `<link rel="alternate" hreflang="en" href="${meta.alternates.en}">`,
    meta.alternates && `<link rel="alternate" hreflang="x-default" href="${meta.alternates.he}">`,
    `<meta property="og:type" content="website">`, `<meta property="og:site_name" content="שכטר נדל״ן">`,
    `<meta property="og:title" content="${esc(meta.title)}">`, `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:image" content="${meta.image}">`, `<meta property="og:locale" content="${meta.lang === 'he' ? 'he_IL' : 'en_US'}">`,
    meta.canonical && `<meta property="og:url" content="${meta.canonical}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script type="application/ld+json" id="ld">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`
  ];
  return tags.filter(Boolean).join('\n');
}
function page(route) {
  const {html, meta} = render(route);
  const tpl = meta.lang === 'en' ? template.replace(/(frank-ruhl|heebo)-hebrew\.woff2/g, '$1-latin.woff2') : template;
  return tpl.replace('<html lang="he" dir="rtl">', `<html lang="${meta.lang}" dir="${meta.dir}">`).replace('<!--head-->', head(meta)).replace('<!--app-->', html);
}
const write = (rel, content) => { const file = path.join(dist, rel); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, content); };

const all = routes();
for (const route of all) write(path.join(route.slice(base.length), 'index.html'), page(route));
write('404.html', page(base + '404/'));

// sitemap.xml with hreflang pairs, robots.txt.
const urls = all.filter(r => !r.startsWith(base + 'en/'));
const abs = r => site + '/' + r.slice(base.length);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.flatMap(r => { const en = base + 'en/' + r.slice(base.length); return [r, en].map(u => `<url><loc>${abs(u)}</loc><xhtml:link rel="alternate" hreflang="he" href="${abs(r)}"/><xhtml:link rel="alternate" hreflang="en" href="${abs(en)}"/><lastmod>2026-10-26</lastmod></url>`); }).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);
write('robots.txt', index ? `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');

// Redirects: Netlify/Cloudflare format, nginx map, and static fallback pages for hosts without server rules.
write('_redirects', redirects.map(([from, to]) => `${encodeURI(from)} ${to} 301`).join('\n') + '\n');
fs.writeFileSync(path.join(root, 'deploy/nginx-redirects.conf'), '# Include inside the server block of the production nginx configuration.\n' +
  redirects.map(([from, to]) => `location = ${encodeURI(from)} { return 301 ${to}; }`).join('\n') + '\n');
for (const [from, to] of redirects) {
  const target = base + to.slice(1);
  if (fs.existsSync(path.join(dist, from, 'index.html'))) continue;
  write(path.join(from, 'index.html'), `<!doctype html><html lang="he"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${site}${to}"><meta http-equiv="refresh" content="0; url=${target}"><title>שכטר נדל״ן</title></head><body><a href="${target}">${site}${to}</a></body></html>`);
}
fs.rmSync(path.join(root, 'dist-ssr'), {recursive: true, force: true});
console.log(`prerendered ${all.length} routes, ${redirects.length} redirects, indexing ${index ? 'on' : 'off'}`);
