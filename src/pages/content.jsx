import React, {useEffect, useState} from 'react';
import {href, useRouter} from '../lib/router.jsx';
import {strings, contact, press} from '../data/site.js';
import {alexProfile} from '../data/seo.js';
import {completedProjects, bySlug, byId} from '../data/projects.js';
import {aboutStory, urbanStory} from '../data/recovered.js';
import media from '../data/media.json';
import {Link, Picture, Lines, Label, Arrow, ArrowDiag, Phone, Mail, Pin} from '../components/ui.jsx';
import {ContactForm} from '../components/contact-form.jsx';
import {ProjectCard} from '../components/project-ui.jsx';

const PageHero = ({label, lines, lede}) => <section className="page-hero wrap">
  <Label>{label}</Label>
  <h1 className="display-1"><Lines lines={lines}/></h1>
  {lede && <p className="lede reveal-up">{lede}</p>}
</section>;

export function About() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  const [p1, p2, p3, p4] = aboutStory[lang];
  return <>
    <PageHero label={he ? 'אודות שכטר נדל״ן · Schechter Real Estate' : 'About Schechter Real Estate'} lines={he ? ['בונים', 'איכות חיים.'] : ['Building', 'quality living.']} lede={he ? 'משפחה אירופאית, מסורת בנייה מוקפדת ומחויבות ארוכת שנים ללקוחות — מאז 2006.' : 'A European family, a meticulous building tradition and a long-term commitment to clients — since 2006.'}/>
    <figure className="wide-figure"><div className="clip-reveal"><Picture name="knafei-garden" alt={he ? 'הדמיה — שכטר בכנפי נשרים, רמת גן' : 'Rendering — Schechter Knafei Nesharim, Ramat Gan'} sizes="100vw" className="parallax-inner"/></div></figure>
    <section className="split wrap">
      <Label n="01">{he ? 'החברה' : 'The company'}</Label>
      <div className="prose"><p className="lede rv">{p1}</p><p className="rv">{p2}</p>
        <p>{he ? 'לפניות בנוגע לחברה ולתיאום פגישה, ניתן לפנות לאלכס שכטר.' : 'For company inquiries and to arrange a meeting, contact Alex Shechter.'}</p>
        <Link to={href(lang, 'alex-shechter')} className="link-arrow">{he ? 'אלכס שכטר — פרטים ויצירת קשר' : 'Alex Shechter — details and contact'}<Arrow size={18}/></Link>
      </div>
    </section>
    <section className="split wrap">
      <Label n="02">{he ? 'הערכים' : 'Values'}</Label>
      <div className="prose"><p className="rv">{p3}</p></div>
    </section>
    <div className="duo wrap">
      <div data-speed="-0.06"><Picture name="abigail-living-wide" alt={he ? 'הדמיית פנים — שכטר באביגיל' : 'Interior rendering — Schechter Abigail'} sizes="(min-width: 900px) 58vw, 100vw"/></div>
      <div data-speed="0.08"><Picture name="premium-facade" alt={he ? 'הדמיה — שכטר Premium, תרע״ד 10' : 'Rendering — Schechter Premium, 10 Tera’ad'} sizes="(min-width: 900px) 32vw, 70vw"/></div>
    </div>
    <section className="split wrap">
      <Label n="03">{he ? 'יציבות' : 'Stability'}</Label>
      <div className="prose"><p className="lede rv">{p4}</p>
        <Link to={href(lang, 'projects')} className="btn btn-solid rv">{strings[lang].allProjects}<Arrow size={20}/></Link></div>
    </section>
    <PressList limit/>
  </>;
}

