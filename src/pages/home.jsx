import React, {useEffect, useState} from 'react';
import {href, useRouter} from '../lib/router.jsx';
import {strings, contact} from '../data/site.js';
import {completedProjects, featured, byId} from '../data/projects.js';
import {Link, Picture, LazyVideo, Lines, Label, Arrow, ArrowDiag, Play, Pause, Phone, Mail, asset} from '../components/ui.jsx';
import {Status} from '../components/project-ui.jsx';
import {ContactForm} from '../components/contact-form.jsx';

const v = name => asset(`media/video/${name}`);
export const filmSources = [
  {src: v('film-mobile.webm'), type: 'video/webm', media: '(max-width: 699px)'},
  {src: v('film-mobile.mp4'), type: 'video/mp4', media: '(max-width: 699px)'},
  {src: v('film-1280.webm'), type: 'video/webm', media: '(min-width: 700px) and (max-width: 1280px)'},
  {src: v('film-1280.mp4'), type: 'video/mp4', media: '(min-width: 700px) and (max-width: 1280px)'},
  {src: v('film-wide.webm'), type: 'video/webm', media: '(min-width: 1281px)'},
  {src: v('film-wide.mp4'), type: 'video/mp4', media: '(min-width: 1281px)'}
];

const copy = {
  he: {
    kicker: 'שכטר נדל״ן · יזמות, בנייה והתחדשות עירונית',
    title: ['לגור', 'בסטנדרט', 'אירופאי.'],
    intro: 'בנייני בוטיק, מגדלי מגורים והתחדשות עירונית ברמת גן, גבעתיים, הרצליה ורחובות — בהקפדה של מסורת בנייה אירופאית.',
    explore: 'לגלות את הפרויקטים',
    statementLabel: 'החברה',
    statement: 'שכטר נדל״ן היא חברה לייזום פרויקטים מהמובילות והחדשניות בישראל. החברה בבעלות משפחת שכטר, הפועלים באירופה ובישראל ומשקיעים בנדל״ן בארץ מאז 2006.',
    more: 'עוד על שכטר נדל״ן',
    selectedLabel: 'פרויקטים נבחרים', selectedTitle: ['כל בניין —', 'כתובת לאיכות חיים.'],
    detailLabel: 'הפרטים', detailTitle: ['איכות שמרגישים', 'בכל פרט.'],
    detail: 'איכות החומרים המעולה, רמת הגימור יוצאת הדופן, הקפדה על כל פרט ומפרט טכני עשיר ומרשים — כדי להבטיח את שביעות רצונם של הלקוחות לאורך שנים.',
    values: ['יושרה', 'אמינות', 'ליווי אישי', 'שקיפות מלאה'],
    valuesLabel: 'הערכים שלנו',
    stats: [['שנת תחילת הפעילות בישראל'], ['פרויקטים מאוכלסים'], ['ערים ושכונות בפרויקטים המאוכלסים']],
    indexLabel: 'תיק הפרויקטים', indexTitle: 'מרמת גן ועד הרצליה.',
    urbanLabel: 'שכטר 38 · התחדשות עירונית', urbanQuote: ['אנשים אינם', '״בטון ולבנים״.'],
    urbanCopy: 'תמ״א 38 ופינוי בינוי הם, עוד לפני היותם תוכנית נדל״ן, תוכנית חברתית. אנחנו מלווים את הדיירים צעד צעד, יד ביד — בשותפות ובשקיפות מלאה.',
    urbanCta: 'להתחדשות העירונית',
    closeLabel: 'נשמח לדבר', closeTitle: ['לתיאום', 'פגישה אישית.']
  },
  en: {
    kicker: 'Schechter Real Estate · Development, construction & urban renewal',
    title: ['Living to a', 'European', 'standard.'],
    intro: 'Boutique buildings, residential towers and urban renewal in Ramat Gan, Givatayim, Herzliya and Rehovot — built with the care of a European tradition.',
    explore: 'Explore the projects',
    statementLabel: 'The company',
    statement: 'Schechter Real Estate initiates some of the leading and most innovative residential projects in Israel. The company is owned by the Schechter family, who operate in Europe and Israel and have invested in Israeli real estate since 2006.',
    more: 'More about Schechter',
    selectedLabel: 'Selected projects', selectedTitle: ['Every building —', 'an address for quality living.'],
    detailLabel: 'The details', detailTitle: ['Quality you can feel', 'in every detail.'],
    detail: 'Excellent materials, an exceptional level of finish, meticulous attention to every detail and a rich technical specification — to ensure our clients’ satisfaction for years to come.',
    values: ['Integrity', 'Reliability', 'Personal care', 'Full transparency'],
    valuesLabel: 'Our values',
    stats: [['Active in Israel since'], ['Completed and occupied projects'], ['Cities and neighborhoods with occupied projects']],
    indexLabel: 'Portfolio', indexTitle: 'From Ramat Gan to Herzliya.',
    urbanLabel: 'Schechter 38 · Urban renewal', urbanQuote: ['People are not', '“concrete and bricks”.'],
    urbanCopy: 'TAMA 38 and vacate-and-rebuild are, before anything else, social plans. We accompany residents step by step, hand in hand — in partnership and full transparency.',
    urbanCta: 'Urban renewal',
    closeLabel: 'Let’s talk', closeTitle: ['Book a', 'personal meeting.']
  }
};

