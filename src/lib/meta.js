import {strings, contact} from '../data/site.js';
import {bySlug, completedProjects} from '../data/projects.js';
import {href} from './router.jsx';

// Production origin used for canonical URLs, sitemap and structured data.
export const SITE = (import.meta.env.VITE_SITE_URL || 'https://s-nadlan.com').replace(/\/$/, '');
const abs = path => SITE + path.replace(import.meta.env.BASE_URL, '/');

const descriptions = {
  he: {
    home: 'שכטר נדל״ן — יזמות, בנייה והתחדשות עירונית בסטנדרט אירופאי מאז 2006. בנייני בוטיק ומגדלי מגורים ברמת גן, גבעתיים, הרצליה ורחובות.',
    projects: 'הפרויקטים המאוכלסים של שכטר נדל״ן ברמת גן, גבעתיים, הרצליה, רחובות, פתח תקווה וגבעת זאב. כל הדירות בפרויקטים המאוכלסים נמכרו.',
    about: 'שכטר נדל״ן בבעלות משפחת שכטר, הפועלים באירופה ובישראל ומשקיעים בנדל״ן בארץ מאז 2006. סטנדרט בנייה גבוה, יושרה, אמינות וליווי אישי.',
    'urban-renewal': 'שכטר 38 — התחדשות עירונית, תמ״א 38/2 ופינוי בינוי בשותפות ובשקיפות מלאה עם הדיירים. עשרות בניינים בפריסה ארצית.',
    press: 'כתבות נבחרות על שכטר נדל״ן ועל פעילות החברה בהתחדשות עירונית, מתוך ארכיון החברה.',
    residents: 'שירות לדיירים של שכטר נדל״ן — פנייה לצוות החברה בנושא הדירה והפרויקט.',
    contact: 'צרו קשר עם שכטר נדל״ן לתיאום פגישה אישית: 076-8844262, info@s-nadlan.com. מגדל ב.ס.ר, כנרת 5.',
    accessibility: 'הצהרת הנגישות של אתר שכטר נדל״ן והסדרי הנגישות במשרדי החברה.',
    privacy: 'מדיניות הפרטיות של אתר שכטר נדל״ן: איזה מידע נאסף, למה, ומהן זכויותיכם.',
    sitemap: 'מפת האתר של שכטר נדל״ן — כל העמודים והפרויקטים.',
    'not-found': 'העמוד המבוקש לא נמצא באתר שכטר נדל״ן.'
  },
  en: {
    home: 'Schechter Real Estate — residential development, construction and urban renewal to a European standard since 2006, in Ramat Gan, Givatayim, Herzliya and Rehovot.',
    projects: 'Schechter Real Estate’s completed and occupied projects in Ramat Gan, Givatayim, Herzliya, Rehovot, Petah Tikva and Givat Ze’ev. All apartments in these projects are sold out.',
    about: 'Schechter Real Estate is owned by the Schechter family, active in Europe and Israel and investing in Israeli real estate since 2006.',
    'urban-renewal': 'Schechter 38 — urban renewal, TAMA 38/2 and vacate-and-rebuild in partnership and full transparency with residents.',
    press: 'Selected press coverage of Schechter Real Estate and its urban renewal work, from the company archive.',
    residents: 'Resident services — contact the Schechter Real Estate team about your apartment or project.',
    contact: 'Contact Schechter Real Estate to book a personal meeting: +972 76-884-4262, info@s-nadlan.com. B.S.R. Tower, 5 Kineret St.',
    accessibility: 'Accessibility statement for the Schechter Real Estate website and office accessibility arrangements.',
    privacy: 'Privacy policy of the Schechter Real Estate website: what we collect, why, and your rights.',
    sitemap: 'Sitemap of the Schechter Real Estate website.',
    'not-found': 'The requested page was not found.'
  }
};

const titleKey = {projects: 'projects', about: 'about', 'urban-renewal': 'urban', press: 'media', residents: 'residents', contact: 'contact', accessibility: 'accessibility', privacy: 'privacy', sitemap: 'sitemap', 'not-found': 'notFound'};

