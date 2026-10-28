# שכטר נדל״ן — Schechter Real Estate website

Bilingual (Hebrew RTL / English LTR) website for Schechter Real Estate, rebuilt in October 2026 from the original WordPress site's content and media. React 19 + Vite, prerendered to static HTML for every route, with GSAP ScrollTrigger for scroll-linked motion.

- `RECOVERY_REPORT.md` — audit of the original site, what was recovered, what is missing, and items the owner must confirm (address, statuses, legal details).
- `ASSET_SOURCES.md` — provenance of every image and video.
- `deploy/README.md` — build variables, redirects and security headers for launch.

## Commands

```sh
npm install
npm run dev        # development server, http://localhost:5173
npm run build      # client build + SSR prerender of all 60 routes → dist/
npm run preview    # serve dist/ on http://localhost:4173
npm test           # end-to-end checks against the preview (BROWSER=webkit for Safari's engine)
npm run media      # regenerate public/media from recovery/wp-originals (needs the local archive)
npm run media -- --images-only  # image variants + manifest, without re-encoding videos
```

Install browsers for testing once with `npx playwright install chromium webkit`.

## Structure

| Path | Contents |
| --- | --- |
| `src/data/projects.json`, `english-data.js` | Client-confirmed project records (stage, availability, publication, specifications, apartment types) and English translations. |
| `src/data/recovered.js` | Text, galleries, architects, financing and emblems recovered from the original site, per project. |
| `src/data/projects.js` | The merged bilingual project model used everywhere. |
| `src/data/site.js` | Contact details, press archive and all interface strings (he/en). |
| `src/data/media.json` | Generated image manifest (dimensions, widths, placeholder colour, kind). |
| `src/pages/`, `src/components/` | Pages and UI. |
| `src/motion/core.js` | Reveal-on-scroll with IntersectionObserver (no library). |
| `src/motion/scenes.js` | GSAP scenes: hero film opening to full width, image parallax, layered depth, word-by-word statement, counters, cursor-following portfolio preview, custom cursor. Loaded on first interaction; never loaded with reduced motion. |
| `scripts/` | Media pipeline, prerender, WordPress redirect map. |
| `public/media/` | Generated AVIF/WebP images, posters, videos, brand files. |
| `recovery/` (not in Git) | Untouched originals from WordPress and the previous build. |

## Routes

Hebrew at `/`, English at `/en/`: home, `projects/`, `projects/<slug>/` (20 published projects), `about/`, `urban-renewal/`, `press/`, `residents/`, `contact/` (`?project=<slug>` preselects a project), `accessibility/`, `privacy/`, `sitemap/`. All 50 old WordPress URLs and the previous preview's `#/…` links redirect to their new pages.

The main portfolio and home statistics cover 12 occupied, sold-out projects. Eight future projects retain their pages in a collapsed secondary list. Per the owner's 28 October 2026 update, Sirkin 19, Schechter Rishonim, HaLapid 1, Assaf 32 and Ahisamach are unpublished (`published: false`): their archive records remain, but they have no public routes, form options or sitemap entries.

## Behaviour notes

- **Motion**: transforms, opacity and clip-path only; scrubbed by native scroll (no scroll hijacking or smooth-scroll library). Above-the-fold intros are CSS animations so they never wait for JavaScript. System reduced-motion and the on-site setting remove all motion and stop the film.
- **Video**: the hero film and location clips download only when visible, are muted and pausable, and are skipped entirely with Save-Data or on 2G connections.
- **Images**: 98 image records / 80 project-gallery images. Cards and large headers choose suitable views separately; small originals are contained at native limits. Responsive selection accounts for image cropping, with variants up to 3840px where the original supports them. `MEDIA_REVIEW.md` lists remaining gaps.
- **Contact form**: there is no server endpoint. The form validates, then opens a prepared email to info@s-nadlan.com in the visitor's mail app, and says so. Connecting a real form backend or CRM requires updating the privacy policy first.
- **Privacy**: no cookies, analytics or trackers. Accessibility preferences are kept in `localStorage`. Google Maps loads only after the visitor clicks “Show map”.
- **SEO**: unique titles/descriptions, canonical and hreflang links, Open Graph, JSON-LD (RealEstateAgent, WebSite, BreadcrumbList, ApartmentComplex, ItemList), `sitemap.xml` and `robots.txt`. The preview is `noindex`; set `SITE_INDEX=true` only for the approved launch.

## Preview deployment

Pushing `main` deploys the GitHub Pages preview (https://idan55-websites.github.io/c003-schechter-nadlan-site/) with `BASE_PATH` set by the workflow. The production domain, DNS and the existing WordPress host are unchanged.
