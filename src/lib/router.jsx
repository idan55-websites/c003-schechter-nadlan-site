import React, {createContext, useContext} from 'react';
import {bySlug, byId} from '../data/projects.js';

export const BASE = import.meta.env.BASE_URL; // always ends with "/"
export const pages = ['projects', 'about', 'urban-renewal', 'press', 'residents', 'contact', 'accessibility', 'privacy', 'sitemap'];

// "/en/projects/schechter-family/" → {lang:'en', page:'project', slug:'schechter-family'}
export function parse(pathname) {
  let path = decodeURIComponent(pathname);
  if (path.startsWith(BASE)) path = path.slice(BASE.length);
  const parts = path.split('/').filter(Boolean);
  const lang = parts[0] === 'en' ? 'en' : 'he';
  if (lang === 'en') parts.shift();
  const [page = 'home', slug] = parts;
  if (page === 'home' && !parts.length) return {lang, page: 'home'};
  if (page === 'projects' && slug) return bySlug[slug] && parts.length === 2 ? {lang, page: 'project', slug} : {lang, page: 'not-found'};
  if (pages.includes(page) && parts.length === 1) return {lang, page};
  return {lang, page: 'not-found'};
}

export function href(lang, page = 'home', slug) {
  const prefix = BASE + (lang === 'en' ? 'en/' : '');
  if (page === 'home') return prefix;
  if (page === 'project') return `${prefix}projects/${slug}/`;
  return `${prefix}${page}/`;
}

// Links from the previous hash-routed preview (#/project/2, #/en/about) keep working.
export function fromLegacyHash(hash) {
  if (!hash.startsWith('#/')) return null;
  const parts = hash.slice(2).split('/').filter(Boolean);
  const lang = parts[0] === 'en' ? 'en' : 'he';
  if (lang === 'en') parts.shift();
  const [page = 'home', id] = parts;
  if (page === 'project' && byId[id]) return href(lang, 'project', byId[id].slug);
  if (page === 'contact' && byId[id]) return href(lang, 'contact') + '?project=' + byId[id].slug;
  const map = {urban: 'urban-renewal', media: 'press'};
  const target = map[page] || page;
  return target === 'home' || pages.includes(target) ? href(lang, target) : null;
}

const RouterContext = createContext({route: {lang: 'he', page: 'home'}, navigate: () => {}, search: ''});
export const RouterProvider = ({value, children}) => <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
export const useRouter = () => useContext(RouterContext);
