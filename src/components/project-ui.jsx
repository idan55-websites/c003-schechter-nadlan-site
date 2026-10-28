import React, {useEffect, useRef, useState} from 'react';
import {href, useRouter} from '../lib/router.jsx';
import {strings} from '../data/site.js';
import {futureProjects} from '../data/projects.js';
import {Link, Picture, Arrow, ArrowDiag, Close, asset, trapTab} from './ui.jsx';

export function Status({p, lang}) {
  const t = strings[lang];
  if (p.stage) return <span className="chip">{t.stage[p.stage]}</span>;
  return <>
    <span className="chip">{t.categories[p.category]}</span>
    {p.soldOut && <span className="chip chip-quiet">{t.soldOut}</span>}
  </>;
}

export function ProjectCard({p, sizes = '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw', index}) {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  return <article className="card rv">
    <Link to={href(lang, 'project', p.slug)} className="card-link" data-cursor={t.discover}>
      <div className={`card-media ${p.cover ? '' : 'card-media-empty'}`}>
        {p.cover ? <Picture name={p.cover.name} alt={`${t.kinds[p.cover.kind]} — ${p.name[lang]}`} sizes={sizes} fit={p.cover.w < 600 ? 'contain' : 'cover'}/> :
          <div className="card-placeholder"><span className="s-mark" aria-hidden="true"/><span className="card-placeholder-address"><span aria-hidden="true">{p.address[lang]}</span><small>{lang === 'he' ? 'תמונות הפרויקט יפורסמו בהמשך' : 'Project images coming soon'}</small></span></div>}
        <span className="card-status"><Status p={p} lang={lang}/></span>
      </div>
      <div className="card-body">
        {index != null && <span className="card-index" dir="ltr">{String(index + 1).padStart(2, '0')}</span>}
        <h3 className="card-title">{p.name[lang]}</h3>
        <p className="card-address">{p.address[lang]}</p>
        <span className="card-go" aria-hidden="true"><ArrowDiag size={22}/></span>
      </div>
    </Link>
  </article>;
}

export function FutureProjects() {
  const {route: {lang}, search} = useRouter();
  const [open, setOpen] = useState(false);
  // Keep the first render identical to the static HTML, including on query links.
  useEffect(() => { setOpen(new URLSearchParams(search).get('stage') === 'future'); }, [search]);
  useEffect(() => { window.dispatchEvent(new CustomEvent('content-change')); }, [open]);
  return <details className="future-projects" open={open} onToggle={e => setOpen(e.currentTarget.open)}>
    <summary><h2 className="h-small">{strings[lang].categoriesLong.future}</h2><i aria-hidden="true"/></summary>
    <ul role="list">{futureProjects.map(p => <li key={p.id}>
      <Link to={href(lang, 'project', p.slug)}><span>{p.name[lang]}</span><small>{p.city[lang]}</small><ArrowDiag size={18}/></Link>
    </li>)}</ul>
  </details>;
}

// Editorial gallery: a lead image, then a rhythmic grid. Opens a lightbox.
export function Gallery({p}) {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  const [open, setOpen] = useState(-1);
  const opener = useRef(null); // Safari does not focus buttons on click, so remember the opener
  // Lead with the first landscape image; the (often portrait) cover already fills the hero.
  const lead = p.gallery.findIndex(g => g.w >= 1400 && g.w > g.h * 1.2);
  const items = lead < 0 ? p.gallery : [p.gallery[lead], ...p.gallery.filter((_, i) => i !== lead)];
  return <>
    <ul className="gallery" role="list">
      {items.map((item, i) => {
        const tall = item.h > item.w * 1.05;
        const isLead = i === 0 && lead >= 0;
        return <li key={item.name} className={`gallery-item rv ${isLead ? 'is-lead' : tall ? 'is-tall' : 'is-wide'} ${item.w < 1000 ? 'is-compact' : ''}`}>
          <button type="button" className="gallery-button" onClick={e => { opener.current = e.currentTarget; setOpen(i); }} data-cursor={t.viewGallery}
            aria-label={`${t.viewGallery}: ${t.kinds[item.kind]} ${i + 1} ${t.of} ${items.length}`}>
            <Picture name={item.name} alt="" sizes={isLead ? '100vw' : '(min-width: 900px) 50vw, 100vw'} fit="contain"/>
            <span className="gallery-kind">{t.kinds[item.kind]}</span>
          </button>
        </li>;
      })}
    </ul>
    {open > -1 && <Lightbox p={{...p, gallery: items}} index={open} returnTo={opener} onClose={() => setOpen(-1)}/>}
  </>;
}

function Lightbox({p, index, onClose, returnTo}) {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  const [i, setI] = useState(index);
  const ref = useRef(null), touch = useRef(null);
  const n = p.gallery.length;
  const go = d => setI(v => (v + d + n) % n);
  // In RTL, "next" sits on the left; arrow keys follow the visual direction.
  const forward = lang === 'he' ? 'ArrowLeft' : 'ArrowRight';
  useEffect(() => {
    const prev = returnTo?.current || document.activeElement;
    document.documentElement.classList.add('menu-open');
    ref.current.querySelector('.lb-close').focus();
    const key = e => {
      if (e.key === 'Escape') onClose();
      else if (e.key === forward) go(1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') go(-1);
      else if (e.key === 'Tab') trapTab(e, ref.current);
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.documentElement.classList.remove('menu-open'); prev?.focus?.(); };
  }, []);
  const item = p.gallery[i];
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${t.gallery} — ${p.name[lang]}`} ref={ref}
    onTouchStart={e => { touch.current = e.touches[0].clientX; }}
    onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go((dx < 0) === (lang !== 'he') ? 1 : -1); }}>
    <div className="lb-bar">
      <p className="lb-count" aria-live="polite"><span dir="ltr">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span> · {t.kinds[item.kind]}</p>
      <button type="button" className="lb-close" onClick={onClose}><span>{t.closeGallery}</span><Close size={22}/></button>
    </div>
    <figure className="lb-stage" key={item.name}>
      <Picture name={item.name} alt={`${t.kinds[item.kind]} — ${p.name[lang]}, ${t.image} ${i + 1} ${t.of} ${n}`} sizes="100vw" fit="contain" eager/>
    </figure>
    <div className="lb-nav">
      <button type="button" className="lb-prev" onClick={() => go(-1)} aria-label={t.prev}><Arrow size={28} className="flip"/></button>
      <div className="lb-thumbs" aria-hidden="true">{p.gallery.map((g, k) => <span key={g.name} className={k === i ? 'is-on' : ''}/>)}</div>
      <button type="button" className="lb-next" onClick={() => go(1)} aria-label={t.nextImg}><Arrow size={28}/></button>
    </div>
  </div>;
}

export function Emblem({name, alt}) {
  return <img className="emblem" src={asset(`media/brand/emblem-${name}.webp`)} alt={alt} loading="lazy" decoding="async" height="200"/>;
}
