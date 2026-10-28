# Deployment notes

The site is fully static (`npm run build` → `dist/`). Nothing here changes DNS or the live server; these are the settings to apply when the owner approves launch.

## Build variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_PATH` | `/` | Sub-path when not served at a domain root (GitHub Pages preview uses `/c003-schechter-nadlan-site/`). |
| `VITE_SITE_URL` | `https://s-nadlan.com` | Origin for canonical URLs, hreflang, sitemap and structured data. |
| `SITE_INDEX` | unset | Set to `true` **only for the approved production launch**. Otherwise every page is `noindex` and `robots.txt` disallows crawling. |

Production: `SITE_INDEX=true npm run build`.

## Redirects from the WordPress URLs

The build writes the same 50 permanent redirects in three forms:

- `dist/_redirects` — Netlify / Cloudflare Pages (served as real 301s).
- `deploy/nginx-redirects.conf` — `include` inside the nginx `server {}` block of the current SpinupWP/nginx host.
- Static fallback pages at every old path (instant meta refresh + canonical) for hosts without server rules, such as GitHub Pages.

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
