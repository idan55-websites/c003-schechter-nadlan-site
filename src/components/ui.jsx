import React, {useEffect, useRef, useState} from 'react';
import media from '../data/media.json';
import {BASE, useRouter} from '../lib/router.jsx';

// Keeps Tab inside a dialog. Cycles explicitly, because Safari skips buttons by default.
export function trapTab(e, container) {
  const items = [...container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea')].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) return;
  e.preventDefault();
  const i = items.indexOf(document.activeElement);
  items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
}

export const asset = path => BASE + path.replace(/^\//, '');

// Internal link: client-side navigation with the page transition; normal link otherwise.
export function Link({to, children, onClick, ...rest}) {
  const {navigate} = useRouter();
  return <a href={to} {...rest} onClick={e => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return;
    e.preventDefault();
    navigate(to);
  }}>{children}</a>;
}

// Responsive AVIF/WebP picture from the generated manifest. Reserves its aspect ratio.
export function Picture({name, alt = '', sizes = '100vw', eager = false, fit = 'cover', className = '', imgClassName = '', style}) {
  const m = media[name];
  const ref = useRef(null), frame = useRef(null);
  const [measuredSizes, setMeasuredSizes] = useState(null);
  const [loaded, setLoaded] = useState(eager); // eager (above-the-fold) images never fade in
  useEffect(() => {
    setLoaded(eager || !!ref.current?.naturalWidth);
    setMeasuredSizes(null);
    if (!m || !frame.current) return;
    // object-fit: cover can need a much wider source than the visible frame,
    // especially a landscape photograph cropped into a portrait project card.
    const measure = () => {
      const {width, height} = frame.current.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = m.w / m.h;
      const required = fit === 'contain' ? Math.min(width, height * ratio, m.w) : Math.max(width, height * ratio);
      setMeasuredSizes(`${Math.ceil(required)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, [name, eager, fit, m?.w, m?.h]);
  if (!m) return null;
  const version = m.sourceHash ? `?v=${m.sourceHash.slice(0, 12)}` : '';
  const url = (w, ext) => asset(`media/img/${name}-${w}.${ext}`) + version;
  const set = ext => m.widths.map(w => `${url(w, ext)} ${w}w`).join(', ');
  const fallback = m.widths.find(w => w >= 1200) || m.widths.at(-1);
  return <picture ref={frame} className={`pic ${loaded ? 'is-loaded' : ''} ${fit === 'contain' ? 'is-contained' : ''} ${className}`} style={{'--ph': m.color, '--native-width': `${m.w}px`, '--native-height': `${m.h}px`, ...style}}>
    <source type="image/avif" srcSet={set('avif')} sizes={measuredSizes || sizes}/>
    <source type="image/webp" srcSet={set('webp')} sizes={measuredSizes || sizes}/>
    <img ref={ref} className={imgClassName} src={url(fallback, 'webp')} srcSet={set('webp')} sizes={measuredSizes || sizes} alt={alt} width={m.w} height={m.h}
      loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} fetchPriority={eager ? 'high' : undefined} onLoad={() => setLoaded(true)}/>
  </picture>;
}
export const ratio = name => media[name] ? media[name].w / media[name].h : 1.5;

// Visitors who asked to save data (or are on 2G) keep the poster only.
const constrained = () => { const c = navigator.connection; return !!c && (c.saveData || /2g/.test(c.effectiveType || '')); };

// Muted inline video that only downloads and plays while visible.
export function LazyVideo({sources, poster, className = '', label, loop = true, playing = true, onEnded}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !constrained()) setActive(true);
      if (!entry.isIntersecting) el.pause();
      else if (playing && !document.documentElement.classList.contains('reduce-motion')) el.play().catch(() => {});
    }, {rootMargin: '200px 0px', threshold: 0.15});
    io.observe(el);
    return () => io.disconnect();
  }, [playing, active]);
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    if (playing && !document.documentElement.classList.contains('reduce-motion')) el.play().catch(() => {}); else el.pause();
  }, [playing, active]);
  return <video ref={ref} className={className} muted playsInline loop={loop} preload="none" poster={poster} aria-label={label} onEnded={onEnded}
    disablePictureInPicture>
    {active && sources.filter(s => !s.media || matchMedia(s.media).matches).map(s => <source key={s.src} src={s.src} type={s.type}/>)}
  </video>;
}

const I = ({children, size = 20, stroke = 1.25, className = ''}) =>
  <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>;
// Arrow points in the reading direction; CSS mirrors it for RTL.
export const Arrow = p => <I {...p} className={`icon-forward ${p.className || ''}`}><path d="M2 12h19M15 6l6 6-6 6"/></I>;
export const ArrowDiag = p => <I {...p} className={`icon-forward ${p.className || ''}`}><path d="M6 18 18 6M8 6h10v10"/></I>;
export const Plus = p => <I {...p}><path d="M12 4v16M4 12h16"/></I>;
export const Close = p => <I {...p}><path d="M5 5l14 14M19 5 5 19"/></I>;
export const Phone = p => <I {...p}><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></I>;
export const Mail = p => <I {...p}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></I>;
export const Pin = p => <I {...p}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></I>;
export const Search = p => <I {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></I>;
export const Play = p => <I {...p}><path d="M8 5v14l11-7z"/></I>;
export const Pause = p => <I {...p}><path d="M8 5v14M16 5v14"/></I>;
export const Chat = p => <I {...p}><path d="M4 20l1.4-4.2A8 8 0 1 1 8.6 19z"/></I>;
export const Access = p => <I {...p}><circle cx="12" cy="4.5" r="1.5"/><path d="M5 8.5 12 10l7-1.5M12 10v4.5M12 14.5 9 21M12 14.5l3 6.5"/></I>;

// Splits a heading into masked lines for the reveal animation; text stays one accessible string.
export function Lines({as: Tag = 'span', lines, className = ''}) {
  // The space between lines sits outside the masked boxes so inline lines keep their word gap.
  return <Tag className={`lines ${className}`}>{lines.map((l, i) => <React.Fragment key={i}><span className="line"><span className="line-inner" style={{'--i': i}}>{l}</span></span>{i < lines.length - 1 ? ' ' : ''}</React.Fragment>)}</Tag>;
}

export function Label({children, n, light}) {
  return <p className={`label ${light ? 'label-light' : ''}`}>{n && <span className="label-n" dir="ltr">{n}</span>}<span className="label-rule" aria-hidden="true"/>{children}</p>;
}
