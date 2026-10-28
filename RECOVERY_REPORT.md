# Recovery and redesign report — 26 October 2026

This replaces the 8 October report. The original WordPress site (staging copy at `k2g1yw4qgp.apb.spinupwp.site`) became accessible, so the site was audited against it, the original media were recovered, and the website was rebuilt on that basis.

## 1. What the original site was

WordPress + Elementor Pro + Polylang (Hebrew/English), live staging on SpinupWP. Everything was read through the public REST API (`/wp-json/wp/v2/pages|posts|media`) and `wp-content/uploads`.

| Area | Original content |
| --- | --- |
| Pages (HE) | בית, פרויקטים, אודות, שכטר 38, צור קשר, הצהרת נגישות |
| Pages (EN) | Home, Projects, About, Schechter 38, Contact Us — the English front-end URLs return 404 on the staging copy; their content was taken from the REST API |
| Projects | 12 project posts per language (HE + EN) and 8 “future project” posts |
| Media library | 190 items: 20 videos, 11 Lottie JSON files, renders, interior renders, site photos, logos, per-project emblems, status badges, bank logos |
| Forms | Elementor forms (name, phone prefix, email, message, “updates” opt-in) |
| Third parties | Elementor accessibility toolbar plugin, WhatsApp link (`wa.link/ozfvp7`), Facebook/Instagram/YouTube icons without working URLs |

The full archive is kept untouched in `recovery/wp-originals/` (local only, excluded from Git — 309 MB).

## 2. Recovered and now used

- **Original logo** (“שכטר נדל״ן — לגור בסטנדרט אירופאי”) replaces the 263-px crop from a mockup. The dark version (1019 px) and white version (489 px) come from the client's local copy of the 2022 uploads folder, which also confirmed that the other 197 server files were identical, with no higher-resolution copies. The original S mark is used for favicons, the page-transition mark and placeholders.
- **Brand palette**: graphite `#404040` and teal `#00A8C0`, sampled from the original logo and status badges, replace the previous midnight-blue/gold scheme.
- **Original hero film**: the highest-bitrate master (`רקע-ראשי-סופי.mp4`, 59.9 MB, 1904×630) re-encoded to 6.5 MB (wide), 3.8 MB (1280 px) and 1.9 MB (phone 4:3 crop), muted, with posters. Four other copies of the same edit (`סרטון צבעוני`, mobile versions, `Main-vbg-final-comp`) were identical cuts and are not needed.
- **Location animations**: 9 original 2-second map-pin clips (one per project) now play in each project's location section.
- **Original images**: 93 at their full upload resolution (75 project images, 17 urban-renewal site photos, 1 illustration), including 7 unscaled originals behind WordPress `-scaled` files (up to 5158 px). Project galleries grew from 18 images to 78:

| Project | Before | Now | Notes |
| --- | --- | --- | --- |
| שכטר בגפן | 3 GEOLN renders with watermark | 11 clean originals | GEOLN images removed |
| שכטר Family | 2 photos + 3 low-res mockup crops | 12 | mockup crops removed |
| גורדון 33 | none | 4 | |
| שכטר באביגיל | none | 7 | includes 5158-px original |
| שכטר בכנפי נשרים | 1 photo | 5 | includes 3375×4500 original |
| שכטר בגליל ים | 2 photos + 1 tiny crop | 8 | 2 client photos kept |
| שכטר Premium | 1 construction photo | 9 | includes 3750×4500 original |
| שכטר בחי״ל | none | 4 | |
| נופי הגבעה | 2 photos | 7 | |
| שכטר בדונש | 2 photos | 9 | |
| נופי נחלים | none | 1 | only one small (316 px) genuine photo exists |
| Schechter 38 page | none | 17 construction-site photos + original illustration | |

- **Per-project emblems** (8) shown on project pages; **original copy** restored for Gefen, Gordon 33, Premium, HaHayil, Dunash, Nofei Nehalim and Nofei Emek HaAyalot (both languages), plus the original About and Schechter 38 texts.
- **Facts recovered**: architects for 11 projects, financing partners, project highlights (HaHayil), Gordon 33 apartment sizes, sold-out statements, and the stage of the 8 future projects (in planning / permit granted with conditions).

## 3. Not used, and why

