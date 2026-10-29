import React, {useEffect, useRef, useState} from 'react';
import {href, useRouter} from '../lib/router.jsx';
import {strings, contact} from '../data/site.js';
import {featured} from '../data/projects.js';
import {Link, asset, trapTab, Phone, Mail, Close, Access, ArrowDiag, Picture} from './ui.jsx';

const navPages = [['projects', 'projects'], ['about', 'about'], ['urban-renewal', 'urban'], ['press', 'media'], ['contact', 'contact']];

export function Logo({light, lang}) {
  const t = strings[lang];
  return <span className="logo">
    <img className="logo-dark" src={asset('media/brand/logo-dark.png')} alt={`${t.brand} — ${strings.he.tagline}`} width="720" height="194"/>
    <img className="logo-light" src={asset('media/brand/logo-light.png')} alt="" aria-hidden="true" width="489" height="135"/>
  </span>;
}

export function Header({onMenu, menuOpen, dark}) {
  const {route} = useRouter();
  const {lang} = route;
  const t = strings[lang];
  const [state, setState] = useState({solid: false, hidden: false});
  useEffect(() => {
    let last = window.scrollY, ticking = false;
    const update = () => {
      const y = window.scrollY;
      setState(s => {
        const next = {solid: y > 40, hidden: y > 480 && y > last + 2 ? true : y < last - 2 ? false : s.hidden};
        return next.solid === s.solid && next.hidden === s.hidden ? s : next;
      });
      last = y; ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [route.page, route.slug]);
  const other = lang === 'he' ? 'en' : 'he';
  const current = p => route.page === p || (p === 'projects' && route.page === 'project');
  return <header className={`site-header ${dark && !state.solid ? 'on-dark' : ''} ${state.solid ? 'is-solid' : ''} ${state.hidden && !menuOpen ? 'is-hidden' : ''}`} inert={menuOpen || undefined}>
    <div className="header-inner">
      <Link to={href(lang)} className="header-logo" aria-label={t.homeLabel}><Logo lang={lang}/></Link>
      <nav className="header-nav" aria-label={lang === 'he' ? 'ניווט ראשי' : 'Main navigation'}>
        {navPages.map(([page, key]) => <Link key={page} to={href(lang, page)} aria-current={current(page) ? 'page' : undefined}><span data-text={t.nav[key]}>{t.nav[key]}</span></Link>)}
      </nav>
      <div className="header-tools">
        <a className="header-lang" href={href(other, route.page, route.slug)} hrefLang={other} lang={other} aria-label={`${lang === 'he' ? 'EN' : 'עב'} — ${t.switchLangLabel}`}>{lang === 'he' ? 'EN' : 'עב'}</a>
        <a className="header-phone" href={contact.phoneHref}><Phone size={16}/><span dir="ltr">{contact.phone}</span></a>
        <Link className="btn btn-small header-cta" to={href(lang, 'contact')}>{t.cta}</Link>
        <button className="menu-button" type="button" onClick={onMenu} aria-label={t.menu} aria-expanded={menuOpen} aria-controls="site-menu" aria-haspopup="dialog">
          <span className="menu-lines" aria-hidden="true"><i/><i/></span><span className="menu-text">{t.menu}</span>
        </button>
      </div>
    </div>
  </header>;
}

export function Menu({open, onClose}) {
  const {route} = useRouter();
  const {lang} = route;
  const t = strings[lang];
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    document.documentElement.classList.add('menu-open');
    const focusTimer = setTimeout(() => panel.current?.querySelector('.menu-close')?.focus(), 60);
    const key = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') trapTab(e, panel.current);
    };
    const resize = () => { if (getComputedStyle(document.querySelector('.menu-button')).display === 'none') onClose(); };
    document.addEventListener('keydown', key);
    window.addEventListener('resize', resize);
    return () => {
      clearTimeout(focusTimer);
      document.documentElement.classList.remove('menu-open');
      document.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      // Safari does not focus buttons on click; fall back to the menu button.
      (prev && prev !== document.body ? prev : document.querySelector('.menu-button'))?.focus?.({preventScroll: true});
    };
  }, [open]);
  const other = lang === 'he' ? 'en' : 'he';
  return <div id="site-menu" className={`menu ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label={t.menu} ref={panel} inert={!open || undefined} aria-hidden={!open || undefined}>
    <div className="menu-backdrop" aria-hidden="true"/>
    <div className="menu-inner">
      <div className="menu-top">
        <Link to={href(lang)} className="header-logo" aria-label={t.homeLabel} onClick={onClose}><Logo lang={lang} light/></Link>
        <button type="button" className="menu-close" onClick={onClose}><span>{t.close}</span><Close size={22}/></button>
      </div>
      <nav className="menu-nav" aria-label={t.menu}>
        <ol>{[['home', t.home], ...navPages.map(([p, k]) => [p, t.nav[k]]), ['residents', t.footer.residents]].map(([page, label], i) =>
          <li key={page} style={{'--i': i}}><Link to={href(lang, page)} onClick={onClose} aria-current={route.page === page ? 'page' : undefined}><span className="menu-n" dir="ltr">{String(i + 1).padStart(2, '0')}</span><span className="menu-word">{label}</span></Link></li>)}</ol>
      </nav>
      <div className="menu-aside">
        <div className="menu-projects">{featured.slice(0, 3).map(p => <Link key={p.id} to={href(lang, 'project', p.slug)} onClick={onClose} className="menu-project">
          <Picture name={p.cover.name} sizes="160px" alt=""/><span>{p.name[lang]}<small>{p.city[lang]}</small></span></Link>)}</div>
        <div className="menu-contact">
          <a href={contact.phoneHref}><Phone size={18}/><span dir="ltr">{contact.phone}</span></a>
          <a href={`mailto:${contact.email}`}><Mail size={18}/>{contact.email}</a>
          <a className="menu-lang" href={href(other, route.page, route.slug)} lang={other} hrefLang={other}>{t.switchLang}</a>
        </div>
      </div>
    </div>
  </div>;
}

export function Footer() {
  const {route: {lang}} = useRouter();
  const t = strings[lang];
  return <footer className="site-footer">
    <div className="footer-cta wrap">
      <p className="footer-lead">{t.footer.lead}</p>
      <Link to={href(lang, 'contact')} className="footer-big" data-cursor={lang === 'he' ? 'דברו איתנו' : 'Talk to us'}>
        <span>{lang === 'he' ? 'בואו נדבר' : 'Let’s talk'}</span><ArrowDiag size={56} stroke={0.9}/>
      </Link>
    </div>
    <div className="footer-grid wrap">
      <div className="footer-brand"><Logo lang={lang} light/><p>{t.tagline}.<br/>{lang === 'he' ? 'יזמות, בנייה והתחדשות עירונית מאז 2006.' : 'Development, construction and urban renewal since 2006.'}</p></div>
      <nav className="footer-col" aria-label={t.footer.explore}><h2>{t.footer.explore}</h2>
        {navPages.map(([page, key]) => <Link key={page} to={href(lang, page)}>{t.nav[key]}</Link>)}
        <Link to={href(lang, 'residents')}>{t.footer.residents}</Link>
      </nav>
      <div className="footer-col"><h2>{t.footer.contactTitle}</h2>
        <Link to={href(lang, 'alex-shechter')}>{t.pages.alex}</Link>
        <a href={contact.phoneHref} dir="ltr">{contact.phone}</a>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <address>{contact.address[lang]}<br/>{contact.hours[lang]}</address>
      </div>
      <nav className="footer-col" aria-label={t.footer.legal}><h2>{t.footer.legal}</h2>
        <Link to={href(lang, 'accessibility')}>{t.footer.accessibility}</Link>
        <Link to={href(lang, 'privacy')}>{t.footer.privacy}</Link>
        <Link to={href(lang, 'sitemap')}>{t.footer.sitemap}</Link>
      </nav>
    </div>
    <div className="footer-bottom wrap">
      <span>© {new Date().getFullYear()} {t.brand}. {t.footer.rights}</span>
      <span className="footer-mark" aria-hidden="true">European heritage · Israeli vision</span>
    </div>
  </footer>;
}

const defaults = {motion: false, contrast: false, links: false, text: false};
export function AccessibilityTools({inert}) {
  const {route: {lang}} = useRouter();
  const t = strings[lang].a11y;
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const trigger = useRef(null), panel = useRef(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('a11y') || '{}');
      setSettings(Object.fromEntries(Object.keys(defaults).map(key => [key, saved?.[key] === true])));
    } catch { setSettings(defaults); }
  }, []);
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      root.classList.toggle('reduce-motion', settings.motion || media.matches);
      root.classList.toggle('high-contrast', settings.contrast);
      root.classList.toggle('underline-links', settings.links);
      root.classList.toggle('large-text', settings.text);
      window.dispatchEvent(new CustomEvent('a11ychange'));
    };
    apply();
    try { localStorage.setItem('a11y', JSON.stringify(settings)); } catch {}
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [settings]);
  useEffect(() => { if (open) panel.current?.querySelector('button')?.focus(); }, [open]);
  const toggle = k => setSettings(s => ({...(s || defaults), [k]: !s?.[k]}));
  return <aside className="a11y" aria-label={t.title} inert={inert || undefined} onKeyDown={e => { if (e.key === 'Escape' && open) { setOpen(false); trigger.current.focus(); } }}
    onBlur={e => { if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} type="button" className="a11y-trigger" aria-expanded={open} aria-controls="a11y-panel" onClick={() => setOpen(!open)}><Access size={22}/><span className="sr-only">{t.open}</span></button>
    {open && <div id="a11y-panel" className="a11y-panel" ref={panel} role="group" aria-label={t.title}>
      <p className="a11y-title">{t.title}</p>
      {['motion', 'contrast', 'links', 'text'].map(k => <button key={k} type="button" role="switch" aria-checked={!!settings?.[k]} onClick={() => toggle(k)}><span>{t[k]}</span><i aria-hidden="true"/></button>)}
      <button type="button" className="a11y-reset" onClick={() => setSettings(defaults)}>{t.reset}</button>
      <Link to={href(lang, 'accessibility')} onClick={() => setOpen(false)}>{t.statement}</Link>
    </div>}
  </aside>;
}
