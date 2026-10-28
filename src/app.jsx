import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {parse, RouterProvider} from './lib/router.jsx';
import {getMeta, applyMeta} from './lib/meta.js';
import {strings} from './data/site.js';
import {bySlug} from './data/projects.js';
import {Header, Menu, Footer, AccessibilityTools} from './components/layout.jsx';
import Home from './pages/home.jsx';
import {Projects, Project} from './pages/projects.jsx';
import {About, Urban, Media, Residents, Contact, Accessibility, Privacy, SiteMap, NotFound} from './pages/content.jsx';
import {startMotion} from './motion/core.js';

const views = {home: Home, projects: Projects, project: Project, about: About, 'urban-renewal': Urban, press: Media, residents: Residents,
  contact: Contact, accessibility: Accessibility, privacy: Privacy, sitemap: SiteMap, 'not-found': NotFound};
const useIsoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const reduced = () => document.documentElement.classList.contains('reduce-motion');
const wait = ms => new Promise(r => setTimeout(r, ms));

export function App({url}) {
  const [loc, setLoc] = useState({path: url.pathname, search: url.search});
  const [menu, setMenu] = useState(false);
  const [announce, setAnnounce] = useState('');
  const route = useMemo(() => parse(loc.path), [loc.path]);
  const first = useRef(true), curtain = useRef(null), main = useRef(null), busy = useRef(false);

  const navigate = useCallback(async to => {
    const u = new URL(to, location.href);
    if (u.origin !== location.origin) { location.href = to; return; }
    setMenu(false);
    if (u.pathname === location.pathname && u.search === location.search) { window.scrollTo({top: 0, behavior: reduced() ? 'auto' : 'smooth'}); return; }
    if (busy.current) return;
    busy.current = true;
    if (!reduced()) { curtain.current.classList.add('is-covering'); await wait(560); }
    history.pushState(null, '', u.pathname + u.search + u.hash);
    setLoc({path: u.pathname, search: u.search});
  }, []);

  useEffect(() => {
    const pop = () => setLoc({path: location.pathname, search: location.search});
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);

  // After every route render: metadata, scroll, focus, curtain reveal and motion.
  useIsoLayout(() => {
    if (first.current) return;
    const meta = getMeta(route);
    applyMeta(meta);
    window.scrollTo(0, 0);
    main.current?.focus({preventScroll: true});
    setAnnounce(meta.title);
    const c = curtain.current;
    if (c.classList.contains('is-covering')) {
      c.classList.add('is-revealing');
      setTimeout(() => { c.classList.remove('is-covering', 'is-revealing'); busy.current = false; }, 700);
    } else busy.current = false;
  }, [route.page, route.slug, route.lang]);

  useEffect(() => {
    first.current = false;
    return startMotion(main.current, route);
  }, [route.page, route.slug, route.lang, loc.search]);

  const View = views[route.page];
  const t = strings[route.lang];
  const dark = route.page === 'home' || route.page === 'urban-renewal' || (route.page === 'project' && bySlug[route.slug]?.cover);
  return <RouterProvider value={{route, navigate, search: loc.search}}>
    <a className="skip" href="#main" inert={menu || undefined}>{t.skip}</a>
    <Header onMenu={() => setMenu(true)} menuOpen={menu} dark={dark}/>
    <Menu open={menu} onClose={() => setMenu(false)}/>
    <main id="main" ref={main} tabIndex={-1} inert={menu || undefined} className={`page page-${route.page}`}><View key={route.page + route.slug}/></main>
    <div inert={menu || undefined}><Footer/></div>
    <AccessibilityTools inert={menu}/>
    <div className="curtain" ref={curtain} aria-hidden="true"><span className="curtain-mark"/></div>
    <p className="sr-only" aria-live="polite">{announce}</p>
  </RouterProvider>;
}
