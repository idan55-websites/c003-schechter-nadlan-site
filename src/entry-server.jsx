import React from 'react';
import {renderToString} from 'react-dom/server';
import {App} from './app.jsx';
import {getMeta} from './lib/meta.js';
import {parse, href, pages} from './lib/router.jsx';
import {projects} from './data/projects.js';

export function render(path) {
  const url = new URL(path, 'https://localhost');
  return {html: renderToString(<App url={url}/>), meta: getMeta(parse(url.pathname))};
}

// Every prerendered route, in both languages.
export function routes() {
  const list = [];
  for (const lang of ['he', 'en']) {
    list.push(href(lang));
    for (const page of pages) list.push(href(lang, page));
    for (const p of projects) list.push(href(lang, 'project', p.slug));
  }
  return list;
}
export {projects, href};
