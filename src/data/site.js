// Contact number confirmed by the client on 28 October 2026.
const phone = '0544259337';
const phoneE164 = `+972${phone.slice(1)}`;
const phoneHref = `tel:${phoneE164}`;
export const contact = {
  phone, phoneE164, phoneHref,
  email: 'info@s-nadlan.com',
  alex: {email: 'alexs@s-nadlan.com', phone, phoneHref},
  address: {he: 'כנרת 5, מגדל ב.ס.ר, רמת גן 5158219', en: 'B.S.R. Tower, 5 Kineret Street, Ramat Gan 5158219'},
  addressShort: {he: 'כנרת 5, מגדל ב.ס.ר', en: '5 Kineret St., B.S.R. Tower'},
  maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('מגדל ב.ס.ר 3 כנרת 5'),
  waze: 'https://waze.com/ul?q=' + encodeURIComponent('כנרת 5 מגדל ב.ס.ר'),
  hours: {he: 'א׳–ה׳, 09:00–16:00', en: 'Sun–Thu, 09:00–16:00'}
};

export const press = [
  {source: pair('כאן בונים', 'Kan Bonim'), date: '2016-02-03', title: pair('״מי שאין לו יחסי אנוש טובים, שלא ייכנס לעסקי התמ״א״', '“Without good people skills, stay out of TAMA”'), copy: pair('כתבה על ההיבט האנושי של התחדשות עירונית ועל חשיבות הקשר עם בעלי הדירות. שרי תורג׳מן, סמנכ״לית החברה לשעבר, שוחחה על ליווי הדיירים ועל האתגרים בענף.', 'An article on the human side of urban renewal and the importance of relationships with homeowners. Former company vice president Shari Turgeman discussed resident support and the challenges of the industry.')},
  {source: pair('אזורי.נט', 'Azori.net'), date: '2014-09-11', title: pair('התחדשות עירונית ברמלה, שינוי פני העיר', 'Urban renewal in Ramla, changing the face of the city'), copy: pair('כנסי דיירים ראשונים לתושבי שכונת ויצמן ברמלה במסגרת תוכנית להתחדשות עירונית. הכנסים אורגנו על ידי שכטר אופטיקנה נדל״ן, עם דגש על ליווי הדיירים מהשלב הראשון.', 'First residents’ meetings in Ramla’s Weizmann neighborhood as part of an urban renewal plan, organized by Schechter Opticana Real Estate with a focus on supporting residents from the very first step.')},
  {source: pair('כלכליסט', 'Calcalist'), date: '2012-07-31', title: pair('בעלי אופטיקנה נכנסים לתחום הייזום בשיתוף פעולה עם קבוצת שכטר', 'Opticana owners enter development with the Schechter Group'), copy: pair('הכתבה עסקה בשיתוף הפעולה בין קבוצת שכטר לאופטיקנה וברכישת זכויות לקרקע עבור דופלקסים וקוטג׳ים.', 'The article covered the cooperation between the Schechter Group and Opticana and the acquisition of land rights for duplexes and cottages.')}
];
function pair(he, en) { return {he, en}; }

