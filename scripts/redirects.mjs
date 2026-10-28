// Permanent (301) redirects from the original WordPress URLs to the new routes.
// Source: recovery/wp-originals/content (REST "link" of every page and post).
const project = slug => `/projects/${slug}/`;
const he = {
  '/פרויקטים/': '/projects/', '/אודות/': '/about/', '/שכטר-38/': '/urban-renewal/', '/צור-קשר/': '/contact/',
  '/הצהרת-נגישות/': '/accessibility/', '/privacy-policy/': '/privacy/',
  '/נופי-עמק-האיילות/מאוכלס/': project('nofei-emek-haayalot'), '/נופי-נחלים/מאוכלס/': project('nofei-nehalim'),
  '/גורדון-33/בבנייה/': project('gordon-33'), '/שכטר-באביגיל/מאוכלס/': project('schechter-abigail'),
  '/שכטר-בגפן/בבנייה/': project('schechter-gefen'), '/נופי-הגבעה/מאוכלס/': project('nofei-hagiva'),
  '/שכטר-בחי״ל/מאוכלס/': project('schechter-hahayil'), '/שכטר-premium/מאוכלס/': project('schechter-premium'),
  '/שכטר-בדונש/מאוכלס/': project('schechter-dunash'), '/שכטר-family/בבנייה/': project('schechter-family'),
  '/שכטר-בגליל-ים/מאוכלס/': project('schechter-galil-yam'), '/כנפי-נשרים/מאוכלס/': project('schechter-knafei-nesharim'),
};
const en = {
  '/en/home/': '/en/', '/en/about-us/': '/en/about/', '/en/contact-us/': '/en/contact/', '/en/schechter-38-en/': '/en/urban-renewal/',
  '/en/gordon-33/under-construction/': '/en' + project('gordon-33'), '/en/nofei-givah/populated/': '/en' + project('nofei-hagiva'),
  '/en/nofei-nechalim/populated/': '/en' + project('nofei-nehalim'), '/en/nofei-emek-haayalot/populated/': '/en' + project('nofei-emek-haayalot'),
  '/en/schechter-in-donash/populated/': '/en' + project('schechter-dunash'), '/en/schechter-family/under-construction/': '/en' + project('schechter-family'),
  '/en/schechter-premium/populated/': '/en' + project('schechter-premium'), '/en/schechter-in-abigail/under-construction/': '/en' + project('schechter-abigail'),
  '/en/schechter-in-galil-yam/populated/': '/en' + project('schechter-galil-yam'), '/en/schechter-in-geffen/under-construction/': '/en' + project('schechter-gefen'),
  '/en/schechter-in-hachayal/under-construction/': '/en' + project('schechter-hahayil'), '/en/schechter-in-kanfei-nesharim/populated/': '/en' + project('schechter-knafei-nesharim'),
};
export const redirects = Object.entries({...he, ...en});
