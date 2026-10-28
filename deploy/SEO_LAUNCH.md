# Search visibility launch — s-nadlan.com

The client selected `s-nadlan.com` as the search destination on 29 October 2026. The live domain still serves WordPress; the rebuilt site is currently a separate GitHub Pages preview with `noindex`. At inspection, the live `/robots.txt` and `/sitemap_index.xml` returned HTML rather than crawler files. Editing this repository alone does not fix those live responses.

## Production build and publish

```sh
npm run build:production
SITE_INDEX=true npm run test:seo
```

Upload the **contents of `dist/`** to the hosting that serves `https://s-nadlan.com/`. Keep the original WordPress uploads available: external links and existing search results may still reference them. On the existing nginx host, include `deploy/nginx-redirects.conf` in the domain's server block. Other hosts must support the generated `_redirects` rules or equivalent permanent redirects. These preserve 34 legacy page paths and send `/sitemap_index.xml` and `/wp-sitemap.xml` to `/sitemap.xml`.

The production build has crawlable, static Hebrew and English pages, unique service/project titles and descriptions, canonical URLs, reciprocal language alternates, business/site/page/project/service structured data, and a sitemap containing all 44 published page URLs and 80 distinct project images. Sold-out projects remain described as occupied and sold out. Unpublished project records have no public routes or sitemap entries.

After upload, check the real domain:

- `/robots.txt` returns plain text with `Allow: /` and the sitemap address; the host must not add an `X-Robots-Tag: noindex` header.
- `/sitemap.xml` returns XML. Its page and image URLs resolve on `s-nadlan.com`.
- Home, project and urban renewal pages return `200`, their canonical points to the business domain, and robots permits indexing.
- Legacy WordPress page paths return real `301` redirects and unknown URLs return a real `404`.
- Both language versions load and the new Nofei Nehalim photographs display.

## Search account setup

Use an owner-verified Google Search Console property for `s-nadlan.com`, submit `https://s-nadlan.com/sitemap.xml`, and request indexing for the homepage, projects page and urban renewal page using URL Inspection. Review Page Indexing and Performance after Google has recrawled. The sitemap is a discovery signal, not an indexing or ranking guarantee.

If using HTML-tag verification, export the exact token before building:

```sh
GOOGLE_SITE_VERIFICATION='token-from-search-console' npm run build:production
```

DNS verification can instead be performed through the domain account. `BING_SITE_VERIFICATION` supports the equivalent Bing HTML tag. Verification tags alone do not verify an account or submit a sitemap. No search account has been verified or sitemap submitted by this code change.

Maintain the existing Google Business Profile with the same business name, website, current contact number and office address confirmed by the company. Publish useful, accurate updates about actual projects and services as the company supplies them. The implementation creates no fake reviews, backlink campaigns, doorway pages or hidden keyword lists.

The GitHub preview continues to use the regular `npm run build` command and remains excluded from indexing, with canonical URLs pointing to the business domain.

## References

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Image sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Getting started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
