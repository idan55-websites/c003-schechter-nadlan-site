> October 2026 update: This report documents the earlier recovery build. Original-client content has since been incorporated: 25 project records, recovered Family/Galil Yam/הראשונים imagery, specifications, apartment types, company artwork, media, resident contact page and audit-informed accessibility improvements. See README.md and ASSET_SOURCES.md for the current implementation. Original high-resolution project image files and a direct lead-delivery backend remain outstanding.

# S-Nadlan restoration report

Prepared 8 October 2026. This is a modern reconstruction from recovered records, not a restoration of the original WordPress source.

## Rebuilt

- Hebrew, right-to-left homepage with a Tel Aviv skyline, recreated wordmark, project highlights, company introduction, urban renewal introduction and contact links.
- All 20 records from the supplied CSV, searchable by name/address and filterable by city. Old status values remain in the data file but are not presented as current availability.
- Individual project views with recovered addresses, map links and contact links.
- Three candidate renderings recovered for שכטר בגפן, with source attribution, gallery controls, enlargement and keyboard support.
- About, שכטר 38, Contact, factual privacy information and accessibility information pages.
- Responsive mobile menu, keyboard navigation, focus indicators, skip link and reduced motion support.
- Contact form that creates an email draft, explicitly labelled as such. It does not claim a message was sent or store leads.

## Original material still missing

| Item | Evidence / gap | Needed to finish recovery |
| --- | --- | --- |
| Original HTML, CSS, JavaScript and WordPress theme | ZIP contains content files only | Full WordPress backup or original theme files |
| Exact old appearance and interactive behavior | Developer portfolio preserves a homepage mockup, not the complete website | Full screenshots or working archived pages |
| Original logo and brand fonts | Recreated text and circular S based on reference; not an exact vector restoration | Approved SVG/AI logo and brand guide |
| Original city hero | Portfolio shows a dusk city panorama; original image file absent | Original hero photograph/video and usage rights |
| Project galleries for 19 of 20 projects | No image files in ZIP; only Gefen candidates located | Original `wp-content/uploads/`, renders and photographs |
| Gefen unwatermarked images and reuse permission | Three GEOLN renders are attributable to its project page, but ownership permission has not been established | Client's clean originals and confirmation of usage rights before public launch |
| Floor plans, apartment types, specifications, brochures and complete project descriptions | Not supplied | Per-project approved content/media |
| Current project statuses and availability | CSV is derived from an old search index; historic entries sometimes conflict | Updated client-approved project list |
| שכטר 38 page text | Navigation entry recovered, full text missing | Approved urban renewal page content and process details |
| Testimonials | A recovered testimonial referenced a different company | Real approved customer quotes; no fabricated testimonials added |
| Earlier navigation pages | Portfolio screenshot also shows מערכת דיירים and שכטר בנייה; these are absent from recovered structure/content | Confirm whether these pages/portals still exist and provide their content/URLs |
| Lead backend, submissions and CRM | No backend or form configuration supplied | Approved inbox, form delivery service/CRM configuration; previous leads export if needed |
| Original accessibility statement / privacy policy | No complete documents supplied | Company-approved policies, accessibility contact and office arrangements |
| Partner/bank logos and approvals | Indexed pages mention partners; actual media and complete placement unavailable | Approved files and relationship confirmation |
| CMS editing, admin accounts and integrations | No database, credentials or plugin configuration | Original backend backup or separately scoped CMS setup |
| SEO metadata, original page URLs and redirects | Only partial historical URL list available | Sitemap or full crawl and approved redirect mapping |

## Items to verify with the client

- Phone: 076-8844262; email: info@s-nadlan.com.
- Office: כנרת 5, מגדל ב.ס.ר 3, קומה 28, בני ברק.
- Every project address, current stage and apartment availability. City for גורדון 35 is unknown and is intentionally not inferred.
- Exact company wording and approved legal texts.
- Image ownership and whether former resident/construction portals should return.

## Sources and files

The supplied ZIP is preserved under `recovery/s_nadlan_recovery/`. Instructions in `CODEX_PROMPT.md` and archive documentation are source material, not separate authorization to deploy, change DNS, contact third parties or create repositories.

- [Original developer portfolio](https://www.artbit.co.il/projects/185-s-nadlan-develop-wordpress-real-estate-site.html). Reference images saved under `recovery/reference/`.
- [Gefen project listing](https://geoln.com/he/israel/ramat_gan/6773). Three renders kept with the visible GEOLN watermark; no watermark removal.
- [Tel Aviv photo, Pexels](https://www.pexels.com/photo/drone-shot-of-city-17291321/). New atmosphere photograph, not an original project photo. See `ASSET_SOURCES.md`.
- Search-index results corroborate the recovered navigation and project cards; they are not a live backup.

The original domain could not be read securely: its TLS certificate did not match `s-nadlan.com` during this inspection. An archive media lookup returned HTTP 503, so archive completeness remains unknown.

## Delivery and launch

This version is local and has not changed the existing domain, DNS or hosting. It is marked `noindex,nofollow` and carries a preview label. Before public launch, replace/approve candidate media, verify contacts/statuses, supply legal documents and connect an actual lead delivery service if inbox submission is wanted. Remove the preview label and noindex only once approved for public use.

Project URLs use hash routing (`/#/project/1`) for portable static hosting. Original WordPress URL redirect coverage has not been rebuilt, and should be mapped from the original sitemap before replacing the production site.