export function Alex() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he', t = strings[lang];
  return <>
    <PageHero label={he ? 'שכטר נדל״ן · יצירת קשר אישית' : 'Schechter Real Estate · Personal contact'}
      lines={he ? ['אלכס', 'שכטר.'] : ['Alex', 'Shechter.']} lede={alexProfile.summary[lang]}/>
    <section className="split wrap" aria-labelledby="alex-details">
      <Label>{he ? 'פרטים ויצירת קשר' : 'Details and contact'}</Label>
      <div className="prose">
        <h2 id="alex-details" className="display-3">{alexProfile.name[lang]}</h2>
        <p>{he ? <><span lang="en" dir="ltr">Alex Shechter · Alex Schechter</span> — אלכס שכטר, שכטר נדל״ן.</> : 'The name Alex Shechter is also written Alex Schechter. This page provides his business contact details at Schechter Real Estate.'}</p>
        <p>{he ? 'לשאלות על פרויקטי החברה, להתעניינות בהתחדשות עירונית או לתיאום פגישה במשרד, ניתן לפנות בדואר האלקטרוני או בטלפון שלהלן. מומלץ לציין את שם הפרויקט או את כתובת הבניין ואת נושא הפנייה.' : 'For questions about company projects, urban renewal inquiries or an office meeting, use the email or phone below. Include the project name or building address and the subject of your inquiry so the company can direct it to the appropriate team.'}</p>
        <ul className="contact-lines" role="list">
          <li><a href={`mailto:${contact.alex.email}`}><Mail size={20}/><span dir="ltr">{contact.alex.email}</span></a></li>
          <li><a href={contact.alex.phoneHref}><Phone size={20}/><span dir="ltr">{contact.alex.phone}</span></a></li>
          <li><span><Pin size={20}/>{contact.address[lang]}</span></li>
          <li><span>{contact.hours[lang]}</span></li>
        </ul>
        <Link to={href(lang, 'contact')} className="btn btn-solid">{he ? 'לתיאום פגישה ולפנייה לחברה' : 'Arrange a meeting or send an inquiry'}<Arrow size={20}/></Link>
      </div>
    </section>
    <section className="split wrap" aria-labelledby="alex-company">
      <Label>{t.brand}</Label>
      <div className="prose">
        <h2 id="alex-company" className="display-3">{he ? 'החברה והפרויקטים' : 'The company and its projects'}</h2>
        <p>{he ? 'שכטר נדל״ן היא חברה משפחתית הפועלת בישראל מאז 2006 בתחומי יזמות, בנייה למגורים והתחדשות עירונית. תיק הפרויקטים המאוכלסים כולל בנייני בוטיק ופרויקטי מגורים ברמת גן, גבעתיים, הרצליה, רחובות, פתח תקווה וגבעת זאב.' : 'Schechter Real Estate is a family-owned company active in Israel since 2006 in residential development, construction and urban renewal. Its completed portfolio includes boutique buildings and residential projects in Ramat Gan, Givatayim, Herzliya, Rehovot, Petah Tikva and Givat Ze’ev.'}</p>
        <p>{he ? 'כל הדירות בפרויקטים המאוכלסים המוצגים באתר נמכרו. לשאלות על פרויקט קיים או על אפשרות להתחדשות הבניין שלכם, פנו לחברה לקבלת מידע עדכני.' : 'All apartments in the occupied projects shown on this website are sold out. For questions about an existing project or renewing your building, contact the company for current information.'}</p>
        <ul className="profile-links" role="list">
          <li><Link to={href(lang, 'about')} className="link-arrow">{he ? 'אודות שכטר נדל״ן' : 'About Schechter Real Estate'}<Arrow size={18}/></Link></li>
          <li><Link to={href(lang, 'projects')} className="link-arrow">{t.categoriesLong.completed}<Arrow size={18}/></Link></li>
          <li><Link to={href(lang, 'urban-renewal')} className="link-arrow">{t.pages.urban}<Arrow size={18}/></Link></li>
        </ul>
      </div>
    </section>
  </>;
}

