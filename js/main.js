gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   NAV: scroll state, mobile menu
   ============================================================ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (nav) {
  ScrollTrigger.create({
    start: 40,
    end: 99999,
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 40),
  });
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* ============================================================
   NAV: highlight current page link
   ============================================================ */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
})();

/* ============================================================
   HERO ENTRANCE (home page)
   ============================================================ */
if (document.querySelector('.hero .reveal-up')) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
    .to('.hero-visual', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
}

/* ============================================================
   PAGE HERO ENTRANCE (secondary pages)
   ============================================================ */
if (document.querySelector('.page-hero .reveal-up')) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.page-hero .eyebrow', { opacity: 1, y: 0, duration: 0.6 })
    .to('.page-hero h1', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.page-hero p', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
}

/* ============================================================
   Set initial hidden state for bespoke-timeline elements
   (keeps them out of the generic .reveal-up scroll-observer)
   ============================================================ */
const HERO_SELECTORS = '.hero-eyebrow, .hero-title, .hero-sub, .hero-actions, .hero-visual, .page-hero .eyebrow, .page-hero h1, .page-hero p';

/* ============================================================
   GENERIC SCROLL REVEALS
   ============================================================ */
gsap.utils.toArray('.reveal-up').forEach((el) => {
  if (el.matches(HERO_SELECTORS)) return;
  gsap.fromTo(el,
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }
  );
});

/* ============================================================
   STAT COUNT-UP
   ============================================================ */
document.querySelectorAll('.stat-num[data-count]').forEach((el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const counter = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(counter.val) + (target >= 50 ? '+' : ''); },
      });
    },
  });
});

/* ============================================================
   FLAVOR FILTER TABS (menu.html)
   ============================================================ */
(function () {
  const tabs = document.querySelectorAll('.flavor-tab');
  const cards = document.querySelectorAll('.flavor-card');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const match = filter === 'all' || card.getAttribute('data-cat') === filter;
        if (match) {
          card.hidden = false;
          gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
        } else {
          gsap.to(card, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => { card.hidden = true; } });
        }
      });
    });
  });
})();

/* ============================================================
   GENERIC FORM SUBMIT HANDLER
   ============================================================ */
function wireForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach((field) => {
      const errorEl = document.getElementById(field.id + '-error');
      if (!field.value || (field.type === 'checkbox' && !field.checked)) {
        valid = false;
        if (errorEl) errorEl.textContent = 'This field is required.';
      } else if (errorEl) {
        errorEl.textContent = '';
      }
    });

    if (!valid) return;

    form.hidden = true;
    success.classList.remove('hidden');
    gsap.fromTo(success, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    form.reset();
  });
}

wireForm('wholesale-form', 'wholesale-success');
wireForm('donation-form', 'donation-success');
wireForm('spirit-night-form', 'spirit-night-success');
wireForm('work-form', 'work-success');
wireForm('party-form', 'party-success');
wireForm('contact-form', 'contact-success');
wireForm('flavor-form', 'flavor-success');
wireForm('catering-form', 'catering-success');
