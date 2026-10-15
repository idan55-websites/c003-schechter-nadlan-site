# שכטר נדל״ן — contemporary website

Responsive Hebrew/RTL real estate website built with React, Vite and Lucide icons. The October 2026 design uses original client photography and copy with a midnight-blue and warm-gold visual identity. Includes a three-scene cinematic hero, scroll parallax, intersection-based reveals, animated architectural project cards, an expandable urban-renewal section, and reduced-motion support. Image provenance is in [ASSET_SOURCES.md](ASSET_SOURCES.md); the earlier recovery report remains a historical reference.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:5173. The existing domain and DNS are unchanged.

## Build

```sh
npm run build
npm run preview
```

`dist/` is the complete static build. Hash routing supports static hosting without server rewrite rules. This preview deliberately includes `noindex,nofollow` until client content and media approval. Original WordPress route redirects are a remaining launch task.

## Browser verification

```sh
npx playwright install chromium
npm run dev -- --port 5173
# In a second terminal:
npm test
```

Checks hero scene selection, urban-renewal accordion, the 25-project catalog across stage categories, filters/search, galleries, keyboard-accessible project tabs, preselected project inquiries, form errors and focus, accessibility settings, media, company artwork, mobile navigation and 60 Hebrew page/width combinations. Screenshots are written to ignored `test-results/`.

## Content

- `src/projects.json`: 25 project records: 20 recovered records plus five named projects from the original Word document. Old index status strings are retained for reference; only source-supported stage categories and the newly supplied sold-out labels are published.
- `src/main.jsx`: page content and interactions.
- `src/style.css`: responsive design.
- `public/images/`: local image files; inspect provenance before public use.
- `recovery/`: original supplied recovery packet and developer reference mockups.

Contact opens a mailto draft in the visitor's email app and explains this in the interface. There is no lead server or delivery guarantee. For direct submission, replace this behavior with an approved form endpoint and delivery/error handling.

The privacy/accessibility pages describe this implementation’s behavior. Family and Galil Yam now lead with client-supplied photography, followed by extracted original mockup renders. The originally named הראשונים project uses its extracted original render. City and lifestyle photos are used as editorial imagery and are not presented as project images.

## Original-content expansion

- Project details include six source-based specification sets and 20 apartment types. Tab navigation supports RTL arrow keys, Home/End and Tab into the active panel. Apartment links request the actual plan from the company rather than linking to nonexistent plan files.
- Original branding, archival Family renders, garden and architectural imagery are extracted from supplied mobile mockups. See the crop provenance in ASSET_SOURCES.md.
- Media archive, resident service contact page, company structure archive and an HTML sitemap are included. The old staff chart and press articles are explicitly archival.
- Contact fields precede contact details in RTL reading order, with a fieldset/legend, Hebrew error announcements and focus, and a titled map last. Google Maps loads lazily; YouTube loads only when the visitor starts the supplied video.
- Accessibility controls offer reduced motion, high contrast and highlighted links. The controls are absent from keyboard navigation while closed. This implementation does not claim external accessibility certification.

## October 15 client update and English version

The site now includes a full English version at `#/en/`, including home, project catalog, all 25 project pages, translated specifications and apartment types, company, Tama, media, resident services, contact, privacy, accessibility and sitemap pages. The language switch preserves the current route, including project-specific contact forms. English uses LTR and translated page titles and metadata; Hebrew retains RTL.

Ten new optimized project photos are matched to six existing projects. Galleries distinguish photographs, construction-stage photographs and architectural renderings. See the October 15 section of `ASSET_SOURCES.md` for exact filename mapping and the Rehovot association assumption.

The catalog opens on completed projects and offers construction, future and archive categories, with city filters and punctuation-insensitive address search within each category. The final five records remain archived because no project stage was provided. Availability is shown only where explicitly supplied in this update; financing is shown for the two Mercantile-backed projects. Replacement photos for Emek HaAyalot and Nehalim are still needed.

The office address follows Alex’s supplied business card. The existing general inbox continues to receive email drafts; Alex’s direct email, Belgian telephone and office fax are also displayed. Contact forms in both languages open an email draft and explain the final send step.

Run `npm test` for the Hebrew workflow and `npm run test:bilingual` for both languages, all project routes, stage browsing, media attribution, language switching, address aliases, English forms and keyboard controls, and English responsive layouts. The static production build remains in `dist/`; this local update does not deploy or change the domain.

## GitHub repository and client preview

Repository: https://github.com/idan55-websites/c003-schechter-nadlan-site

The GitHub Pages workflow builds and publishes the site when `main` changes. The preview URL is https://idan55-websites.github.io/c003-schechter-nadlan-site/ and English is at `#/en/`. Public asset URLs respect Vite’s base path, so the same source works on this repository URL and on a root domain. The preview retains `noindex,nofollow`.

Local recovery references and the ZIP archive are intentionally excluded from Git.

## Mobile navigation and effects

The mobile navigation renders as a full-viewport dialog outside the blurred header, avoiding the fixed-position clipping caused by `backdrop-filter` on mobile browsers. It supports touch targets, keyboard focus trapping, Escape and close controls, scrolling on short screens, scroll restoration, and closing when following the current link or resizing to desktop.

Mobile effects include a slow animated hero photograph and light wash, a scroll cue, staggered section reveals, image reveals, and touch feedback. Animations pause when the hero leaves view. Dynamic catalog filters register newly rendered cards for reveals. System and in-site reduced-motion preferences disable these effects.

Run `npx playwright install chromium webkit` and `npm run test:mobile` to verify Chromium and WebKit touch behavior, menu hit targets, viewport coverage, scroll handling, navigation, effects and reduced-motion settings in both languages.