export function Urban() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  const s = urbanStory[lang];
  const photos = Object.keys(media).filter(k => k.startsWith('urban-site-'));
  const principles = he
    ? [['תוכנית חברתית', s[0]], ['שותפות שבה כולם מרוויחים', s[2]], ['שקיפות לכל אורך הדרך', s[3]]]
    : [['A social plan', s[0]], ['A partnership where everyone benefits', s[2]], ['Transparency all the way', s[3]]];
  return <>
    <section className="urban-hero">
      <div className="wrap urban-hero-grid">
        <div>
          <Label light>{he ? 'שכטר 38 · התחדשות עירונית' : 'Schechter 38 · Urban renewal'}</Label>
          <h1 className="display-1"><Lines lines={he ? ['אנשים אינם', '״בטון ולבנים״.'] : ['People are not', '“concrete and bricks”.']}/></h1>
          <p className="lede reveal-up">{s[1]}</p>
        </div>
        <div className="urban-hero-art reveal-up"><Picture name="urban-cover" alt={he ? 'איור מקורי מעמוד שכטר 38: בניין מגורים חדש בשקיעה' : 'Original Schechter 38 illustration: a new residential building at sunset'} sizes="(min-width: 900px) 40vw, 80vw" eager/></div>
      </div>
    </section>
    <section className="principles wrap" aria-label={he ? 'העקרונות שלנו' : 'Our principles'}>
      {principles.map(([title, text], i) => <article key={title} className="principle rv" style={{'--i': i}}>
        <span className="principle-n" dir="ltr">{String(i + 1).padStart(2, '0')}</span><h2 className="display-3">{title}</h2><p>{text}</p></article>)}
    </section>
    <section className="site-diary" aria-labelledby="diary-title">
      <div className="wrap section-head">
        <Label>{he ? 'מהשטח' : 'From the field'}</Label>
        <h2 id="diary-title" className="display-2"><Lines lines={he ? ['עשרות בניינים', 'בפריסה ארצית.'] : ['Dozens of buildings', 'nationwide.']}/></h2>
        <p className="lede rv">{s[4]}</p>
      </div>
      <ul className="diary-track" role="list" tabIndex={0} aria-label={he ? 'צילומים מאתרי הבנייה — ניתן לגלול לרוחב' : 'Construction site photographs — scroll horizontally'}>
        {photos.map((name, i) => <li key={name}><Picture name={name} alt={he ? `צילום מאתר התחדשות עירונית ${i + 1}` : `Urban renewal site photograph ${i + 1}`} sizes="(min-width: 900px) 30vw, 78vw"/></li>)}
      </ul>
    </section>
    <section className="cta-band wrap">
      <h2 className="display-2">{he ? 'בואו נדבר על הבניין שלכם.' : 'Let’s talk about your building.'}</h2>
      <p className="lede">{he ? 'לפרטים נוספים צרו קשר או השאירו פרטים ונחזור אליכם בהקדם.' : 'Contact us or leave your details and we will get back to you shortly.'}</p>
      <Link to={href(lang, 'contact')} className="btn btn-solid">{strings[lang].cta}<Arrow size={20}/></Link>
    </section>
  </>;
}

function PressList({limit}) {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  return <section className="press wrap" aria-labelledby="press-title">
    <div className="section-head"><Label>{he ? 'שכטר במדיה' : 'In the press'}</Label>
      {limit ? <h2 id="press-title" className="display-3">{he ? 'מהארכיון.' : 'From the archive.'}</h2> : <h2 id="press-title" className="sr-only">{he ? 'כתבות' : 'Articles'}</h2>}</div>
    <ol className="press-list" role="list">{press.map(item => <li key={item.date} className="rv"><article>
      <p className="press-meta"><span>{item.source[lang]}</span><time dateTime={item.date} dir="ltr">{item.date.split('-').reverse().join('.')}</time></p>
      <h3>{item.title[lang]}</h3><p>{item.copy[lang]}</p></article></li>)}</ol>
    {limit && <Link to={href(lang, 'press')} className="link-arrow">{he ? 'לכל הכתבות' : 'All articles'}<Arrow size={18}/></Link>}
  </section>;
}

export function Media() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  return <>
    <PageHero label={he ? 'במדיה' : 'Press'} lines={he ? ['הסיפור שלנו,', 'במילים של אחרים.'] : ['Our story,', 'in other words.']} lede={he ? 'כתבות נבחרות מארכיון החברה, 2012–2016. תקצירי הכתבות נכתבו על ידי החברה.' : 'Selected articles from the company archive, 2012–2016. Summaries written by the company.'}/>
    <PressList/>
  </>;
}

