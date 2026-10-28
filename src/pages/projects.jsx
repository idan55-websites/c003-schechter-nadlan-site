import React, {useEffect, useMemo, useState} from 'react';
import {href, useRouter} from '../lib/router.jsx';
import {strings, contact} from '../data/site.js';
import {projects, completedProjects, bySlug} from '../data/projects.js';
import {Link, Picture, LazyVideo, Lines, Label, Arrow, ArrowDiag, Search, Close, Pin, asset} from '../components/ui.jsx';
import {ProjectCard, FutureProjects, Gallery, Status, Emblem} from '../components/project-ui.jsx';

const normalize = s => s.toLowerCase().replace(/[\p{P}\p{Z}\p{M}״׳"']/gu, '');

export function Projects() {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');
  const cities = [...new Set(completedProjects.map(p => p.city[lang]).filter(Boolean))];
  const list = useMemo(() => completedProjects.filter(p => (!city || p.city[lang] === city) &&
    normalize([p.name.he, p.name.en, p.address.he, p.address.en, ...p.aliases].join(' ')).includes(normalize(q))), [city, q, lang]);
  useEffect(() => { window.dispatchEvent(new CustomEvent('content-change')); }, [list]);
  return <>
    <section className="page-hero wrap">
      <Label>{lang === 'he' ? 'תיק הפרויקטים' : 'Portfolio'}</Label>
      <h1 className="display-1"><Lines lines={lang === 'he' ? ['הפרויקטים', 'שלנו.'] : ['Our', 'projects.']}/></h1>
      <p className="lede reveal-up">{lang === 'he' ? 'בנייני בוטיק, מגדלי מגורים, שכונות קוטג׳ים והתחדשות עירונית — מרמת גן ועד הרצליה.' : 'Boutique buildings, residential towers, cottage neighborhoods and urban renewal — from Ramat Gan to Herzliya.'}</p>
    </section>
    <section className="catalog wrap" aria-label={t.pages.projects}>
      <div className="catalog-bar">
        <span className="chip">{t.categories.completed}</span>
        <div className="catalog-filters">
          {cities.length > 1 && <div className="select"><select aria-label={t.city} value={city} onChange={e => setCity(e.target.value)}>
            <option value="">{t.allCities}</option>{cities.map(c => <option key={c}>{c}</option>)}</select></div>}
          <label className="search"><Search size={18}/><span className="sr-only">{t.search}</span>
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t.search}/>
            {q && <button type="button" onClick={() => setQ('')} aria-label={t.reset}><Close size={16}/></button>}
          </label>
        </div>
      </div>
      <h2 className="catalog-count" aria-live="polite">{t.categoriesLong.completed} · {t.results(list.length)}</h2>
      {list.length ? <div className="card-grid">{list.map((p, i) => <ProjectCard key={p.id} p={p} index={i}/>)}</div> :
        <div className="empty"><p>{t.empty}</p><button type="button" className="btn btn-line" onClick={() => { setCity(''); setQ(''); }}>{t.reset}</button></div>}
      <FutureProjects/>
    </section>
  </>;
}

const v = name => asset(`media/video/${name}`);

export function Project() {
  const {route: {lang, slug}} = useRouter();
  const t = strings[lang];
  const p = bySlug[slug];
  const framedHero = p.hero && (p.hero.w < 1400 || p.hero.w / p.hero.h < 0.85);
  const ordered = projects.filter(x => x.gallery.length);
  const next = p.gallery.length ? ordered[(ordered.indexOf(p) + 1) % ordered.length] : ordered[0];
  const framedNext = next?.hero && (next.hero.w < 1400 || next.hero.w / next.hero.h < 0.85);
  const facts = [
    p.city[lang] && [t.city, p.city[lang]],
    [t.address, p.address[lang]],
    p.architect && [t.architect, p.architect[lang]],
    p.financing && [t.financing, p.financing[lang]],
    // The architect is already listed above; skip duplicate architect facts.
    ...p.facts[lang].filter(([k]) => !(p.architect && /אדריכל|תכנון אדריכלי|Architect/.test(k)))
  ].filter(Boolean);
  const mapQuery = encodeURIComponent(p.address.he);
  return <>
    <section className={`project-hero ${p.hero ? framedHero ? 'is-framed' : '' : 'is-plain'}`} data-hero>
      {p.hero && <div className="project-hero-media" style={{'--hero-ratio': `${p.hero.w} / ${p.hero.h}`}} data-hero-media={framedHero ? undefined : true}><Picture name={p.hero.name} alt={`${t.kinds[p.hero.kind]} — ${p.name[lang]}`} sizes={framedHero ? '(min-width: 900px) 45vw, 100vw' : '100vw'} fit={framedHero ? 'contain' : 'cover'} eager/></div>}
      <div className="project-hero-copy wrap">
        <nav className="crumbs reveal-up" aria-label={lang === 'he' ? 'פירורי לחם' : 'Breadcrumb'}>
          <Link to={href(lang)}>{t.home}</Link><span aria-hidden="true">/</span><Link to={href(lang, 'projects')}>{t.pages.projects}</Link><span aria-hidden="true">/</span><span aria-current="page">{p.name[lang]}</span>
        </nav>
        <div className="project-status reveal-up"><Status p={p} lang={lang}/></div>
        <h1 className="display-1"><Lines lines={[p.name[lang]]}/></h1>
        <p className="project-address reveal-up"><Pin size={18}/>{p.address[lang]}</p>
        {!p.hero && <p className="project-image-status">{t.noImages}</p>}
      </div>
    </section>

    <section className="project-intro wrap">
      <div className="project-story">
        {p.tagline && <p className="project-tagline rv">{p.tagline[lang]}</p>}
        {(p.story[lang].length ? p.story[lang] : [t.noStory]).map((para, i) => <p key={i} className="rv">{para}</p>)}
        {p.highlights && <div className="highlights"><h2 className="h-small">{t.highlights}</h2><ul role="list">{p.highlights[lang].map(h => <li key={h} className="rv">{h}</li>)}</ul></div>}
        <Link to={`${href(lang, 'contact')}?project=${p.slug}`} className="btn btn-solid rv">{t.inquire}<Arrow size={20}/></Link>
      </div>
      <aside className="project-facts" aria-label={lang === 'he' ? 'פרטי הפרויקט' : 'Project details'}>
        {p.emblem && <Emblem name={p.emblem} alt={lang === 'he' ? `סמל הפרויקט ${p.name.he}` : `${p.name.en} project emblem`}/>}
        <dl>{facts.map(([k, val]) => <div key={k} className="rv"><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
      </aside>
    </section>

    {p.gallery.length > 1 && <section className="project-gallery wrap" aria-labelledby="gallery-title">
      <div className="section-head"><Label>{t.gallery}</Label><h2 id="gallery-title" className="display-3">{p.name[lang]} <span className="muted" dir="ltr">— {String(p.gallery.length).padStart(2, '0')}</span></h2></div>
      <Gallery p={p}/>
    </section>}

    <section className="project-location wrap" aria-labelledby="location-title">
      <div className="location-copy">
        <Label>{t.location}</Label>
        <h2 id="location-title" className="display-3">{p.address[lang]}</h2>
        {p.location[lang] && <p className="rv">{p.location[lang]}</p>}
        <div className="location-links">
          <a className="link-arrow" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer">{t.openMaps}<ArrowDiag size={16}/></a>
          <a className="link-arrow" href={`https://waze.com/ul?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">{t.openWaze}<ArrowDiag size={16}/></a>
        </div>
      </div>
      {p.clip && <div className="location-clip rv">
        <LazyVideo className="clip-video" loop={false} poster={v(`location-${p.clip}-poster.webp`)}
          sources={[{src: v(`location-${p.clip}.webm`), type: 'video/webm'}, {src: v(`location-${p.clip}.mp4`), type: 'video/mp4'}]}
          label={lang === 'he' ? `אנימציית מיקום מקורית: ${p.address.he}` : `Original location animation: ${p.address.en}`}/>
      </div>}
    </section>

    {(p.specifications[lang].length > 0 || p.apartments[lang].length > 0) && <section className="project-specs wrap" aria-labelledby="specs-title">
      <div className="section-head"><Label>{t.specs}</Label><h2 id="specs-title" className="display-3">{lang === 'he' ? 'מפרט ודירות' : 'Specification & homes'}</h2></div>
      <div className="specs-grid">
        {p.apartments[lang].length > 0 && <div className="apartments"><h3 className="h-small">{t.apartments}</h3>
          <ul role="list">{p.apartments[lang].map(a => <li key={a.title} className="rv"><span>{a.title}</span><small>{a.detail}</small></li>)}</ul>
          <p className="muted small">{lang === 'he' ? 'תוכניות הדירות נשלחות לפי בקשה.' : 'Floor plans are available on request. Israeli room counts include the living room.'}</p></div>}
        {p.specifications[lang].length > 0 && <div className="accordion">{p.specifications[lang].map((s, i) => <details key={s.title} open={i === 0}>
          <summary><span>{s.title}</span><i aria-hidden="true"/></summary><ul role="list">{s.items.map(item => <li key={item}>{item}</li>)}</ul></details>)}</div>}
      </div>
    </section>}

    {next && next !== p && <Link to={href(lang, 'project', next.slug)} className="next-project" data-cursor={t.next}>
      <Picture name={next.hero.name} alt="" sizes="100vw" fit={framedNext ? 'contain' : 'cover'} className={framedNext ? '' : 'parallax-inner'}/>
      <span className="next-copy wrap"><span className="label label-light"><span className="label-rule"/>{t.next}</span><span className="display-1">{next.name[lang]}</span><span>{next.address[lang]}</span></span>
    </Link>}
  </>;
}
