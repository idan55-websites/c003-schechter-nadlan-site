# Security, Israeli-law and media verification

Reviewed on **28 October 2026**, Israel time. **Result: issues remain; legal conformity is not established.**

**Later media follow-up:** the localhost image fixes increased the mapping to 98 images (95 matching the supplied folder). See [the media review](../../MEDIA_REVIEW.md) and [follow-up evidence](media-followup/). The original audit below records the earlier 96-image snapshot.

The local rebuild passes its existing browser tests and dependency audit, but its contact form has a confirmed personal-data exposure when JavaScript is unavailable. The public WordPress site has separate privacy and accessibility problems. The current local rebuild has not replaced either public deployment.

## Scope and deployments

| Target | Observed state | Scope of review |
| --- | --- | --- |
| Local workspace, built and served at `http://127.0.0.1:4173` | React/Vite, 70 prerendered routes | Code, dependencies, generated files, browser behavior, selected accessibility checks and media provenance |
| [Production](https://s-nadlan.com/) | WordPress/Elementor | Public HTML, HTTP/HTTPS behavior, headers, homepage accessibility, rendered contact/accessibility pages and public page index |
| [GitHub Pages preview](https://idan55-websites.github.io/c003-schechter-nadlan-site/) | Earlier hash-routed build; HTML Last-Modified was 21 October 2026 | Headers, rendered homepage, network/cookies and automated accessibility |

This was an application review and public, read-only inspection. No production form was submitted. Host accounts, WordPress administration, databases, email security, CRM, backup restoration, internal procedures and a full TLS configuration assessment were outside the available evidence. Browser automation does not establish full accessibility or legal compliance.

## Findings requiring action

### 1. Local contact form sends personal details in a URL without JavaScript

**Priority: before launch. Confirmed privacy/security defect.**

`src/components/contact-form.jsx:40` renders a form without an explicit `method` or safe fallback. Only the JavaScript submit handler prevents the browser's default GET submission. If JavaScript is disabled, fails to load, or has not attached the handler, submitting the form sends its fields to the hosting server in the query string.

Reproduced locally with synthetic data and JavaScript disabled:

```text
GET /contact/?name=Audit+Test&phone=0500000000&email=audit%40example.invalid&project=&message=Synthetic+verification+only&consent=on
```

This can expose the information through browser history and hosting/CDN/access logs. It also contradicts the form and privacy policy's unconditional promise that the site only opens an email draft and does not send the information to a server.

**Required fix:** prevent native GET submission, including before hydration and when JavaScript fails; provide a working email/telephone fallback. Merely changing to POST does not preserve the stated email-only behavior. Verify all three failure states after fixing it. See [reproduction evidence](nojs-audit.json).

### 2. Production forms lack a visible privacy notice

**Priority: address now on the live site. Confirmed notice gap on the inspected pages; legal assessment required.**

The production homepage and rendered contact page expose name, telephone and email fields without a privacy-policy link or an accompanying explanation of data use and rights. No privacy page appeared in the public WordPress page index. An optional project-updates checkbox does not supply those disclosures.

Section 11, as amended, requires notice covering voluntary/mandatory disclosure and the consequence of refusal, purpose, controller identity/contact, recipients/purposes, and access/correction rights when requesting information for database processing. The inspected forms do not present these elements. See the [Privacy Protection Authority's current description of controller duties](https://www.gov.il/BlobFolder/generalpage/manager_duties/he/InfoDuties_new.pdf).

**Required fix:** publish a notice matching actual live form, email and CRM processing and present it at collection. Determine actual recipients, retention and the legal controller before writing definitive promises.

### 3. Production accessibility has confirmed failures

**Priority: address now on the live site.**

Following the production footer's “הצהרת נגישות” link returns HTTP 200 but displays “It seems we can't find what you're looking for.” The declaration body is absent. This was confirmed in fetched HTML and a rendered browser session. The contact link also renders this fallback content alongside the shared form/footer.

The automated production homepage scan found **61 links without accessible names** and **8 elements failing contrast**. Examples include a logo link with no accessible text, unnamed project links, and white text on teal at approximately 2.73:1. These counts describe the observed desktop page and can change with carousel state.

The Israeli service-accessibility regulations address accessible internet services and publication of an accessibility declaration. See the [official regulations](https://www.gov.il/BlobFolder/guide/accommodating_service_providing_rules/he/sitedocs_service_acessibility_regulations.pdf) and [official website-accessibility guide](https://www.gov.il/he/pages/website_accessibility).

**Required fix:** restore the declaration and page routing, correct accessible names and contrast, then verify keyboard, assistive-technology and mobile use. A toolbar does not demonstrate conformance. The older GitHub preview also failed automated checks: 18 contrast instances and 4 visible-label/accessibility-name mismatches.

### 4. Production plugin maintenance needs verification

**Priority: prompt maintenance review. Version evidence is public; exploitability was not tested.**

Public script URLs and generator metadata identify Elementor and Elementor Pro **3.19.2**. The vendor documents subsequent security fixes, including Pro 3.20.2 fixes affecting forms and other widgets. See [Elementor's vendor changelog](https://elementor.com/pro/changelog/).

**Required action:** verify installed versions in administration, including all other plugins and themes, and update supported releases with a backup and staging validation. Public version strings can be cached; they do not independently prove a specific vulnerability or compromise. The clean npm result for the rebuild says nothing about these WordPress plugins.

### 5. Security-header files are not evidence of active protection

**Priority: verify before publishing the rebuild.**

The local build contains a restrictive CSP meta tag. Browser probes confirmed that inserted inline JavaScript, `eval` and `new Function` are blocked when executed through ordinary page scripts. However, `public/_headers` requires a host that processes that format.

The inspected GitHub preview response had HSTS, but no CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy response headers. Its HTML also lacked a CSP meta tag. The local Vite preview does not apply `_headers` either.

Production currently redirects HTTP to HTTPS and sends HSTS, `nosniff`, SAMEORIGIN framing protection and a referrer policy. It did not send CSP or Permissions-Policy on the inspected homepage.

**Required action:** configure the chosen production host, then inspect actual responses for HTML, errors and assets. Framing restrictions require response headers; the existence of a repository file is insufficient. See `public/_headers`, `deploy/README.md:25` and [browser evidence](browser-evidence.json).

## Israeli-law items that remain unverified

These are outstanding evidence or drafting issues, not findings that each missing detail is automatically a statutory violation.

| Item | Present state | Needed to finish the assessment |
| --- | --- | --- |
| Legal controller and address | `src/pages/content.jsx:235` identifies the operator by brand. `src/data/site.js:8` says Ramat Gan; production says Bnei Brak. The recovery report records this conflict. | Confirm the actual controlling legal entity and accurate address/contact details. A company number can help identify it, but this review does not treat its absence alone as a breach of Section 11. |
| Accessibility declaration | The local declaration exists in Hebrew/English and describes useful adaptations. It claims screen-reader and 400% zoom testing and repeats historic office arrangements. | Obtain documented manual test results and verify the current office's parking, entrance, lifts, toilets and assistance. This review did not operate a screen reader or physically inspect the office. |
| Accessibility coordinator | General email/phone are provided; no named coordinator is published locally. | Determine applicability: regulation 91 addresses appointment for a covered service provider employing at least 25 people. If applicable, publish the appointed person's details. See the [regulations hosted by National Insurance](https://www.btl.gov.il/Laws1/02_0041_100100.pdf). |
| Email/CRM data security and retention | The local policy promises limited retention, deletion and reasonable security; downstream implementation is unavailable. | Verify access controls, account MFA, retention/deletion, incident procedures, provider agreements and safeguards for overseas processing. Foreign transfers have additional conditions under the [official transfer regulations](https://www.gov.il/BlobFolder/news/post_schrems_update/he/TakanotHul.pdf). |
| Marketing messages | Local response consent and optional updates are separate and initially unchecked. The choice is written into an editable email draft. | Review consent wording/channels and retain reliable evidence of consent and withdrawals in the actual mailing process. Inspect actual sender identification and unsubscribe behavior before campaigns. See the [enacted Section 30A amendment](https://fs.knesset.gov.il/17/law/17_lsr_299991.pdf). No campaign was sent or tested. |
| Project accuracy | `RECOVERY_REPORT.md` flags potentially outdated stages, sold-out statements and conflicting specifications. Renderings are labelled locally. | Confirm current permits, availability, dimensions, financing and dates with the owner. Labels and disclaimers do not validate inaccurate material facts. See [Consumer Protection Authority guidance applying the prohibition on misleading consumers](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/cpfta_opinion_310724/he/%D7%92%D7%99%D7%9C%D7%95%D7%99%20%D7%93%D7%A2%D7%AA%20%D7%A9%D7%99%D7%A0%D7%95%D7%99%20%D7%9E%D7%A8%D7%9B%D7%99%D7%91%D7%99%D7%9D%20%D7%95%D7%AA%D7%9B%D7%95%D7%A0%D7%95%D7%AA%20%D7%9C%D7%94%D7%A2%D7%9C%D7%90%D7%94.pdf). |
| Rights in images/video | Content provenance is established below; licences/contracts were not supplied. | Confirm permission for website publication, edits and required photographer/visualiser credits. Possessing a file does not establish copyright ownership. See the [Ministry of Justice explanation of copyright and attribution rights](https://www.gov.il/he/pages/info-22-02-2023). |
| Database registration / DPO | No organisational evidence was available. | Assess the business's actual databases, scale and activities. These duties are conditional, not automatic for every website. See the [Authority's current registration rules](https://www.gov.il/he/service/registration_in_the_database) and [Amendment 13 guidance](https://govextra.gov.il/privacy-protection-regulations/privacy-protection-regulations/). |

The local privacy policy already covers most Section 11 topics through the linked policy, and Google Maps has an explicit activation notice. Those are useful foundations. They do not resolve the identified fallback leak or establish that the policy's operational promises are implemented.

## Images from `/Users/idanhadad/Downloads/2022`

**Yes: matching content from this folder is used throughout the local rebuild.**

The folder contains **1,407 non-hidden files**, including thumbnails, alternative formats, branding, videos and other files. It is not a collection of 1,407 distinct photographs that should all appear on the site.

| Check | Result |
| --- | --- |
| Image records in the local media mapping | 96 |
| Image sources with an exact SHA-256 match in the Downloads folder | **93 / 96** |
| Images referenced in generated HTML | **96 / 96** |
| Regenerated WebP samples matching current assets byte for byte | **96 / 96**, one smallest-width sample per image |
| Expected AVIF/WebP variants present | All |
| Branding sources matching the folder | **11 / 11**: two logos, eight emblems and the S mark |
| Video sources matching the folder | **10 / 10**: hero master plus nine location clips |

The three image sources without exact matches are `galil-yam-site-1`, `galil-yam-site-2` and `rishonim-render`. Their configured sources are under `recovery/previous-build-images/`, as already documented in `ASSET_SOURCES.md`.

Examples: `abigail-night` matches `01/c1_night_Final.jpg`; `dunash-facade` matches `01/דונש1.jpg`; the dark logo matches `01/לוגו.png`; the white logo matches `01/w@3x.png`; the hero master matches `04/רקע-ראשי-סופי.mp4`.

Most configured sources are the archived WordPress originals, whose bytes match the Downloads copies. This proves shared source content; hashes cannot establish which physical copy a previous builder originally read. These counts apply to the **local rebuild**, not the older public deployments. Generated outputs are resized/re-encoded and therefore are not expected to have the originals' hashes. Rebuilding a sample using the configured transformation verified that additional link in the chain.

The [CSV ledger](media-provenance.csv) records each asset, original hash, matching local paths and usage count. The [JSON ledger](media-provenance.json) also lists every referencing generated page. The matched-video count verifies original sources; videos were not fully re-encoded during this audit.

## Verification results and evidence

| Check | Result |
| --- | --- |
| `npm run build` | Passed: 70 prerendered routes and 50 redirects |
| `npm audit --json` | Zero reported vulnerabilities: critical/high/moderate/low all zero |
| Existing end-to-end suite, Chromium | Passed, including all 70 routes at desktop/mobile widths and 745 media URLs |
| Same suite, WebKit | Passed |
| Additional axe scan | No automated WCAG-tagged violations on 17 selected local routes; unresolved/manual checks remain for contrast over imagery, video alternatives and some ARIA interpretation |
| 320 CSS-pixel reflow sampling | No document-width overflow on seven selected local routes; this is a reflow check, not a full 400% zoom or screen-reader assessment |
| Contact page before map activation | No external requests or cookies observed; localStorage contained accessibility settings only |
| Map activation | Google requests began after the explicit click; its iframe loaded |
| Script policy probes | Inline execution and page-script `eval`/`new Function` blocked |
| Source/output inspection | No backend, analytics SDK or tracker found in the local application; targeted common private-key/token-pattern scan found no matches in inspected source/public/build files |
| JavaScript-disabled contact submission | **Failed privacy expectation**: personal fields submitted via GET query |

Supporting files: [Chromium test log](site-tests.log), [WebKit test log](webkit-tests.log), [dependency audit](npm-audit.json), [browser/network/accessibility evidence](browser-evidence.json), [no-JavaScript reproduction](nojs-audit.json), [public production page index](production-pages-index.json), and the media ledgers above.

The application and deployment settings were left for a separate remediation step. This audit adds findings and evidence; a passing automated test suite is not a security guarantee or an Israeli-law compliance certificate.