export function Residents() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  return <>
    <PageHero label={he ? 'שירות לדיירים' : 'Resident services'} lines={he ? ['הקשר', 'ממשיך.'] : ['The relationship', 'continues.']} lede={he ? 'גם אחרי קבלת המפתח, אנחנו כאן. לשאלות בנוגע לדירה, להתקדמות הפרויקט או לתיאום עם צוות החברה.' : 'Even after you receive the keys, we are here — for questions about your apartment, project progress or coordination with our team.'}/>
    <section className="split wrap">
      <Label>{he ? 'איך פונים' : 'How to reach us'}</Label>
      <div className="prose">
        <p className="lede">{he ? 'כדי שנוכל להפנות את הפנייה לצוות המתאים, ציינו את שם הפרויקט, מספר הדירה ופרטי ההתקשרות שלכם.' : 'So we can direct your request to the right team, please include the project name, your apartment number and your contact details.'}</p>
        <ul className="contact-lines" role="list">
          <li><a href={contact.phoneHref}><Phone size={20}/><span dir="ltr">{contact.phone}</span></a></li>
          <li><a href={`mailto:${contact.email}?subject=${encodeURIComponent(he ? 'פניית דייר' : 'Resident request')}`}><Mail size={20}/>{contact.email}</a></li>
          <li><span>{contact.hours[lang]}</span></li>
        </ul>
      </div>
    </section>
  </>;
}