export default function Home() {
  const {route: {lang}} = useRouter();
  const c = copy[lang], t = strings[lang];
  const [playing, setPlaying] = useState(true);
  // The floating index preview only exists for fine pointers on wide screens.
  const [hoverPreview, setHoverPreview] = useState(false);
  useEffect(() => setHoverPreview(matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches), []);
  const cities = new Set(completedProjects.map(p => p.city.he).filter(Boolean)).size;
  const stats = [[2006, c.stats[0]], [completedProjects.length, c.stats[1]], [cities, c.stats[2]]];
  const index = completedProjects.filter(p => p.cover);
  return <>
    <section className="hero" data-hero>
      <div className="hero-copy wrap">
        <p className="hero-kicker reveal-up">{c.kicker}</p>
        <h1 className="hero-title"><Lines lines={c.title}/></h1>
        <div className="hero-foot">
          <p className="hero-intro reveal-up">{c.intro}</p>
          <Link to={href(lang, 'projects')} className="btn btn-light reveal-up">{c.explore}<Arrow size={20}/></Link>
        </div>
      </div>
      <figure className="hero-film" data-film>
        <div className="film-frame">
          <div className="film-inner">
          <picture className="film-poster">
            <source type="image/avif" srcSet={`${v('film-mobile-poster.avif')}`} media="(max-width: 699px)"/>
            <source type="image/webp" srcSet={`${v('film-mobile-poster.webp')}`} media="(max-width: 699px)"/>
            <source type="image/avif" srcSet={`${v('film-wide-poster.avif')}`}/>
            <img src={v('film-wide-poster.webp')} alt="" width="1904" height="630" fetchPriority="high"/>
          </picture>
          <LazyVideo className="film-video" sources={filmSources} label={t.filmTitle} describedBy="film-description" playing={playing} onPlayingChange={setPlaying}/>
          </div>
        </div>
        <figcaption className="film-caption wrap">
          <span className="film-meta" dir="ltr">SCHECHTER — FILM · 00:30</span>
          <button type="button" className="film-toggle" onClick={() => setPlaying(!playing)}>
            {playing ? <Pause size={16}/> : <Play size={16}/>}<span>{playing ? t.pause : t.play}</span>
          </button>
        </figcaption>
      </figure>
      <p className="film-description wrap" id="film-description">{t.film}</p>
    </section>

    <section className="statement wrap" aria-labelledby="statement-label">
      <Label n="01"><span id="statement-label">{c.statementLabel}</span></Label>
      <p className="statement-text" data-words>{c.statement.split(' ').map((w, i, a) => <React.Fragment key={i}><span className="word">{w}</span>{i < a.length - 1 ? ' ' : ''}</React.Fragment>)}</p>
      <Link to={href(lang, 'about')} className="link-arrow rv">{c.more}<Arrow size={18}/></Link>
      <Link to={href(lang, 'alex-shechter')} className="link-arrow rv">{lang === 'he' ? 'ליצירת קשר עם אלכס שכטר' : 'Contact Alex Shechter'}<Arrow size={18}/></Link>
    </section>

    <section className="selected" aria-labelledby="selected-title">
      <div className="section-head wrap">
        <Label n="02">{c.selectedLabel}</Label>
        <h2 id="selected-title" className="display-2"><Lines lines={c.selectedTitle}/></h2>
      </div>
      {featured.map((p, i) => <article className={`plate ${i % 2 ? 'is-flipped' : ''}`} key={p.id}>
        <Link to={href(lang, 'project', p.slug)} className="plate-media" data-cursor={t.discover} aria-label={`${p.name[lang]} — ${t.discover}`} tabIndex={-1}>
          <div className="clip-reveal"><Picture name={p.hero.name} alt="" sizes="(min-width: 900px) 62vw, 100vw" fit={p.hero.w < 1400 ? 'contain' : 'cover'} className={p.hero.w < 1400 ? '' : 'parallax-inner'}/></div>
        </Link>
        <div className="plate-body">
          <span className="plate-n" dir="ltr">{String(i + 1).padStart(2, '0')}<small>/{String(featured.length).padStart(2, '0')}</small></span>
          <div className="plate-status"><Status p={p} lang={lang}/></div>
          <h3 className="plate-title"><Link to={href(lang, 'project', p.slug)}>{p.name[lang]}</Link></h3>
          <p className="plate-address">{p.address[lang]}</p>
          {p.tagline && <p className="plate-tagline">{p.tagline[lang]}</p>}
          {p.architect && <p className="plate-meta"><span>{t.architect}</span>{p.architect[lang]}</p>}
          <Link to={href(lang, 'project', p.slug)} className="link-arrow">{t.discover}<Arrow size={18}/></Link>
        </div>
      </article>)}
    </section>

    <section className="detail" aria-labelledby="detail-title">
      <div className="detail-copy wrap">
        <Label n="03">{c.detailLabel}</Label>
        <h2 id="detail-title" className="display-2"><Lines lines={c.detailTitle}/></h2>
        <p className="lede rv">{c.detail}</p>
      </div>
      <div className="mosaic">
        <div className="mosaic-a" data-speed="-0.08"><Picture name="gefen-duplex-1" alt={`${t.kinds.interior} — ${byId[1].name[lang]}`} sizes="(min-width: 900px) 46vw, 90vw"/></div>
        <div className="mosaic-b" data-speed="0.1"><Picture name="hagiva-salon" alt={`${t.kinds.interior} — ${byId[9].name[lang]}`} sizes="(min-width: 900px) 34vw, 70vw"/></div>
        <div className="mosaic-c" data-speed="-0.16"><Picture name="family-living-2" alt={`${t.kinds.interior} — ${byId[2].name[lang]}`} sizes="(min-width: 900px) 26vw, 55vw"/></div>
      </div>
      <div className="values wrap" aria-label={c.valuesLabel}>
        <p className="sr-only">{c.valuesLabel}</p>
        <ul role="list">{c.values.map((value, i) => <li key={value} className="value rv" style={{'--i': i}}><span>{String(i + 1).padStart(2, '0')}</span>{value}</li>)}</ul>
      </div>
    </section>

    <section className="stats wrap" aria-label={lang === 'he' ? 'שכטר נדל״ן במספרים' : 'Schechter in numbers'}>
      {stats.map(([n, [label]], i) => <div className="stat rv" key={label} style={{'--i': i}}>
        <span className="stat-n" data-count={n}>{n}</span><span className="stat-label">{label}</span>
      </div>)}
    </section>

    <section className="index wrap" aria-labelledby="index-title" data-index>
      <div className="section-head">
        <Label n="04">{c.indexLabel}</Label>
        <h2 id="index-title" className="display-2"><Lines lines={[c.indexTitle]}/></h2>
      </div>
      <ol className="index-list" role="list">
        {index.map((p, i) => <li key={p.id} className="index-row rv">
          <Link to={href(lang, 'project', p.slug)} data-preview={p.cover.name}>
            <span className="index-n" dir="ltr">{String(i + 1).padStart(2, '0')}</span>
            <span className="index-thumb" aria-hidden="true"><Picture name={p.cover.name} sizes="96px"/></span>
            <span className="index-name">{p.name[lang]}{p.soldOut && <small>{t.soldOut}</small>}</span>
            <span className="index-city">{p.city[lang]}</span>
            <span className="index-status">{t.categories[p.category]}</span>
            <ArrowDiag size={20}/>
          </Link>
        </li>)}
      </ol>
      {hoverPreview && <div className="index-preview" aria-hidden="true">{index.map(p => <span key={p.id} className="index-preview-img" data-name={p.cover.name}><Picture name={p.cover.name} sizes="380px"/></span>)}</div>}
      <Link to={href(lang, 'projects')} className="btn btn-line rv">{t.allProjects}<Arrow size={20}/></Link>
    </section>

    <section className="urban-teaser" aria-labelledby="urban-quote">
      <div className="urban-teaser-copy wrap">
        <Label n="05" light>{c.urbanLabel}</Label>
        <h2 id="urban-quote" className="display-1"><Lines lines={c.urbanQuote}/></h2>
        <div className="urban-teaser-foot">
          <p className="rv">{c.urbanCopy}</p>
          <Link to={href(lang, 'urban-renewal')} className="btn btn-light rv">{c.urbanCta}<Arrow size={20}/></Link>
        </div>
      </div>
      <div className="marquee" aria-hidden="true"><div className="marquee-track">
        {[0, 1].map(k => <div className="marquee-group" key={k}>{['01', '03', '05', '07', '09', '11', '13', '15'].map(n => <Picture key={n + k} name={`urban-site-${n}`} sizes="320px"/>)}</div>)}
      </div></div>
    </section>

    <section className="closing wrap" aria-labelledby="closing-title">
      <div className="closing-copy">
        <Label n="06">{c.closeLabel}</Label>
        <h2 id="closing-title" className="display-2"><Lines lines={c.closeTitle}/></h2>
        <ul className="contact-lines" role="list">
          <li><a href={contact.phoneHref}><Phone size={20}/><span dir="ltr">{contact.phone}</span></a></li>
          <li><a href={`mailto:${contact.email}`}><Mail size={20}/>{contact.email}</a></li>
          <li><span>{contact.address[lang]}</span></li>
        </ul>
      </div>
      <ContactForm compact/>
    </section>
  </>;
}
