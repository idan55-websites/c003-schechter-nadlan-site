// Scroll-linked scenes. Only transforms/opacity/clip-path are animated; every scene
// is scrubbed by native scroll (no wheel interception) and fully reverts on cleanup.
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize: true});

let cursor;

export default function scenes(root, route) {
  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add({desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', fine: '(hover: hover) and (pointer: fine)'}, ({conditions: {desktop, fine}}) => {
      // Home: the cinemascope film band opens to full width as the hero scrolls away.
      const film = root.querySelector('[data-film] .film-frame');
      if (film) {
        const hero = root.querySelector('[data-hero]');
        gsap.timeline({scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6}})
          .fromTo(film, {clipPath: desktop ? 'inset(0% 7% 0% 7% round 14px)' : 'inset(0% 4% 0% 4% round 10px)'}, {clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none'}, 0)
          .to(hero.querySelector('.hero-copy'), {yPercent: -18, opacity: 0.15, ease: 'none'}, 0)
          .to(film.querySelector('.film-video, .film-poster img'), {scale: 1.06, ease: 'none'}, 0);
      }
      // Project pages: the cover image settles as you scroll.
      const cover = root.querySelector('[data-hero-media]');
      if (cover) {
        gsap.timeline({scrollTrigger: {trigger: cover.parentElement, start: 'top top', end: 'bottom top', scrub: 0.5}})
          .fromTo(cover.querySelector('img'), {scale: 1.12, yPercent: 0}, {scale: 1, yPercent: 10, ease: 'none'}, 0)
          .to(cover.parentElement.querySelector('.project-hero-copy'), {yPercent: -25, opacity: 0, ease: 'none'}, 0);
      }
      // Image parallax inside masked frames.
      root.querySelectorAll('.parallax-inner img').forEach(img => {
        const frame = img.closest('.clip-reveal, .gallery-button, .next-project, .plate-media') || img.parentElement;
        gsap.fromTo(img, {yPercent: -6}, {yPercent: 6, ease: 'none', scrollTrigger: {trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true}});
      });
      // Layered depth: elements drift at different speeds.
      root.querySelectorAll('[data-speed]').forEach(el => {
        const speed = parseFloat(el.dataset.speed) * (desktop ? 1 : 0.5);
        gsap.fromTo(el, {y: () => -speed * window.innerHeight * 0.5}, {y: () => speed * window.innerHeight * 0.5, ease: 'none',
          scrollTrigger: {trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true}});
      });
      // Statement: words come into full light as they are read.
      root.querySelectorAll('[data-words]').forEach(p => {
        gsap.fromTo(p.querySelectorAll('.word'), {opacity: 0.5}, {opacity: 1, stagger: 0.08, ease: 'none',
          scrollTrigger: {trigger: p, start: 'top 82%', end: 'bottom 45%', scrub: 0.4}});
      });
      // Counters.
      root.querySelectorAll('[data-count]').forEach(el => {
        const n = +el.dataset.count, from = n > 1000 ? n - 40 : 0, obj = {v: from};
        el.textContent = from;
        gsap.to(obj, {v: n, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(obj.v); },
          scrollTrigger: {trigger: el, start: 'top 88%', once: true}});
      });
      // Portfolio index: a floating preview follows the pointer on desktop.
      const index = root.querySelector('[data-index]');
      const preview = index?.querySelector('.index-preview');
      if (preview && fine && desktop) {
        const x = gsap.quickTo(preview, 'x', {duration: 0.55, ease: 'power3'}), y = gsap.quickTo(preview, 'y', {duration: 0.55, ease: 'power3'});
        const rows = index.querySelectorAll('[data-preview]');
        const move = e => { const r = index.getBoundingClientRect(); x(e.clientX - r.left); y(e.clientY - r.top); };
        const enter = e => {
          const name = e.currentTarget.dataset.preview;
          preview.querySelectorAll('.index-preview-img').forEach(img => img.classList.toggle('is-on', img.dataset.name === name));
          preview.classList.add('is-on');
        };
        const leave = () => preview.classList.remove('is-on');
        index.addEventListener('pointermove', move);
        rows.forEach(r => { r.addEventListener('pointerenter', enter); r.addEventListener('focus', enter); });
        index.querySelector('.index-list').addEventListener('pointerleave', leave);
        return () => { index.removeEventListener('pointermove', move); rows.forEach(r => { r.removeEventListener('pointerenter', enter); r.removeEventListener('focus', enter); }); };
      }
    });
    mm.add('(hover: hover) and (pointer: fine)', () => startCursor(root));
  }, root);

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  const kill = () => { mm.revert(); ctx.revert(); };
  kill.refresh = refresh;
  return kill;
}

// A soft follower ring that grows with a label over [data-cursor] targets.
function startCursor(root) {
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor-label"></span>';
    document.body.append(cursor);
  }
  const label = cursor.firstChild;
  const x = gsap.quickTo(cursor, 'x', {duration: 0.35, ease: 'power3'}), y = gsap.quickTo(cursor, 'y', {duration: 0.35, ease: 'power3'});
  const move = e => { x(e.clientX); y(e.clientY); cursor.classList.add('is-visible'); };
  const over = e => {
    const target = e.target.closest?.('[data-cursor], a, button');
    const text = target?.closest('[data-cursor]')?.dataset.cursor;
    cursor.classList.toggle('is-label', !!text);
    cursor.classList.toggle('is-link', !!target && !text);
    if (text) label.textContent = text;
  };
  const out = () => cursor.classList.remove('is-visible');
  window.addEventListener('pointermove', move, {passive: true});
  document.addEventListener('pointerover', over);
  document.documentElement.addEventListener('pointerleave', out);
  return () => {
    window.removeEventListener('pointermove', move);
    document.removeEventListener('pointerover', over);
    document.documentElement.removeEventListener('pointerleave', out);
    cursor.classList.remove('is-visible', 'is-label', 'is-link');
  };
}
