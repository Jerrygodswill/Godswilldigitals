const header = document.getElementById('site-header');
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');
const progress = document.getElementById('progress');

function setMenu(open) {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
}

toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Scroll reveal ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const groups = [
    '.hero > div:first-child > *', '#setup', '.about > div', '.block h1',
    '.chips li', '.cards article', '.subscribe > *', '.icons-wrapper a'
  ];

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      obs.unobserve(el);
      // remove the reveal classes afterwards so hover transitions work again
      el.addEventListener('transitionend', e => {
        if (e.propertyName !== 'opacity') return;
        el.classList.remove('reveal', 'in');
        el.style.removeProperty('--d');
      });
    });
  }, { threshold: 0.15 });

  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--d', Math.min(i * 0.08, 0.5) + 's');
      revealObserver.observe(el);
    });
  });
}

// ---------- Fade between pages ----------
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', e => {
    if (reduceMotion || e.metaKey || e.ctrlKey || e.shiftKey || link.target === '_blank') return;
    if (link.pathname === location.pathname) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = link.href; }, 250);
  });
});

window.addEventListener('pageshow', () => document.body.classList.remove('leaving'));
