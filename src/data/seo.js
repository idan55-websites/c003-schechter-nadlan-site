// Search descriptions summarize the published project records and recovered copy.
// Keep the occupied / sold-out status explicit; these are portfolio pages.
// Common transliterations identify the same company without adding keyword lists
// to the visible copy or inventing separate pages for spelling variations.
export const brandAliases = [
  'Schechter Real Estate', 'Schechter Nadlan',
  'Shechter Real Estate', 'Shechter Nadlan',
  'Schachter Real Estate', 'Schachter Nadlan',
  'Shecter Real Estate', 'Shecter Nadlan', 'Schecter Nadlan',
  'שכטר נדלן', 'שכטר נדל"ן', 'S Nadlan', 's-nadlan.com'
];
export const siteNames = ['Schechter Real Estate', 'שכטר נדלן', 's-nadlan.com'];
export const alexAliases = ['Alex Schechter', 'Alex Shechter', 'Alex Schachter', 'Alex Shecter', 'Alex Schecter'];

export const searchTitles = {
  he: {
    home: 'שכטר נדל״ן | יזמות, בנייה והתחדשות עירונית',
    projects: 'פרויקטים מאוכלסים | שכטר נדל״ן',
    about: 'אודות שכטר נדל״ן | יזמות ובנייה מאז 2006',
    contact: 'אלכס שכטר — יצירת קשר | שכטר נדל״ן',
    'urban-renewal': 'התחדשות עירונית ופינוי בינוי | שכטר 38 — שכטר נדל״ן'
  },
  en: {
    home: 'Schechter Real Estate | Development & Urban Renewal',
    projects: 'Completed Residential Projects | Schechter Real Estate',
    about: 'About Schechter Real Estate | Developing Homes Since 2006',
    contact: 'Contact Alex Schechter | Schechter Real Estate',
    'urban-renewal': 'Urban Renewal & Redevelopment | Schechter Real Estate'
  }
};

export const projectDescriptions = {
  1: {
    he: 'שכטר בגפן בז׳בוטינסקי 103, רמת גן. פרויקט מגורים מאוכלס עם דירות 3–5 חדרים ופנטהאוזים, סמוך לרכבת הקלה ולפארק הירקון. כל הדירות נמכרו.',
    en: 'Schechter Gefen, 103 Jabotinsky Street, Ramat Gan. An occupied residential project near the light rail and HaYarkon Park. All apartments are sold out.'
  },
  2: {
    he: 'שכטר Family ברחוב השר משה 23, רמת גן. בניין בוטיק למשפחות עם דירות 5 חדרים, דירות גן, פנטהאוזים וגינת דיירים. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter Family, 23 HaSar Moshe Street, Ramat Gan. A boutique building with garden apartments, penthouses and a residents’ garden. Occupied and sold out.'
  },
  3: {
    he: 'גורדון 33 בשכונת בורוכוב, גבעתיים. בניין בן 7 קומות עם דירות 4 ו־5 חדרים, דירות גן ופנטהאוזים. פרויקט מאוכלס של שכטר נדל״ן; כל הדירות נמכרו.',
    en: 'Gordon 33 in Borochov, Givatayim. A seven-storey Schechter residential building with garden apartments and penthouses. The project is occupied and sold out.'
  },
  4: {
    he: 'שכטר באביגיל ברחוב אביגיל 20, רמת גן. בניין בוטיק בשכונת שנקר, בקרבת פארק הירקון ומתחם הבורסה. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter Abigail, 20 Abigail Street, Ramat Gan. A boutique building in Shenkar near HaYarkon Park and the Diamond Exchange district. Occupied and sold out.'
  },
  5: {
    he: 'שכטר בכנפי נשרים ברחוב כנפי נשרים 27, רמת גן. בניין בוטיק עם דירות 3 ו־4 חדרים, דירות גן ופנטהאוז בסביבה ירוקה. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter Knafei Nesharim, 27 Knafei Nesharim Street, Ramat Gan. A boutique building with garden apartments, a penthouse and sun balconies. Occupied and sold out.'
  },
  6: {
    he: 'שכטר בגליל ים בשדרות הרב קוק 105, הרצליה. בניין בוטיק בן 6 קומות ו־20 דירות, סמוך לפארק הרצליה וקניון שבעת הכוכבים. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter Galil Yam, 105 HaRav Kook Boulevard, Herzliya. A six-storey, 20-home boutique building near Herzliya Park and Seven Stars Mall. Occupied and sold out.'
  },
  7: {
    he: 'שכטר Premium ברחוב תרע״ד 10, רמת גן. בניין בן 9 קומות בשכונת הראשונים עם דירות 2–4 חדרים, דירות גן ופנטהאוזים. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter Premium, 10 Tera’ad Street, Ramat Gan. A nine-storey building in HaRishonim with garden apartments and penthouses. The project is occupied and sold out.'
  },
  8: {
    he: 'שכטר בחי״ל ברחוב החי״ל 6, רמת גן. בניין בוטיק בן 17 דירות בסביבה ירוקה, עם מרפסות וחניות רגילות ללא מכפילים. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter HaHayil, 6 HaHayil Street, Ramat Gan. A boutique building of 17 apartments with balconies and regular parking spaces. The project is occupied and sold out.'
  },
  9: {
    he: 'גבעת אהבה ברחוב נתן אלתרמן 18, רחובות החדשה. מגדל מגורים בן 19 קומות עם דירות 5 חדרים, מיני־פנטהאוזים ופנטהאוזים. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Givat Ahava, 18 Natan Alterman Street, New Rehovot. A 19-storey residential tower with five-room apartments, mini-penthouses and penthouses. Occupied and sold out.'
  },
  10: {
    he: 'שכטר בדונש ברחוב דונש 5, רמת גן, ליד מרום נווה. בניין בן 9 קומות עם דירות 5 חדרים, מרפסות שמש ופנטהאוזים. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Schechter Dunash, 5 Dunash Street, Ramat Gan, near Merom Neve. A nine-storey building with five-room apartments, sun balconies and penthouses. Occupied and sold out.'
  },
  11: {
    he: 'נופי עמק האיילות בגבעת זאב החדשה. פרויקט של שכטר נדל״ן עם 76 יחידות קוטג׳ים, דירות גן ודופלקסי גג עם מרפסות. הפרויקט מאוכלס וכל הדירות נמכרו.',
    en: 'Nofei Emek HaAyalot in New Givat Ze’ev. A Schechter development of 76 cottage units, garden apartments and rooftop duplexes. The project is occupied and sold out.'
  },
  12: {
    he: 'נופי נחלים בפתח תקווה — פרויקט של שכטר נדל״ן הכולל כ־100 יחידות דיור ב־5 בנייני בוטיק. תמונות ופרטי הפרויקט המאוכלס; כל הדירות נמכרו.',
    en: 'Nofei Nehalim, Petah Tikva. A Schechter development of approximately 100 homes in five boutique buildings. View photographs of the occupied, sold-out project.'
  }
};
