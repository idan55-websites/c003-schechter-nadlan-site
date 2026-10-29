# Search visibility launch — s-nadlan.com

The client selected `s-nadlan.com` as the search destination on 29 October 2026 and requested stronger Alex Shechter / אלכס שכטר visibility on 30 October. The GitHub Pages deployment is a duplicate preview with `noindex`. Production builds allow indexing by default, including the standard Cloudflare Git build command. This repository does not control domain routing or Google's cached results.

Direct checks on 30 October returned HTTPS `200` for home, contact, robots.txt and sitemap.xml, with indexing allowed and no `X-Robots-Tag: noindex` header. The earlier TLS problem was not reproduced. HTTP and `https://www.s-nadlan.com/` also returned `200` instead of redirecting to the canonical origin; complete the host consolidation below.

## Production build and publish

```sh
npm run build
npm run test:seo
```

Upload the **contents of `dist/`** to the hosting that serves `https://s-nadlan.com/`. Keep the original WordPress uploads available: external links and existing search results may still reference them. On the existing nginx host, include `deploy/nginx-redirects.conf` in the domain's server block. Other hosts must support the generated `_redirects` rules or equivalent permanent redirects. These preserve 34 legacy page paths and send `/sitemap_index.xml` and `/wp-sitemap.xml` to `/sitemap.xml`.

The production build has crawlable, static Hebrew and English pages, unique service/project/person titles and descriptions, canonical URLs, reciprocal language alternates, business/person/profile/site/page/project/service structured data, and a sitemap containing all 46 published page URLs and 80 distinct project images. Sold-out projects remain described as occupied and sold out. Unpublished project records have no public routes or sitemap entries. Nofei Nehalim consistently states approximately 100 homes in five boutique buildings in both languages, including its description and structured facts.

Alex's primary Hebrew page is `https://s-nadlan.com/alex-shechter/`; its English counterpart is `https://s-nadlan.com/en/alex-shechter/`. They have their own search titles, descriptions, reciprocal language alternates and `ProfilePage` markup. Both refer to the existing shared `https://s-nadlan.com/#alex-schechter` Person identity, whose URL now points to the Hebrew profile. The visible copy includes Alex Shechter and Alex Schechter and describes only his confirmed business contact relationship. No founder/CEO title, biography, personal photograph or external social identity is inferred. Home, about, contact, the footer and the HTML sitemap link directly to the appropriate language version. Twitter and Open Graph metadata are kept in sync on client navigation.

The original Schechter S is generated as `/favicon.ico`, 32px and 96px PNG favicons, a touch icon and a square 512px organization logo. The Hebrew homepage description is the company bio; application/site names consistently identify שכטר נדל״ן. The organization includes common Schechter/Shechter/Schachter/Shecter transliterations, and Alex Schechter has a linked Person/contact identity. These describe one real business; they do not guarantee rankings for every spelling or typo such as “nadlam”. Google does not use meta keywords, and creating repetitive typo pages would not help visitors.

After upload, check the real domain:

- `/robots.txt` returns plain text with `Allow: /` and the sitemap address; the host must not add an `X-Robots-Tag: noindex` header.
- `/sitemap.xml` returns XML. Its page and image URLs resolve on `s-nadlan.com`.
- Home, project and urban renewal pages return `200`, their canonical points to the business domain, and robots permits indexing.
- Legacy WordPress page paths return real `301` redirects and unknown URLs return a real `404`.
- Both Alex profile URLs return `200` with `ProfilePage` / `Person` markup, and the language switch preserves the profile page.
- Both language versions load and the new Nofei Nehalim photographs display.
- `/favicon.ico` and `/favicon-96.png` return the S logo, and the homepage source contains the Hebrew title, bio and `WebSite` name rather than “Health Tracker”.

## Search account setup

Use an owner-verified Google Search Console property for `s-nadlan.com`, submit `https://s-nadlan.com/sitemap.xml`, and request indexing for the homepage, both Alex profiles, projects page and urban renewal page using URL Inspection. Review Page Indexing and Performance after Google has recrawled. Track branded searches including `אלכס שכטר`, `אלכס שכטר נדלן`, `Alex Shechter`, `Alex Schechter` and the company name. Compare impressions, clicks and the landing pages rather than treating a single manual search as a ranking report. The sitemap is a discovery signal, not an indexing or ranking guarantee.

If using HTML-tag verification, export the exact token before building:

```sh
GOOGLE_SITE_VERIFICATION='token-from-search-console' npm run build:production
```

DNS verification can instead be performed through the domain account. `BING_SITE_VERIFICATION` supports the equivalent Bing HTML tag. Verification tags alone do not verify an account or submit a sitemap. No search account has been verified or sitemap submitted by this code change.

Maintain the existing Google Business Profile with the same business name, website, current contact number and office address confirmed by the company. Publish useful, accurate updates about actual projects and services as the company supplies them. The implementation creates no fake reviews, backlink campaigns, doorway pages or hidden keyword lists.

The GitHub preview runs `npm run build` with `SITE_INDEX=false` and remains excluded from indexing, with canonical URLs pointing to the business domain. Google needs to recrawl the production homepage before old titles and favicons can change; neither appearance nor ranking is guaranteed.

## Consolidate HTTP and www at the host

On the domain's Cloudflare zone, set a permanent redirect rule for requests to `s-nadlan.com` or `www.s-nadlan.com` when the scheme is HTTP or the hostname is `www.s-nadlan.com`. Send them to `https://s-nadlan.com` with the original path and query string, using status `301`. Enable SSL/TLS **Always Use HTTPS** if HTTP is handled separately. On nginx, use separate HTTP and HTTPS-www server blocks that return `301 https://s-nadlan.com$request_uri`.

Examples that must work after configuration:

- `http://s-nadlan.com/alex-shechter/` → `https://s-nadlan.com/alex-shechter/`
- `https://www.s-nadlan.com/en/alex-shechter/` → `https://s-nadlan.com/en/alex-shechter/`
- `https://www.s-nadlan.com/contact/?project=schechter-family` → `https://s-nadlan.com/contact/?project=schechter-family`

Keep the canonical HTTPS apex origin serving `200`. This must be configured at the host: Cloudflare Workers static `_redirects` rules do not support domain-level matching, and adding a path-only catch-all here would create a redirect loop. Existing canonical tags already identify the preferred origin, but permanent redirects reinforce that signal and avoid serving duplicate copies. Domain-account changes and Search Console submissions have not been made by this repository change.

## References

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Favicons in search results](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Search snippets and descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Image sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Profile page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Cloudflare Workers static redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)
- [Getting started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
