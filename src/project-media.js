export const mediaKind = (p, index = 0) => p.media?.[index]?.kind || 'render';
export function mediaLabel(p, index = 0, en = false) {
 const kind = mediaKind(p, index);
 return kind === 'photo' ? (en ? 'Project photograph' : 'צילום הפרויקט') : kind === 'construction-photo' ? (en ? 'Construction photograph' : 'צילום משלב הבנייה') : (en ? 'Architectural rendering' : 'הדמיה');
}
export const categories = {completed:'פרויקטים מאוכלסים',construction:'פרויקטים בבנייה',future:'פרויקטים עתידיים',archive:'פרויקטים נוספים מהארכיון'};

export const normalizeSearch = text => text.toLowerCase().replace(/[\p{P}\p{Z}\p{M}]/gu,'').trim();