export const strings = {
  he: {
    brand: 'שכטר נדל״ן', tagline: 'לגור בסטנדרט אירופאי', skip: 'דילוג לתוכן',
    nav: {projects: 'פרויקטים', about: 'אודות', urban: 'שכטר 38', media: 'במדיה', contact: 'צור קשר'},
    menu: 'תפריט', close: 'סגירה', switchLang: 'English', switchLangLabel: 'Switch to English', cta: 'לתיאום פגישה',
    home: 'ראשי', homeLabel: 'שכטר נדל״ן — לעמוד הבית',
    categories: {completed: 'מאוכלסים', construction: 'בבנייה', archive: 'מהארכיון'},
    categoriesLong: {completed: 'פרויקטים מאוכלסים', construction: 'פרויקטים בבנייה', archive: 'פרויקטים נוספים מהארכיון'},
    stage: {planning: 'בהליכי תכנון', permit: 'ניתן היתר בתנאים'},
    kinds: {render: 'הדמיה', interior: 'הדמיית פנים', photo: 'צילום', 'construction-photo': 'צילום מהאתר'},
    soldOut: 'נמכרו כל הדירות', architect: 'אדריכלות', financing: 'גורם מלווה', city: 'עיר', status: 'סטטוס', address: 'כתובת',
    discover: 'לגלות את הפרויקט', allProjects: 'לכל הפרויקטים', viewGallery: 'צפייה בגלריה', next: 'הפרויקט הבא',
    gallery: 'גלריה', specs: 'מפרט טכני', apartments: 'סוגי דירות', location: 'מיקום', highlights: 'יתרונות הפרויקט',
    openMaps: 'ניווט ב־Google Maps', openWaze: 'ניווט ב־Waze', inquire: 'אשמח לקבל פרטים', prev: 'הקודם', nextImg: 'הבא',
    closeGallery: 'סגירת הגלריה', image: 'תמונה', of: 'מתוך', noImages: 'הדמיות ותמונות הפרויקט יפורסמו בהמשך. לפרטים נוספים, נשמח לשוחח.', noStory: 'הפרויקט הוא חלק מתיק הפרויקטים של שכטר נדל״ן. למידע עדכני על התכנון ועל שלבי הפרויקט, נשמח לשוחח.',
    search: 'חיפוש לפי שם או כתובת', allCities: 'כל הערים', results: n => `${n} פרויקטים`, empty: 'לא נמצאו פרויקטים שתואמים את החיפוש.', reset: 'איפוס',
    since: 'מאז', scroll: 'גללו', play: 'הפעלת הסרט', pause: 'השהיית הסרט', film: 'סרט התדמית המקורי של שכטר נדל״ן: צילומי רחפן מעל פארק הירקון, מגדלי רמת גן ואתרי התחדשות עירונית, עם סמל החברה. ללא קול.',
    form: {
      legend: 'השאירו פרטים ונחזור אליכם', name: 'שם מלא', phone: 'טלפון', email: 'אימייל', project: 'הפרויקט שמעניין אתכם', general: 'פנייה כללית',
      message: 'הודעה', optional: 'רשות', required: 'שדה חובה', consent: 'אני מאשר/ת שהפרטים ישמשו לחזרה אליי בנוגע לפנייה זו, כמפורט במדיניות הפרטיות.',
      updates: 'אשמח לקבל עדכונים על פרויקטים נוספים (רשות)', submit: 'שליחת הפנייה',
      note: 'השליחה פותחת טיוטת אימייל מוכנה בתוכנת הדואר שלכם — ההודעה נשלחת רק כשתלחצו על ״שלח״ שם. הפרטים אינם נשמרים באתר.',
      errorsTitle: 'כדי להמשיך, יש לתקן:', errName: 'יש להזין שם מלא.', errPhone: 'יש להזין מספר טלפון תקין, לדוגמה 050-1234567.', errEmail: 'יש להזין כתובת אימייל תקינה, לדוגמה name@example.com.', errConsent: 'יש לאשר את השימוש בפרטים כדי שנוכל לחזור אליכם.',
      done: `טיוטת האימייל נפתחה. לסיום, לחצו ״שלח״ בתוכנת הדואר. אם לא נפתחה טיוטה, כתבו לנו ישירות ל־${contact.email} או התקשרו ל־${contact.phone}.`,
      subject: name => `פנייה מאתר שכטר נדל״ן — ${name}`
    },
    a11y: {open: 'הגדרות נגישות', title: 'נגישות', motion: 'הפחתת תנועה', contrast: 'ניגודיות גבוהה', links: 'הדגשת קישורים', text: 'הגדלת טקסט', reset: 'איפוס הגדרות', statement: 'להצהרת הנגישות'},
    footer: {lead: 'הבית הבא שלכם מתחיל בשיחה.', explore: 'ניווט', contactTitle: 'יצירת קשר', legal: 'מידע', rights: 'כל הזכויות שמורות.', privacy: 'מדיניות פרטיות', accessibility: 'הצהרת נגישות', sitemap: 'מפת האתר', residents: 'שירות לדיירים'},
    pages: {projects: 'הפרויקטים', about: 'אודות', urban: 'שכטר 38 — התחדשות עירונית', media: 'שכטר במדיה', residents: 'שירות לדיירים', contact: 'צור קשר', accessibility: 'הצהרת נגישות', privacy: 'מדיניות פרטיות', sitemap: 'מפת האתר', notFound: 'העמוד לא נמצא'}
  },
  en: {
    brand: 'Schechter Real Estate', tagline: 'Living to a European standard', skip: 'Skip to content',
    nav: {projects: 'Projects', about: 'About', urban: 'Schechter 38', media: 'Press', contact: 'Contact'},
    menu: 'Menu', close: 'Close', switchLang: 'עברית', switchLangLabel: 'מעבר לעברית', cta: 'Book a meeting',
    home: 'Home', homeLabel: 'Schechter Real Estate — home',
    categories: {completed: 'Completed', construction: 'Under construction', archive: 'Archive'},
    categoriesLong: {completed: 'Completed projects', construction: 'Projects under construction', archive: 'More from our archive'},
    stage: {planning: 'In planning', permit: 'Permit granted with conditions'},
    kinds: {render: 'Rendering', interior: 'Interior rendering', photo: 'Photograph', 'construction-photo': 'Site photograph'},
    soldOut: 'Sold out', architect: 'Architecture', financing: 'Financing partner', city: 'City', status: 'Status', address: 'Address',
    discover: 'Discover the project', allProjects: 'All projects', viewGallery: 'View gallery', next: 'Next project',
    gallery: 'Gallery', specs: 'Specifications', apartments: 'Apartment types', location: 'Location', highlights: 'Project highlights',
    openMaps: 'Open in Google Maps', openWaze: 'Navigate with Waze', inquire: 'Request details', prev: 'Previous', nextImg: 'Next',
    closeGallery: 'Close gallery', image: 'Image', of: 'of', noImages: 'Project renderings and photographs will be published later. We will be happy to tell you more.', noStory: 'This project is part of the Schechter Real Estate portfolio. For current planning and stage information, we will be happy to talk.',
    search: 'Search by name or address', allCities: 'All cities', results: n => `${n} projects`, empty: 'No projects match your search.', reset: 'Reset',
    since: 'Since', scroll: 'Scroll', play: 'Play film', pause: 'Pause film', film: 'Schechter Real Estate’s original brand film: drone footage over HaYarkon Park, the Ramat Gan skyline and urban renewal sites, with the company emblem. No sound.',
    form: {
      legend: 'Leave your details and we will get back to you', name: 'Full name', phone: 'Phone', email: 'Email', project: 'Project of interest', general: 'General inquiry',
      message: 'Message', optional: 'optional', required: 'required', consent: 'I agree that these details will be used to respond to this inquiry, as described in the privacy policy.',
      updates: 'Send me updates about other projects (optional)', submit: 'Send inquiry',
      note: 'Sending opens a ready-made email in your mail app — the message is only sent when you press “Send” there. Nothing is stored on this website.',
      errorsTitle: 'To continue, please fix:', errName: 'Please enter your full name.', errPhone: 'Please enter a valid phone number, for example +972 50-123-4567.', errEmail: 'Please enter a valid email address, for example name@example.com.', errConsent: 'Please confirm that we may use your details to respond.',
      done: `Your email draft is open. To finish, press “Send” in your mail app. If no draft opened, write to ${contact.email} or call ${contact.phone}.`,
      subject: name => `Inquiry from the Schechter website — ${name}`
    },
    a11y: {open: 'Accessibility settings', title: 'Accessibility', motion: 'Reduce motion', contrast: 'High contrast', links: 'Highlight links', text: 'Larger text', reset: 'Reset settings', statement: 'Accessibility statement'},
    footer: {lead: 'Your next home begins with a conversation.', explore: 'Explore', contactTitle: 'Contact', legal: 'Information', rights: 'All rights reserved.', privacy: 'Privacy policy', accessibility: 'Accessibility statement', sitemap: 'Sitemap', residents: 'Resident services'},
    pages: {projects: 'Projects', about: 'About', urban: 'Schechter 38 — Urban renewal', media: 'Press', residents: 'Resident services', contact: 'Contact', accessibility: 'Accessibility statement', privacy: 'Privacy policy', sitemap: 'Sitemap', notFound: 'Page not found'}
  }
};
