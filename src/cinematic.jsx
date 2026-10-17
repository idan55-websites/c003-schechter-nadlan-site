import React from 'react';
import {ArrowDown,ArrowUpLeft,ArrowUpRight,Phone} from 'lucide-react';
import {asset} from './assets.js';
import './cinematic.css';

const text={
 he:{label:'01 / מאחורי כל כתובת',title:['מחשבה רחבה.','עד הפרט האחרון.'],intro:'מהרעיון הראשון ועד למקום שקוראים לו בית.',galil:'שכטר בגליל ים',galilAddress:'שדרות הרב קוק 105, הרצליה',galilTitle:['אדריכלות שנותנת','מקום לחיים.'],galilCopy:'בניין בוטיק. מרפסות שמש. מחשבה על הבית ועל החיים שסביבו.',family:'שכטר Family',familyAddress:'השר משה 23, רמת גן',familyTitle:['בית למשפחה.','מחשבה בכל פרט.'],familyCopy:'בניין בוטיק בסמטה שקטה, עם גינת דיירים פרטית.',details:'להכיר את הפרויקט',photo:'צילום הפרויקט',chapters:['המחשבה','גליל ים','Family'],chapterLabel:'סצנות הפרויקטים',skip:'ישירות לפרויקטים',closingLabel:'07 / הבית הבא מתחיל בשיחה',closing:['כאן מתחיל','הפרק הבא שלכם.'],closingCopy:'על בית חדש. על הבניין שלכם. על מה שחשוב לכם.',contact:'לתיאום פגישה אישית',dunash:'שכטר בדונש · דונש 5, רמת גן'},
 en:{label:'01 / Behind every address',title:['A wider vision.','A finer detail.'],intro:'From the very first idea to the place you call home.',galil:'Schechter Galil Yam',galilAddress:'105 HaRav Kook Boulevard, Herzliya',galilTitle:['Architecture with','room for life.'],galilCopy:'A boutique building. Sun balconies. Thought for your home and the life around it.',family:'Schechter Family',familyAddress:'23 HaSar Moshe Street, Ramat Gan',familyTitle:['A home for family.','Care in every detail.'],familyCopy:'A boutique building on a quiet lane, with a private residents’ garden.',details:'Discover the project',photo:'Project photograph',chapters:['The vision','Galil Yam','Family'],chapterLabel:'Project scenes',skip:'Skip to the portfolio',closingLabel:'07 / A conversation is the first step',closing:['Your next chapter','starts here.'],closingCopy:'About a new home. Your building. What matters to you.',contact:'Arrange a personal meeting',dunash:'Schechter Dunash · 5 Dunash Street, Ramat Gan'}
};
const route=(path,en)=>`#/${en?'en/':''}${path}`;
export function CinematicHeadline({lines}){
 return <h2 className="cinematic-reading" aria-label={lines.join(' ')}>{lines.map((line,i)=><span className="cinematic-reading-line" key={i} aria-hidden="true">{line.split(' ').map((word,j)=><span className="cinematic-word" key={j}>{word}{' '}</span>)}</span>)}</h2>
}
export function ArchitecturalSequence({english=false}){
 const t=text[english?'en':'he'];const Arrow=english?ArrowUpRight:ArrowUpLeft;
 function navigate(event,index){
  const sequence=event.currentTarget.closest('.architecture-sequence');
  const active=sequence.closest('.cinematic-active');
  if(!active){sequence.querySelectorAll('[data-scene-copy]')[index]?.scrollIntoView({block:'center'});return}
  const top=sequence.getBoundingClientRect().top+window.scrollY;
  const distance=sequence.offsetHeight-sequence.querySelector('.architecture-stage').offsetHeight;
  window.scrollTo({top:top+distance*[0,.47,.94][index],behavior:'smooth'});
 }
 function skip(e){e.preventDefault();document.getElementById('selected')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduce-motion')?'instant':'smooth'});}
 return <section className="architecture-sequence" aria-label={english?'Architecture and the places we build':'האדריכלות והבתים שלנו'} data-active-stage="0">
  <div className="architecture-stage">
   <header className="architecture-opening" data-scene-copy><p className="cinematic-kicker">{t.label}</p><h2>{t.title.map((line,i)=><span key={line}>{i===1?<em>{line}</em>:line}</span>)}</h2><p>{t.intro}</p></header>
   <figure className="architecture-frame architecture-frame--galil"><img className="architecture-image" src={asset('images/galil-yam-site-1.webp')} alt={`${t.photo} — ${t.galil}`} width="828" height="561" loading="lazy" decoding="async"/><div className="architecture-shade"/>
    <figcaption className="architecture-caption architecture-caption--galil" data-scene-copy><p className="cinematic-kicker">{t.galilAddress}</p><h2>{t.galilTitle.map(line=><span key={line}>{line}</span>)}</h2><p>{t.galilCopy}</p><a className="cinematic-link" href={route('project/6',english)}>{t.details}<Arrow size={20}/></a><small>{t.galil} · {t.photo}</small></figcaption>
   </figure>
   <figure className="architecture-frame architecture-frame--family"><img className="architecture-backdrop" src={asset('images/family-site-2.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async"/><img className="architecture-image" src={asset('images/family-site-2.webp')} alt={`${t.photo} — ${t.family}`} width="900" height="1600" loading="lazy" decoding="async"/><div className="architecture-shade"/>
    <figcaption className="architecture-caption architecture-caption--family" data-scene-copy><p className="cinematic-kicker">{t.familyAddress}</p><h2>{t.familyTitle.map(line=><span key={line}>{line}</span>)}</h2><p>{t.familyCopy}</p><a className="cinematic-link" href={route('project/2',english)}>{t.details}<Arrow size={20}/></a><small>{t.family} · {t.photo}</small></figcaption>
   </figure>
   <div className="architecture-controls"><div className="architecture-chapters" aria-label={t.chapterLabel}>{t.chapters.map((label,i)=><button type="button" key={label} onClick={e=>navigate(e,i)} aria-pressed={i===0}><span dir="ltr">0{i+1}</span><span>{label}</span></button>)}</div><a href="#selected" onClick={skip}>{t.skip}<ArrowDown size={16}/></a><div className="architecture-progress" aria-hidden="true"><span/></div></div>
  </div>
 </section>
}
export function CinematicClosing({english=false}){
 const t=text[english?'en':'he'];const Arrow=english?ArrowUpRight:ArrowUpLeft;
 return <section className="cinematic-closing" aria-labelledby="cinematic-closing-title"><div className="closing-image"><img src={asset('images/dunash-5-site-2.webp')} alt={`${t.photo} — ${t.dunash}`} width="900" height="1600" loading="lazy" decoding="async"/></div><div className="closing-shade"/><div className="closing-content"><p className="cinematic-kicker">{t.closingLabel}</p><h2 id="cinematic-closing-title">{t.closing.map(line=><span className="closing-line" key={line}><span>{line}</span></span>)}</h2><p>{t.closingCopy}</p><div className="closing-actions"><a className="button button-light" href={route('contact',english)}>{t.contact}<Arrow size={20}/></a><a className="closing-phone" href="tel:+972768844262"><Phone size={17}/><span dir="ltr">{english?'+972 76 884 4262':'076-8844262'}</span></a></div></div><small className="closing-credit">{t.dunash} · {t.photo}</small></section>
}
