// Lightweight reveal layer (no animation library). Scroll-linked scenes are loaded
// separately, after first paint, and never for visitors who prefer reduced motion.
const REVEAL = '.rv:not(.is-in), .lines:not(.is-in), .reveal-up:not(.is-in), .clip-reveal:not(.is-in)';

export function startMotion(root, route) {
  if (!root) return () => {};
  const html = document.documentElement;
  const isReduced = () => html.classList.contains('reduce-motion');
  // Clipped elements never intersect (clip-path counts), so masks are observed via their parent.
  const owners = new Map();
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) {
      (owners.get(e.target) || [e.target]).forEach(el => el.classList.add('is-in'));
      owners.delete(e.target); io.unobserve(e.target);
    }
  }, {rootMargin: '0px 0px -6% 0px', threshold: 0.08});
  const scan = () => root.querySelectorAll(REVEAL).forEach(el => {
    if (isReduced()) return el.classList.add('is-in');
    const target = el.classList.contains('clip-reveal') ? el.parentElement : el;
    if (target !== el) owners.set(target, [...(owners.get(target) || []), el]);
    io.observe(target);
  });
  scan();

  let dead = false, killScenes = null, idle;
  const load = () => {
    if (dead || isReduced()) return;
    import('./scenes.js').then(m => { if (!dead && !isReduced()) killScenes = m.default(root, route); });
  };
  // Scenes are scroll-linked, so the library loads on the first interaction (or when idle
  // after 3.5 s), keeping it out of the initial load and hydration work.
  const triggers = ['scroll', 'pointermove', 'touchstart', 'keydown', 'wheel'];
  const kick = () => { triggers.forEach(t => window.removeEventListener(t, kick)); clearTimeout(idle); load(); };
  triggers.forEach(t => window.addEventListener(t, kick, {passive: true, once: true}));
  idle = setTimeout(() => 'requestIdleCallback' in window ? requestIdleCallback(kick, {timeout: 1000}) : kick(), 3500);

  const onContent = () => { scan(); killScenes?.refresh?.(); };
  const onA11y = () => {
    if (isReduced()) { killScenes?.(); killScenes = null; scan(); }
    else if (!killScenes) load();
  };
  window.addEventListener('content-change', onContent);
  window.addEventListener('a11ychange', onA11y);
  return () => {
    dead = true;
    io.disconnect();
    clearTimeout(idle);
    triggers.forEach(t => window.removeEventListener(t, kick));
    killScenes?.();
    window.removeEventListener('content-change', onContent);
    window.removeEventListener('a11ychange', onA11y);
  };
}