export function Contact() {
  const {route: {lang}, search} = useRouter();
  const he = lang === 'he', t = strings[lang];
  const [project, setProject] = useState();
  // Static pages have no query-specific HTML. Apply the selection after hydration.
  useEffect(() => { setProject(bySlug[new URLSearchParams(search).get('project')]); }, [search]);
  const [map, setMap] = useState(false);
  return <>
    <PageHero label={t.nav.contact} lines={he ? ['נשמח', 'לדבר.'] : ['We’d love', 'to talk.']} lede={project ? (he ? `על ${project.name.he}, ועל הבית הבא שלכם.` : `About ${project.name.en}, and your next home.`) : (he ? 'הנציגים שלנו מחכים לדבר איתכם — לתיאום פגישה אישית, לשאלות על פרויקט או על התחדשות הבניין שלכם.' : 'Our team is ready to talk — to book a personal meeting, ask about a project or about renewing your building.')}/>
    <section className="contact-layout wrap">
      <ContactForm key={project?.id || 'general'} project={project}/>
      <aside className="contact-card" aria-label={t.footer.contactTitle}>
        <a href={contact.phoneHref} className="contact-row"><Phone size={22}/><span><small>{he ? 'חייגו אלינו' : 'Call us'}</small><strong dir="ltr">{contact.phone}</strong></span></a>
        <a href={`mailto:${contact.email}`} className="contact-row"><Mail size={22}/><span><small>{he ? 'כתבו לנו' : 'Write to us'}</small><strong>{contact.email}</strong></span></a>
        <div className="contact-row"><Pin size={22}/><span><small>{he ? 'בואו לבקר' : 'Visit us'}</small><strong>{contact.address[lang]}</strong><span>{contact.hours[lang]}</span>
          <span className="contact-nav"><a href={contact.maps} target="_blank" rel="noopener noreferrer">Google Maps<ArrowDiag size={14}/></a><a href={contact.waze} target="_blank" rel="noopener noreferrer">Waze<ArrowDiag size={14}/></a></span></span></div>
        <div className="contact-row contact-alex" id="alex-schechter"><span><Link to={href(lang, 'alex-shechter')}>{he ? 'אלכס שכטר · Alex Shechter' : 'Alex Shechter (Alex Schechter)'}</Link><a href={`mailto:${contact.alex.email}`}>{contact.alex.email}</a><a href={contact.alex.phoneHref} dir="ltr">{contact.alex.phone}</a></span></div>
      </aside>
    </section>
    <section className="map wrap" aria-label={he ? 'מפת הגעה' : 'Map'}>
      {map ? <iframe title={he ? 'מפת הגעה למשרדי שכטר נדל״ן — מגדל ב.ס.ר, כנרת 5' : 'Map to Schechter Real Estate offices — B.S.R. Tower, 5 Kineret St.'} src={`https://maps.google.com/maps?q=${encodeURIComponent('מגדל ב.ס.ר 3 כנרת 5')}&output=embed`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/> :
        <div className="map-consent"><Pin size={28}/><p>{he ? 'המפה נטענת משירות Google Maps, שעשוי לאסוף מידע טכני ועוגיות בהתאם למדיניות שלו. היא תיטען רק לאחר לחיצה.' : 'The map is provided by Google Maps, which may collect technical data and set cookies under its own policy. It loads only after you click.'}</p>
          <button type="button" className="btn btn-line" onClick={() => setMap(true)}>{he ? 'הצגת המפה' : 'Show map'}</button></div>}
    </section>
  </>;
}

const updated = {he: '29 באוקטובר 2026', en: '29 October 2026'};

export function Accessibility() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  return <article className="legal wrap">
    <Label>{he ? 'נגישות' : 'Accessibility'}</Label>
    <h1 className="display-2">{he ? 'הצהרת נגישות' : 'Accessibility statement'}</h1>
    <p className="muted">{he ? `עודכן לאחרונה: ${updated.he}` : `Last updated: ${updated.en}`}</p>
    {he ? <>
      <p>שכטר נדל״ן מייחסת חשיבות רבה להנגשת אתר האינטרנט שלה לאנשים עם מוגבלות, מתוך תפיסה שלכל אדם מגיעה הזדמנות שווה לגלוש באתר בקלות ובנוחות ולהפיק תועלת מהשירותים והתכנים המתפרסמים בו.</p>
      <h2>רמת הנגישות באתר</h2>
      <p>אנו פועלים להתאמת האתר לתקן הישראלי ת״י 5568 חלק 1 (מהדורת 2023), המבוסס על WCAG 2.0 ברמה AA ועל השינויים הלאומיים שבתקן. בנוסף נבדקות התאמות לפי WCAG 2.2 ברמה AA.</p>
      <p>הבדיקה הטכנית הפנימית באוקטובר 2026 כוללת סריקות אוטומטיות, ניווט במקלדת, תוויות ותפקידים בעץ הנגישות של הדפדפן, הגדלת טקסט ותצוגה במחשב ובנייד. בדיקת שימוש מלאה בקוראי מסך כגון NVDA או VoiceOver טרם הושלמה; בדיקות הדפדפן אינן מחליפות אותה.</p>
      <h2>התאמות שבוצעו באתר</h2>
      <ul>
        <li>ניווט מלא באמצעות מקלדת, סימון מיקוד ברור וקישור ״דילוג לתוכן״ בראש כל עמוד.</li>
        <li>מבנה כותרות היררכי, אזורי ניווט מסומנים ושפת עמוד מוגדרת (עברית מימין לשמאל, אנגלית משמאל לימין).</li>
        <li>טקסט חלופי לתמונות משמעותיות, וסימון תמונות דקורטיביות כך שקוראי מסך ידלגו עליהן.</li>
        <li>הסרט בעמוד הבית אינו כולל קול ומלווה בתיאור טקסטואלי; ניתן לעצור אותו בכל עת, והוא אינו מתנגן כשנבחרה הפחתת תנועה.</li>
        <li>תמיכה בהגדרת ״הפחתת תנועה״ של מערכת ההפעלה, ובכפתור הגדרות נגישות באתר: הפחתת תנועה, ניגודיות גבוהה, הדגשת קישורים והגדלת טקסט.</li>
        <li>טפסים עם תוויות, הודעות שגיאה מפורטות הנקראות על ידי קוראי מסך, וריכוז שגיאות בראש הטופס.</li>
        <li>גלריות ותפריטים הנפתחים כחלון דו־שיח עם לכידת מיקוד, סגירה ב־Escape וחזרה לנקודת המוצא.</li>
        <li>התאמה לרוחב של 320 פיקסלי CSS, המקביל לתצוגת 400% בחלון שרוחבו 1280 פיקסלים, ולהגדלת טקסט ולשינוי ריווח.</li>
      </ul>
      <h2>מגבלות ידועות</h2>
      <ul>
        <li>חלק מההדמיות המקוריות כוללות טקסט מוטמע (כגון שם או סמל פרויקט) שאינו מוקרא בנפרד; המידע המהותי מופיע גם בטקסט העמוד.</li>
        <li>מפת ההגעה מסופקת על ידי Google Maps, ונגישותה באחריות הספק. הכתובת המלאה והקישורים לניווט מופיעים גם כטקסט.</li>
        <li>תוכניות דירות אינן מתפרסמות באתר ונשלחות לפי בקשה; ניתן לבקש אותן גם בפורמט נגיש.</li>
      </ul>
      <h2>הסדרי נגישות במשרדי החברה</h2>
      <p>לקבלת פרטים עדכניים על חניה נגישה, דרך הגישה למשרדים, מעליות, שירותים נגישים ואמצעי עזר לשמיעה, ולבקשת סיוע או התאמה לקראת הביקור, פנו לצוות החברה בטלפון או בדואר האלקטרוני המופיעים להלן. מומלץ לתאם הגעה מראש.</p>
      <h2>פנייה בנושא נגישות</h2>
      <p>נתקלתם בקושי? נשמח לשמוע ולתקן. ציינו את העמוד, הפעולה שניסיתם לבצע ואת סוג המכשיר והדפדפן.</p>
      <ul className="plain">
        <li>טלפון: <a href={contact.phoneHref} dir="ltr">{contact.phone}</a> ({contact.hours.he})</li>
        <li>דואר אלקטרוני: <a href={`mailto:${contact.email}?subject=${encodeURIComponent('פנייה בנושא נגישות')}`}>{contact.email}</a></li>
        <li>דואר: שכטר נדל״ן, {contact.address.he}</li>
      </ul>
    </> : <>
      <p>Schechter Real Estate is committed to making its website accessible to people with disabilities, so that everyone can browse it easily and benefit from its content and services.</p>
      <h2>Conformance</h2>
      <p>We are working to make the website conform to Israeli Standard IS 5568 Part 1 (2023 edition), based on WCAG 2.0 level AA and the standard’s national modifications. Additional adjustments are checked against WCAG 2.2 level AA.</p>
      <p>The internal technical review in October 2026 includes automated scans, keyboard navigation, labels and roles in the browser accessibility tree, text resizing, and desktop and mobile layouts. A full usability review with screen readers such as NVDA or VoiceOver has not yet been completed; browser checks do not replace it.</p>
      <h2>What we have done</h2>
      <ul>
        <li>Full keyboard navigation, clear focus indicators and a “Skip to content” link on every page.</li>
        <li>Hierarchical headings, labelled navigation regions and a declared page language and direction.</li>
        <li>Text alternatives for meaningful images; decorative images are hidden from screen readers.</li>
        <li>The homepage film has no sound and is described in text; it can be paused at any time and does not play when reduced motion is selected.</li>
        <li>Support for the operating system’s reduced-motion setting, plus on-site settings for reduced motion, high contrast, highlighted links and larger text.</li>
        <li>Labelled form fields, descriptive error messages announced to screen readers, and an error summary.</li>
        <li>Galleries and menus open as dialogs with focus management, Escape to close and focus return.</li>
        <li>Layouts for a width of 320 CSS pixels, equivalent to 400% zoom in a 1280-pixel window, plus text resizing and adjustable text spacing.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>Some original renderings contain embedded text (such as a project name or emblem); the essential information is also in the page text.</li>
        <li>The office map is provided by Google Maps; the full address and navigation links are also available as text.</li>
        <li>Floor plans are not published online and are sent on request, including in an accessible format.</li>
      </ul>
      <h2>Office accessibility</h2>
      <p>For current details about accessible parking, the route to the office, elevators, accessible restrooms and hearing assistance, or to request assistance or an adjustment for your visit, contact our team by phone or email using the details below. Please arrange your visit in advance.</p>
      <h2>Contact us about accessibility</h2>
      <ul className="plain">
        <li>Phone: <a href={contact.phoneHref} dir="ltr">{contact.phone}</a> ({contact.hours.en})</li>
        <li>Email: <a href={`mailto:${contact.email}?subject=Accessibility`}>{contact.email}</a></li>
        <li>Post: Schechter Real Estate, {contact.address.en}</li>
      </ul>
    </>}
  </article>;
}

