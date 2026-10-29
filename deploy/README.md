# Deployment notes

The site is fully static (`npm run build` → `dist/`). The client requested search visibility for `s-nadlan.com` on 29 October 2026. Publishing the indexable build there requires access to its hosting; the connected GitHub Actions workflow currently deploys only the preview. See [SEO_LAUNCH.md](SEO_LAUNCH.md).

## Build variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_PATH` | `/` | Sub-path when not served at a domain root (GitHub Pages preview uses `/c003-schechter-nadlan-site/`). |
| `VITE_SITE_URL` | `https://s-nadlan.com` | Origin for canonical URLs, hreflang, sitemap and structured data. |
| `SITE_INDEX` | `true` | Production builds allow indexing by default. Set `false` explicitly for duplicate previews. |
| `GOOGLE_SITE_VERIFICATION` | unset | Optional Search Console HTML verification token; emitted only in a production build. |
| `BING_SITE_VERIFICATION` | unset | Optional Bing Webmaster Tools HTML verification token; emitted only in a production build. |

Production: `npm run build`, then `npm run test:seo`. `build:production` also explicitly enables indexing.

## Cloudflare Workers

The root `wrangler.jsonc` deploys the prerendered `dist/` directory as static assets to the `c003-schechter-nadlan-site` Worker. Unknown URLs serve the generated `404.html` with a 404 status.

Use these Cloudflare Git build settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- `BASE_PATH`: `/` (or leave unset)

The standard Cloudflare build now allows indexing without requiring a hosting variable. Set `VITE_SITE_URL` to the production origin if it differs from `https://s-nadlan.com`. For duplicate preview deployments, explicitly set `SITE_INDEX=false`; the GitHub Pages workflow already does this.

The explicit Wrangler configuration avoids automatic Vite setup during deployment. The existing client build and build-time SSR prerender produce the complete static site; no Cloudflare Vite plugin is required. See [Cloudflare's static site configuration](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/).

To validate without publishing, run `npm run build` followed by `npx wrangler deploy --dry-run`.

## Redirects from the WordPress URLs

The build writes 34 legacy page redirects and two WordPress sitemap redirects:

- `dist/_redirects` — Netlify / Cloudflare Pages (served as real 301s).
- `deploy/nginx-redirects.conf` — `include` inside the nginx `server {}` block of the current SpinupWP/nginx host.
- Static fallback pages at every old page path (instant meta refresh + canonical) for hosts without server rules, such as GitHub Pages. The sitemap redirects require server rules and are not HTML fallback pages.

## Headers

`public/_headers` (copied to `dist/`) sets HSTS, `nosniff`, referrer policy, permissions policy, framing protection and long-lived caching for hashed assets. For nginx, the equivalent is:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options nosniff always;
add_header Referrer-Policy strict-origin-when-cross-origin always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
add_header X-Frame-Options DENY always;
add_header Content-Security-Policy "frame-ancestors 'none'; upgrade-insecure-requests" always;
location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
location /media/  { add_header Cache-Control "public, max-age=2592000"; }
gzip on; gzip_types text/css application/javascript application/json image/svg+xml; # or brotli
```

The page-level Content-Security-Policy is a `<meta>` tag inside every HTML file (scripts, styles, media and fonts from the site's own origin; Google Maps frame only after the visitor asks for it).