| Item | Reason |
| --- | --- |
| Homepage “משפחות ממליצות” testimonials | Template placeholders — they praise a marketing agency (“קליקונט”), not Schechter. Using them would be false. |
| 11 Lottie JSON animations | Earlier animated versions of the same project/location graphics; the recovered MP4 clips replace them without a 250 KB animation library. |
| Bank / insurer logos (Hapoalim, Leumi, Mizrahi Tefahot, Harel, Discount) | Third-party trademarks; financing partners are stated in text instead. |
| Status badge images, placeholders, `G` favicon | Template assets, not brand material. |
| Social-media icons | No working profile URLs existed on the original site. |
| Stock lifestyle photos and the Pexels skyline from the previous build | Not project imagery; replaced by original renders and film. |

## 4. Could not be recovered — needs the owner

- **Nofei Emek HaAyalot**: no genuine image exists; the original site reused other projects' renders (HaHayil and Nofei HaGiva). It is shown with a typographic placeholder.
- **Nofei Nehalim**: one 316-px photo only. Higher-resolution photos or renders are needed.
- **Future projects (8) and archive projects (5)**: no media. Placeholders, not invented imagery.
- **Vector logo (SVG/AI)**: the largest file is a 1019-px PNG. It is sharp on screens up to 4× density at the header size; a vector file is still needed for print and large-format use.

## 5. Conflicts to confirm with the client

| Topic | Original site | Current site uses | Why |
| --- | --- | --- | --- |
| Office address | “כנרת 5, בני ברק, מגדל ב.ס.ר 3 קומה 28”; the accessibility statement says “מצדה 9, בני ברק” | “כנרת 5, מגדל ב.ס.ר, רמת גן 5158219” | client business card (Oct 2026). Note: postcode 5158219 belongs to Bnei Brak. |
| Financing, Nofei Nehalim / Emek HaAyalot | HE: Mercantile; EN: Mizrahi Tefahot | Bank Mercantile | client update of 15 Oct 2026 |
| Schechter Family floors | 9 | 8 | client Word document |
| Sold out — Family, Gordon 33, Premium, Nofei HaGiva, Nofei Nehalim, Emek HaAyalot | stated on original site | shown as sold out | original statements; confirm still accurate |
| Future-project stages | “ניתן היתר בתנאים” / “בהליכי תכנון” (2022) | shown as stated | likely out of date |
| Abigail | EN said “Available: last penthouse” | sold out | client update |

## 6. Legal and compliance items for the owner or a lawyer

- **Privacy policy** (Israeli Protection of Privacy Law incl. Amendment 13, GDPR where EU residents are targeted): written to match exactly what the site does — no cookies, no analytics, no server-side form storage, Google Maps only after a click. Needs: the operating **legal entity name and company number**, a confirmed **retention period** for inquiries, and legal review. If a CRM, analytics or a form backend is added later, the policy and a consent mechanism must be updated first.
- **Accessibility statement** (Equal Rights for Persons with Disabilities regulations, reg. 35): needs the **name and direct contact of the accessibility coordinator**, re-verification of the office arrangements quoted from the original statement, and ideally an external audit. The site does not claim certification.
- **Marketing consent**: the “updates” checkbox is separate and optional, as required for marketing messages (Communications Law §30A). Any future mailing list must honour opt-outs.
- **Image rights**: renders belong to the respective architects/visualisers; confirm the company's right to publish them.

## 7. Verification performed

- `npm test` in Chromium and WebKit: 70 prerendered routes × 2 viewports (content, language/direction, metadata, JSON-LD, no console errors, no failed requests, no horizontal overflow), 745 media URLs, client navigation and focus, language switching, catalog filters, gallery lightbox keyboard/focus, mobile menu focus trap, contact form errors, hero film playback and reduced-motion behaviour, location clips, legacy redirects, accessibility settings, and an axe WCAG 2.2 AA scan of 10 key pages (no serious or critical issues).
- Additional overflow checks at 320, 768, 1024 and 1920 px.
- Lighthouse (local, brotli, while the machine was under heavy iCloud sync load): desktop performance 99–100, accessibility 100, best practices 100; mobile performance 86–95 on Hebrew pages (LCP 2.2–2.7 s, CLS 0), English home ~77 (LCP ~3.8 s). SEO scores 69 only because the preview is deliberately `noindex`.