export function getMeta(route) {
  const {lang, page, slug} = route;
  const t = strings[lang];
  const p = page === 'project' ? bySlug[slug] : null;
  const title = page === 'home' ? `${t.brand} | ${t.tagline}` : p ? `${p.name[lang]} — ${p.address[lang]} | ${t.brand}` : `${t.pages[titleKey[page]]} | ${t.brand}`;
  const description = p ? `${p.name[lang]}, ${p.address[lang]}. ${(p.story[lang][0] || '').slice(0, 150)}`.trim() : descriptions[lang][page];
  const image = p?.cover ? abs(`${import.meta.env.BASE_URL}media/img/${p.cover.name}-${p.cover.widths.find(w => w >= 1200) || p.cover.widths.at(-1)}.webp`) : SITE + '/og-image.jpg';
  const path = page === 'not-found' ? null : href(lang, page, slug);
  const alternates = path ? {he: abs(href('he', page, slug)), en: abs(href('en', page, slug))} : null;
  const org = {
    '@type': 'RealEstateAgent', '@id': SITE + '/#organization', name: strings.he.brand, alternateName: strings.en.brand, url: SITE + '/',
    logo: SITE + '/media/brand/logo-dark.png', image: SITE + '/og-image.jpg', telephone: '+972-76-884-4262', email: contact.email, faxNumber: '+972-3-525-8473',
    address: {'@type': 'PostalAddress', streetAddress: lang === 'he' ? 'כנרת 5, מגדל ב.ס.ר' : '5 Kineret St., B.S.R. Tower', addressLocality: lang === 'he' ? 'רמת גן' : 'Ramat Gan', postalCode: '5158219', addressCountry: 'IL'},
    foundingDate: '2006', areaServed: 'IL'
  };
  const graph = [org, {'@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: t.brand, inLanguage: lang === 'he' ? 'he-IL' : 'en', publisher: {'@id': org['@id']}}];
  if (path && page !== 'home') graph.push({'@type': 'BreadcrumbList', itemListElement: [
    {'@type': 'ListItem', position: 1, name: t.home, item: abs(href(lang))},
    ...(p ? [{'@type': 'ListItem', position: 2, name: t.pages.projects, item: abs(href(lang, 'projects'))}] : []),
    {'@type': 'ListItem', position: p ? 3 : 2, name: p ? p.name[lang] : t.pages[titleKey[page]], item: abs(path)}
  ]});
  if (p) graph.push({'@type': 'ApartmentComplex', name: p.name[lang], url: abs(path), description,
    address: {'@type': 'PostalAddress', streetAddress: p.address[lang], addressLocality: p.city[lang] || undefined, addressCountry: 'IL'},
    image: p.gallery.slice(0, 6).map(g => abs(`${import.meta.env.BASE_URL}media/img/${g.name}-${g.widths.find(w => w >= 1200) || g.widths.at(-1)}.webp`)),
    ...(p.architect ? {creator: {'@type': 'Organization', name: p.architect[lang]}} : {}), provider: {'@id': org['@id']}});
  if (page === 'projects') graph.push({'@type': 'ItemList', itemListElement: completedProjects.map((x, i) => ({'@type': 'ListItem', position: i + 1, url: abs(href(lang, 'project', x.slug)), name: x.name[lang]}))});
  return {title, description, image, canonical: path && abs(path), alternates, lang, dir: lang === 'he' ? 'rtl' : 'ltr', jsonLd: {'@context': 'https://schema.org', '@graph': graph}};
}

// Applies metadata on client-side navigation (the prerendered HTML already has it).
export function applyMeta(meta) {
  const root = document.documentElement;
  root.lang = meta.lang; root.dir = meta.dir;
  document.title = meta.title;
  const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el && val) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', meta.description);
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:image"]', 'content', meta.image);
  set('meta[property="og:locale"]', 'content', meta.lang === 'he' ? 'he_IL' : 'en_US');
  set('meta[property="og:url"]', 'content', meta.canonical);
  set('link[rel="canonical"]', 'href', meta.canonical);
  set('link[hreflang="he"]', 'href', meta.alternates?.he);
  set('link[hreflang="en"]', 'href', meta.alternates?.en);
  set('link[hreflang="x-default"]', 'href', meta.alternates?.he);
  const ld = document.getElementById('ld');
  if (ld) ld.textContent = JSON.stringify(meta.jsonLd);
}