export function Privacy() {
  const {route: {lang}} = useRouter();
  const he = lang === 'he';
  return <article className="legal wrap">
    <Label>{he ? 'פרטיות' : 'Privacy'}</Label>
    <h1 className="display-2">{he ? 'מדיניות פרטיות' : 'Privacy policy'}</h1>
    <p className="muted">{he ? `עודכן לאחרונה: ${updated.he}` : `Last updated: ${updated.en}`}</p>
    {he ? <>
      <p>מדיניות זו מסבירה איזה מידע אישי נאסף בקשר לאתר שכטר נדל״ן, לאילו מטרות, ומהן זכויותיכם, בהתאם לחוק הגנת הפרטיות, התשמ״א–1981 ותיקוניו, לרבות תיקון 13. האתר מופעל על ידי שכטר נדל״ן, {contact.address.he} (״החברה״).</p>
      <h2>איזה מידע נאסף, ולמה</h2>
      <ul>
        <li><strong>פניות באמצעות הטופס:</strong> שם, טלפון, ואם בחרתם — אימייל, פרויקט מבוקש והודעה. הטופס אינו שולח מידע לשרת: הוא פותח טיוטת אימייל בתוכנת הדואר שלכם, והמידע מגיע לחברה רק אם תשלחו אותה. המידע משמש לחזרה אליכם ולטיפול בפנייה בלבד.</li>
        <li><strong>עדכונים על פרויקטים:</strong> רק אם סימנתם זאת במפורש. ניתן להסיר את ההסכמה בכל עת בפנייה אלינו, וכל דיוור שיווקי יכלול אפשרות הסרה.</li>
        <li><strong>פנייה בטלפון או באימייל:</strong> המידע שתמסרו משמש לטיפול בפנייה.</li>
      </ul>
      <p>אינכם חייבים על פי חוק למסור מידע. ללא שם ואמצעי התקשרות לא נוכל לחזור אליכם.</p>
      <h2>עוגיות, אנליטיקה ואחסון בדפדפן</h2>
      <p>האתר אינו משתמש בעוגיות, בכלי אנליטיקה, בפיקסלים שיווקיים או בפרסום מותאם. העדפות הנגישות שבחרתם נשמרות בדפדפן שלכם בלבד (localStorage) כדי שיישמרו בין העמודים, ואינן נשלחות אלינו. ספק האחסון של האתר מעבד נתוני גישה טכניים (כגון כתובת IP וסוג דפדפן) לצורכי אבטחה ותפעול.</p>
      <p>מפת Google בעמוד יצירת הקשר נטענת רק לאחר שתלחצו ״הצגת המפה״. מאותו רגע Google עשויה לאסוף מידע ולהציב עוגיות בהתאם למדיניות שלה. קישורים לשירותים חיצוניים (Google Maps, Waze) כפופים למדיניות של אותם שירותים.</p>
      <h2>מי מקבל את המידע</h2>
      <p>המידע נגיש לעובדי החברה ולנותני שירותים הפועלים מטעמה (כגון ספקי דואר אלקטרוני ואחסון), לצורך הטיפול בפנייה בלבד ובכפוף לחובת סודיות. איננו מוכרים מידע אישי. ייתכן שספקי שירות מאחסנים מידע מחוץ לישראל, בהתאם להוראות הדין.</p>
      <h2>שמירה ואבטחה</h2>
      <p>מידע מפניות נשמר רק כל עוד הוא נדרש לטיפול בפנייה, לקשר עסקי או לפי חובה שבדין, ולאחר מכן נמחק. החברה נוקטת אמצעי אבטחה סבירים בהתאם לתקנות הגנת הפרטיות (אבטחת מידע). האתר מוגש בחיבור מוצפן (HTTPS).</p>
      <h2>הזכויות שלכם</h2>
      <p>אתם רשאים לעיין במידע שנשמר עליכם, לבקש לתקנו או למחקו, ולבקש להסיר אתכם מרשימת דיוור. אם אתם נמצאים באיחוד האירופי, עומדות לכם גם הזכויות לפי ה־GDPR, לרבות הגבלת עיבוד, ניידות מידע, התנגדות והגשת תלונה לרשות פיקוח. לפנייה: <a href={`mailto:${contact.email}?subject=${encodeURIComponent('בקשה בנושא פרטיות')}`}>{contact.email}</a> או <a href={contact.phoneHref} dir="ltr">{contact.phone}</a>. ניתן לפנות גם לרשות להגנת הפרטיות.</p>
      <h2>שינויים במדיניות</h2>
      <p>נעדכן מדיניות זו כאשר השירותים באתר ישתנו. התאריך בראש העמוד מציין את העדכון האחרון.</p>
    </> : <>
      <p>This policy explains what personal data is collected in connection with the Schechter Real Estate website, why, and your rights under the Israeli Protection of Privacy Law, 1981 and its amendments (including Amendment 13). The website is operated by Schechter Real Estate, {contact.address.en} (“the company”).</p>
      <h2>What we collect and why</h2>
      <ul>
        <li><strong>Inquiry form:</strong> your name, phone and, if you choose, email, project of interest and message. The form does not send anything to a server — it opens an email draft in your mail app, and the company receives it only if you send it. We use it only to respond to your inquiry.</li>
        <li><strong>Project updates:</strong> only if you explicitly tick the box. You can withdraw at any time, and every marketing message includes an unsubscribe option.</li>
        <li><strong>Phone or email:</strong> what you share is used to handle your request.</li>
      </ul>
      <p>You are not legally required to provide data, but without a name and a way to reach you we cannot respond.</p>
      <h2>Cookies, analytics and browser storage</h2>
      <p>This website uses no cookies, analytics, marketing pixels or targeted advertising. Your accessibility preferences are stored only in your browser (localStorage) so they persist between pages; they are never sent to us. Our hosting provider processes technical access data (such as IP address and browser type) for security and operations.</p>
      <p>The Google map on the contact page loads only after you click “Show map”; from then on Google may collect data and set cookies under its own policy. Links to external services (Google Maps, Waze) are subject to their policies.</p>
      <h2>Who receives your data</h2>
      <p>Company staff and service providers acting on our behalf (such as email and hosting providers), only to handle your inquiry and under confidentiality. We never sell personal data. Some providers may store data outside Israel, as permitted by law.</p>
      <h2>Retention and security</h2>
      <p>Inquiry data is kept only as long as needed to handle your request, for an ongoing business relationship or as required by law, and is then deleted. We apply reasonable security measures under the Israeli Privacy Protection (Data Security) Regulations. The website is served over HTTPS.</p>
      <h2>Your rights</h2>
      <p>You may access the data we hold about you, ask us to correct or delete it, and ask to be removed from any mailing list. If you are in the EU or EEA, you also have your rights under the GDPR, including restriction, portability, objection and the right to complain to a supervisory authority. Contact: <a href={`mailto:${contact.email}?subject=Privacy request`}>{contact.email}</a> or <a href={contact.phoneHref} dir="ltr">{contact.phone}</a>. You may also contact the Israeli Privacy Protection Authority.</p>
      <h2>Changes</h2>
      <p>We will update this policy when the website’s services change. The date above shows the latest update.</p>
    </>}
  </article>;
}

