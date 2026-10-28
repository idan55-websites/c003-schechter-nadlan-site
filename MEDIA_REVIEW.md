# Localhost image review — 28 October 2026

29 October 2026 update: Nofei Nehalim now uses two client-supplied 4000 × 3000 aerial photographs, with responsive variants up to 3840px. Both appear in its gallery, and the first supplies its card/header. This resolves the Nofei Nehalim limitation recorded below; current totals are 100 image records and 80 published project-gallery images.

The earlier verification established source-file matches. It did not establish that each picture was displayed at a suitable size. This follow-up addresses the local development build.

The supplied `Downloads/2022` folder contains 1,372 image files across about 174 filename families. Most extra files are thumbnail sizes, WebP copies, branding, masked crops of existing renderings or template placeholders. These are not 1,372 distinct project photographs.

## Changes

- Restored `01/תרעד-1.jpg`, Premium's evening exterior, to the Premium gallery.
- Restored `01/החיל3.png`, a HaHayil site photograph, to the HaHayil gallery. The archive identifies these as attachments to the corresponding projects (581 and 584).
- Replaced Premium's 1181px apartment interior with the sharper 1600px `01/תרעד-3.jpg` copy. The alternative facade and garden files were inspected and are smaller copies of images already used.
- Selected separate views for project cards and large headers. Large headers now use suitable wide originals where available. HaGiva's 424px tower crop no longer supplies the full-screen header or card cover.
- Contained small originals and portrait headers instead of stretching/cropping them across a full viewport. Gallery lightboxes also respect original dimensions.
- Corrected responsive source selection for `object-fit` cropping: a wide image in a tall frame can require a much larger source than the frame's CSS width suggests.
- Generated variants up to 3840px for originals large enough to support them, without upscaling. Image source hashes refresh cached URLs after a source replacement.
- Added explicit image-pending text on projects without supplied images, so deliberate gaps do not appear to be broken downloads.
- Corrected development startup: Vite's HTML comment placeholder is no longer treated as prerendered content to hydrate. Localhost now starts without the hydration recovery errors found during the image checks.

The local mapping now contains **98 images**, including **80 project-gallery images**. **95 image sources** match files in the supplied folder exactly; the other three are retained previous-build images.

## Remaining source limitations

| Project | Available source | Treatment |
| --- | --- | --- |
| Nofei Nehalim | 316 × 300 | Displayed within native limits; no larger copy found |
| Schechter Rishonim | Previous-build crop, 245 × 375 | Displayed within native limits; no verified larger project-specific source found |
| Nofei HaGiva | Tower rendering is 424 × 900 | Use the 931px aerial rendering for the cover/header; retain the tower in the gallery at a smaller size |
| HaHayil site photo | 358 × 749 | Compact gallery image and contained lightbox |

No matching project imagery could be established for 13 records: Nofei Emek HaAyalot, Beeri 31, Dov Friedman 21–23, Tirza/Jerusalem Boulevard, HaRishonim 9, Gordon 35, Tera'ad 16, Abba Hillel 63–65, Arlozorov 34, Sirkin 19, HaLapid 1, Assaf 32 and Ahisamach. The archive's urban-renewal photographs are already used in its site diary; their anonymous filenames do not establish which of these addresses they show.

More copies of a thumbnail cannot recover detail that its original lacks. Filling these remaining records accurately requires identifiable photographs/renderings of those projects.

## Verification

The production build succeeds. The full Chromium and WebKit suites pass across 70 routes at desktop/mobile sizes and 779 media URLs. Targeted localhost checks pass in Chromium and WebKit: new gallery images decode, small headers/lightboxes stay within native dimensions, Premium selects its 3840px source on a 2× display, and the sampled mobile pages have no horizontal overflow or page errors. All 98 regenerated WebP samples match their configured originals' transformations; all 754 expected image variants exist. Evidence is under `audits/2026-10-28/media-followup/`.
