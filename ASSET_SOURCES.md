# Media provenance

Every web image, emblem and video is derived by `npm run media` (`scripts/build-media.mjs`, mapping in `scripts/media.config.mjs`) from the untouched originals in `recovery/wp-originals/` — the media library of the original WordPress site, downloaded on 26 October 2026 — or, where marked, from photographs the client supplied directly for the previous build (`recovery/previous-build-images/`).

- Images: AVIF + WebP at 480/800/1200/1600/2400/3200/3840 px, never upscaled beyond the original. Each record in `src/data/media.json` keeps its kind (rendering, interior rendering, photograph, site photograph), which is shown as a caption on the site.
- Videos: H.264 MP4 + VP9 WebM, muted, bitrate-capped, `+faststart`, with AVIF/WebP posters.
- No AI-generated or stock imagery is used. No watermarks were removed (the watermarked GEOLN renders were dropped and replaced by clean originals).
- Brand: `media/brand/logo-dark.png` / `logo-light.png` are the original logo files (`2022/01/לוגו.png`, 1019 px, and `2022/01/w@3x.png`, 489 px, from the client's local uploads folder, archived in `recovery/wp-originals/local-2022/`); `s-mark.png` is the original S mark (WP #3658) converted to an alpha mask; favicons and the social card (`og-image.jpg`, original Galil Yam rendering + original white logo) are generated from them.
- Fonts: Frank Ruhl Libre and Heebo (SIL Open Font License, licences in `public/fonts/`), self-hosted variable WOFF2 subsets.

| Web asset | Kind | Max width | Original source |
| --- | --- | --- | --- |
| gefen-facade | render | 1134px | WP #942 (filename double-encoded on server) |
| gefen-northeast | render | 2041px | WP #684 `2022/01/Cam1-north-east.jpg` |
| gefen-street | render | 2400px | WP #685 `2022/01/cam05POST.jpg` |
| gefen-living | interior | 1600px | WP #676 `2022/01/גפן1.jpg` |
| gefen-duplex-1 | interior | 2000px | WP #682 `2022/01/Duplex01_32.jpg` |
| gefen-duplex-2 | interior | 2000px | WP #681 `2022/01/Duplex01_33.jpg` |
| gefen-duplex-3 | interior | 2000px | WP #680 `2022/01/Duplex02_37.jpg` |
| gefen-duplex-4 | interior | 2000px | WP #679 `2022/01/Duplex02_38.jpg` |
| gefen-duplex-5 | interior | 1500px | WP #683 `2022/01/duplex_03_28.jpg` |
| gefen-typical-a | interior | 1500px | WP #678 `2022/01/TYPICAL_A_PR_022.jpg` |
| gefen-typical-b | interior | 1500px | WP #677 `2022/01/TYPICAL_B_PR_022.jpg` |
| family-day | render | 850px | WP #957 `2022/01/HM_-_day_-_print-השר-משה.jpg` |
| family-night | render | 850px | WP #958 `2022/01/HM_-_night_-_printהשר-משה.jpg` |
| family-site-1 | photo | 900px | WP #710 `2022/01/השר-משה-1.jpg` |
| family-site-2 | photo | 900px | WP #711 `2022/01/השר-משה-2.jpg` |
| family-street | render | 1800px | WP #713 `2022/01/השר-משה-4.jpg` |
| family-aerial | render | 1243px | WP #712 `2022/01/השר-משה-3.jpg` |
| family-courtyard | render | 940px | WP #714 `2022/01/השר-משה-23-חצר.jpg` |
| family-kitchen | interior | 940px | WP #715 `2022/01/השר-משה-מטבח-סלון.jpg` |
| family-balcony-1 | interior | 940px | WP #716 `2022/01/השר-משה-מרפסת.jpg` |
| family-balcony-2 | interior | 940px | WP #717 `2022/01/השר-משה-מרפסת-1.jpg` |
| family-living-1 | interior | 1800px | WP #708 `2022/01/השר-משה.jpg` |
| family-living-2 | interior | 1800px | WP #709 `2022/01/השר-משה2.jpg` |
| gordon-facade | render | 1134px | WP #931 `2022/01/גורדון-33.jpg` |
| gordon-penthouse | render | 3000px | WP #935 `2022/01/גורדון-penthouse-2.jpg-33-_.jpg (unscaled original)` |
| gordon-lobby | interior | 1134px | WP #932 `2022/01/גורדון-33-lobby-2.jpg` |
| gordon-view | render | 1417px | WP #933 (filename double-encoded on server) |
| abigail-night | render | 1134px | WP #937 `2022/01/c1_night_Final.jpg` |
| abigail-day | render | 1134px | WP #939 `2022/01/c1_.jpg` |
| abigail-living-wide | interior | 3840px | WP #688 `2022/01/app2-06אביגיל.jpg (unscaled original)` |
| abigail-living | interior | 1417px | WP #940 `2022/01/app2-02אביגיל.jpg` |
| abigail-interior-1 | interior | 1800px | WP #691 `2022/01/אביגיל-1.jpg` |
| abigail-interior-2 | interior | 1800px | WP #690 `2022/01/אביגיל6.jpg` |
| abigail-interior-3 | interior | 1800px | WP #689 `2022/01/אביגיל5.jpg` |
| knafei-facade | render | 3375px | WP #968 `2022/01/Kenfey_-_V1_-_2_-_Print-כנפש.jpg (unscaled original)` |
| knafei-garden | render | 3000px | WP #673 `2022/01/view-3-gardenכנפש.jpg (unscaled original)` |
| knafei-site | photo | 768px | WP #534 `2022/01/כנפי-נשרים-1.jpg` |
| knafei-living | interior | 1584px | WP #535 `2022/01/כנפש1.jpg` |
| knafei-balcony | interior | 1800px | WP #536 `2022/01/כנפש-2.jpg` |
| galil-yam-facade | render | 1134px | WP #960 `2022/01/view_1_-_without_people_-_print.jpg` |
| galil-yam-garden | render | 1134px | WP #962 `2022/01/view_3-without_people_-_print.jpg` |
| galil-yam-garden-people | render | 1134px | WP #963 `2022/01/view_3-_people_-_print.jpg` |
| galil-yam-evening | render | 945px | WP #961 `2022/01/view_5_-people_-_print.jpg` |
| galil-yam-terraces | render | 1276px | WP #964 `2022/01/view_2_-_no_pool_-_print-1.jpg` |
| galil-yam-courtyard | render | 1134px | WP #965 `2022/01/גליל-ים.jpg` |
| galil-yam-site-1 | photo | 828px | client-supplied (previous build) `galil-yam-site-1.webp` |
| galil-yam-site-2 | photo | 900px | client-supplied (previous build) `galil-yam-site-2.webp` |
| premium-facade | render | 3750px | WP #697 `2022/01/Tarad-10-V1-Print.jpg (unscaled original)` |
| premium-garden | render | 3840px | WP #947 (filename double-encoded on server) |
| premium-penthouse | interior | 1181px | WP #946 (filename double-encoded on server) |
| premium-typical | interior | 1600px | WP #953 `2022/01/תרעד-3.jpg` (larger copy of WP #945) |
| premium-evening | render | 750px | WP #955 `2022/01/תרעד-1.jpg` |
| premium-lobby | interior | 1800px | WP #951 `2022/01/תרעד-5.jpg` |
| premium-street | render | 750px | WP #949 `2022/01/תרעד-7.jpg` |
| premium-aerial-1 | render | 1201px | WP #950 `2022/01/תרעד-6.jpg` |
| premium-aerial-2 | render | 1000px | WP #954 `2022/01/תרעד2.jpg` |
| premium-site | construction-photo | 1200px | WP #948 `2022/01/תרעד-10.jpg` |
| hahayil-facade | render | 1953px | WP #665 `2022/01/v3.jpg` |
| hahayil-street | render | 1952px | WP #667 `2022/01/view-1-12.jpg` |
| hahayil-living-1 | interior | 1800px | WP #668 `2022/01/החיל1.jpg` |
| hahayil-living-2 | interior | 1800px | WP #669 `2022/01/החיל2.jpg` |
| hahayil-site | construction-photo | 358px | WP #670 `2022/01/החיל3.png` |
| hagiva-tower | render | 424px | WP #720 `2022/01/גבעת-אבהבה3.jpg` |
| hagiva-aerial | render | 931px | WP #723 `2022/01/גבעת-אבהבה1.jpg` |
| hagiva-salon | interior | 3840px | WP #722 `2022/01/salon_tipoosh_zavit2_2גבעת-אהבה.jpg (unscaled original)` |
| hagiva-living | interior | 1800px | WP #725 `2022/01/גבעת-אהבה-4.jpg` |
| hagiva-penthouse | interior | 1600px | WP #721 `2022/01/penthouse-כנפש.jpg` |
| hagiva-site-1 | photo | 768px | WP #726 `2022/01/גבעת-אהבה-רחובות.jpg` |
| hagiva-site-2 | photo | 768px | WP #727 `2022/01/עותק-של-גבעת-אהבה-רחובות.jpg2_.jpg` |
| dunash-facade | render | 1738px | WP #650 `2022/01/דונש1.jpg` |
| dunash-street | render | 1080px | WP #654 `2022/01/דונש3.jpg` |
| dunash-aerial | render | 1000px | WP #656 `2022/01/דונש5.jpg` |
| dunash-aerial-2 | render | 2463px | WP #652 `2022/01/דונש2.jpg` |
| dunash-site-1 | photo | 900px | WP #651 `2022/01/PHOTO-דונש.jpg` |
| dunash-site-2 | photo | 900px | WP #653 `2022/01/דונש2-1.jpg` |
| dunash-living | interior | 1000px | WP #655 `2022/01/דונש4.jpg` |
| dunash-interior-1 | interior | 1920px | WP #657 `2022/01/דונש6.jpg` |
| dunash-interior-2 | interior | 1000px | WP #658 `2022/01/דונש7.jpg` |
| nehalim-aerial-1 | photo | 3840px | client-supplied 29 October 2026, `2022/01/DJI_0862נופי נחלים.jpg` (4000 × 3000 original, archived as `local-2022/nehalim-aerial-1.jpg`) |
| nehalim-aerial-2 | photo | 3840px | client-supplied 29 October 2026, `2022/01/DJI_0871נופי נחלים .jpg` (4000 × 3000 original, archived as `local-2022/nehalim-aerial-2.jpg`) |
| nehalim-site | photo | 316px | WP #2951 `2022/01/Copy-of-נוף-נחלים.jpeg` |
| rishonim-render | render | 245px | client-supplied (previous build) `rishonim-render.webp` |
| urban-site-01 | construction-photo | 1280px | WP #2953 `2022/02/8fed0fc4-82a6-4e40-adde-501e00d9f671.jpg` |
| urban-site-02 | construction-photo | 774px | WP #2954 `2022/02/55daf23a-d68f-4ae8-95f0-6482742e19c1.jpg` |
| urban-site-03 | construction-photo | 1600px | WP #2955 `2022/02/69cfa9ef-caf0-4842-847e-e0e8e770446c.jpg` |
| urban-site-04 | construction-photo | 774px | WP #2956 `2022/02/76e613f6-3b9e-4426-8192-c5569e551cc8.jpg` |
| urban-site-05 | construction-photo | 1280px | WP #2957 `2022/02/77a21fd5-59e2-4448-85bb-5676fecb751b.jpg` |
| urban-site-06 | construction-photo | 1280px | WP #2958 `2022/02/78d62de8-f348-49c7-9552-215ca7b6f34d.jpg` |
| urban-site-07 | construction-photo | 1280px | WP #2959 `2022/02/84a98ac8-fb1e-400f-90e3-288210ea2b0e.jpg` |
| urban-site-08 | construction-photo | 1280px | WP #2960 `2022/02/483caa90-2e1f-4620-bbb7-f9fc91d6f8e3.jpg` |
| urban-site-09 | construction-photo | 1280px | WP #2961 `2022/02/3707cd72-183d-4d97-9239-f9a20286996f.jpg` |
| urban-site-10 | construction-photo | 1280px | WP #2962 `2022/02/4162a10b-bc01-417c-865a-bf1dcd18517f.jpg` |
| urban-site-11 | construction-photo | 1280px | WP #2963 `2022/02/a6536436-a58b-409c-bdaa-9a44faad3c05.jpg` |
| urban-site-12 | construction-photo | 1280px | WP #2964 `2022/02/af118c9c-5a9b-459e-b982-650d50309574.jpg` |
| urban-site-13 | construction-photo | 1280px | WP #2965 `2022/02/b8326e01-92db-45e8-a7c1-a252bdae5a88.jpg` |
| urban-site-14 | construction-photo | 1600px | WP #2966 `2022/02/ba1d9bc4-c240-41a5-99db-4ecaf1b16e23.jpg` |
| urban-site-15 | construction-photo | 1280px | WP #2967 `2022/02/d9eb49a5-4751-4f1b-81e4-e688041e2ba0.jpg` |
| urban-site-16 | construction-photo | 1600px | WP #2969 `2022/02/WhatsApp-Image-2017-07-10-at-23.02.54.jpeg` |
| urban-site-17 | construction-photo | 1280px | WP #2968 `2022/02/de7fd474-1a6e-45d1-b0de-77736fbba841.jpg` |
| urban-cover | render | 936px | WP #73 `2022/01/invalid-name@3x.png` |

| Emblem / clip | Original source |
| --- | --- |
| emblem-dunash | WP #2870 (filename double-encoded on server) |
| emblem-family | WP #2871 `2022/01/לוגו-השר-משה.png` |
| emblem-nehalim | WP #2872 (filename double-encoded on server) |
| emblem-knafei | WP #2873 (filename double-encoded on server) |
| emblem-premium | WP #2874 (filename double-encoded on server) |
| emblem-hahayil | WP #2866 `2022/01/החייל.png` |
| emblem-abigail | WP #3010 `2022/01/שכטר-באביגיל-2.png` |
| emblem-galil-yam | WP #3011 `2022/01/שכטר-בגליל-ים-2.png` |
| location-gefen (2 s map animation) | WP #2981 `2022/01/גפן.mp4` |
| location-family (2 s map animation) | WP #2985 `2022/01/family.mp4` |
| location-gordon (2 s map animation) | WP #2744 `2022/01/גורדון-333-1.mp4` |
| location-abigail (2 s map animation) | WP #2982 `2022/01/אביגיל.mp4` |
| location-knafei (2 s map animation) | WP #2986 (filename double-encoded on server) |
| location-premium (2 s map animation) | WP #2983 `2022/01/פרימיום.mp4` |
| location-hahayil (2 s map animation) | WP #2980 `2022/01/חיל.mp4` |
| location-hagiva (2 s map animation) | WP #2979 (filename double-encoded on server) |
| location-dunash (2 s map animation) | WP #2984 (filename double-encoded on server) |
| film-wide / film-1280 / film-mobile (29.6 s) | WP #3953 `2022/04/רקע-ראשי-סופי.mp4` |

## Local image review — 28 October 2026

The client archive contains 1,372 image files grouped into 174 filename families (WordPress thumbnails, alternate formats and aliases are included). A visual review restored Premium's evening exterior and HaHayil's site photograph, and upgraded Premium's apartment interior from its 1181px copy to the 1600px original. There are now 98 image records, including 80 project-gallery images. Of the 98 image sources, 95 have byte-identical copies in the supplied Downloads/2022 folder; the other three are the previously supplied images listed above.

Project cards and large project headers now select images independently. Small originals and portrait headers are contained rather than enlarged across the viewport; lightboxes preserve native limits. Responsive source selection accounts for the effective image width under object-fit cropping. High-resolution originals now have variants up to 3840px, without upscaling. Source hashes invalidate browser caches when an original changes.

Thirteen project records still have no identifiable matching image in the supplied archive. Their cards/pages explicitly say images are forthcoming. Nofei Nehalim (316px wide) and the supplied Rishonim crop (245px wide) remain limited by their originals, and are shown at restrained sizes. See MEDIA_REVIEW.md.

29 October 2026: the client supplied two 4000 × 3000 aerial photographs for Nofei Nehalim. Both now appear in its gallery; the first also supplies the project card and header in both languages. The original files are archived without modification, and AVIF/WebP variants are generated up to 3840px. These resolve the earlier Nofei Nehalim image limitation. The manifest now contains 100 image records, including 80 published project-gallery images.