export function SiteMap() {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  const pages = [['home', t.home], ['projects', t.pages.projects], ['about', t.pages.about], ['alex-shechter', t.pages.alex], ['urban-renewal', t.pages.urban], ['press', t.pages.media], ['residents', t.pages.residents], ['contact', t.pages.contact], ['accessibility', t.pages.accessibility], ['privacy', t.pages.privacy]];
  return <section className="sitemap wrap">
    <Label>{t.pages.sitemap}</Label>
    <h1 className="display-2">{t.pages.sitemap}</h1>
    <div className="sitemap-cols">
      <div><h2 className="h-small">{t.brand}</h2><ul role="list">{pages.map(([p, label]) => <li key={p}><Link to={href(lang, p)}>{label}</Link></li>)}</ul></div>
      <div><h2 className="h-small">{t.categoriesLong.completed}</h2><ul role="list">{completedProjects.map(p => <li key={p.id}><Link to={href(lang, 'project', p.slug)}>{p.name[lang]}</Link></li>)}</ul></div>
    </div>
  </section>;
}

export function NotFound() {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  return <section className="page-hero wrap not-found">
    <Label>404</Label>
    <h1 className="display-1"><Lines lines={lang === 'he' ? ['העמוד', 'לא נמצא.'] : ['Page', 'not found.']}/></h1>
    <p className="lede">{lang === 'he' ? 'ייתכן שהכתובת השתנתה במעבר לאתר החדש. אפשר להמשיך מכאן:' : 'The address may have changed with the new website. You can continue from here:'}</p>
    <div className="btn-row"><Link to={href(lang)} className="btn btn-solid">{t.home}<Arrow size={20}/></Link><Link to={href(lang, 'projects')} className="btn btn-line">{t.allProjects}</Link></div>
    <h2 className="sr-only">{lang === 'he' ? 'פרויקטים נבחרים' : 'Selected projects'}</h2>
    <div className="card-grid">{[byId[1], byId[6], byId[2]].map(p => <ProjectCard key={p.id} p={p}/>)}</div>
  </section>;
}
