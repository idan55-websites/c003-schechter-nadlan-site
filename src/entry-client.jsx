import React from 'react';
import {hydrateRoot, createRoot} from 'react-dom/client';
import {App} from './app.jsx';
import {fromLegacyHash} from './lib/router.jsx';
import './styles/index.css';

const legacy = fromLegacyHash(location.hash);
if (legacy) location.replace(legacy);
else {
  const root = document.getElementById('root');
  const html = document.documentElement;
  // Apply saved accessibility preferences before hydration to avoid a flash of motion.
  try {
    const a = JSON.parse(localStorage.getItem('a11y') || '{}');
    html.classList.toggle('reduce-motion', !!a.motion || matchMedia('(prefers-reduced-motion: reduce)').matches);
    html.classList.toggle('high-contrast', !!a.contrast);
    html.classList.toggle('underline-links', !!a.links);
    html.classList.toggle('large-text', !!a.text);
  } catch { html.classList.toggle('reduce-motion', matchMedia('(prefers-reduced-motion: reduce)').matches); }
  html.classList.add('js');
  const app = <App url={new URL(location.href)}/>;
  // Vite serves the <!--app--> placeholder in development. Only prerendered
  // elements count as server output; hydrating the comment forces a failed rebuild.
  if (root.childElementCount) hydrateRoot(root, app); else createRoot(root).render(app);
}
